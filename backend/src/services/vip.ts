import { db } from "@/lib/drizzle";
import { insertPlayerItemUsageLog } from "@/repositories/itemUsageLogsRepository";
import {
  decrementPlayerItemQuantity,
  getPlayerItemQuantityForUpdate,
} from "@/repositories/playerItemsRepository";
import { getPlayerVipForUpdate, updatePlayerVipExpiresAt } from "@/repositories/playerRepository";
import { getStoreItemById } from "@/repositories/storeItemsRepository";
import { assertPositiveInteger } from "@/utils/validation";

const VIP_USAGE_REASON = "vip_consumed";
const SECONDS_TO_MILLISECONDS = 1000;

export interface ConsumeVipItemParams {
  playerId: string;
  itemId: string;
}

export interface ConsumeMultipleVipItemsParams {
  playerId: string;
  itemId: string;
  quantity: number | "all";
}

interface ConsumeVipItemQuantityParams {
  playerId: string;
  itemId: string;
  quantity: number | "all";
}

async function consumeVipItemQuantity({
  playerId,
  itemId,
  quantity,
}: ConsumeVipItemQuantityParams): Promise<ConsumeVipItemResult> {
  return db.transaction(async (transaction) => {
    const player = await getPlayerVipForUpdate({
      db: transaction,
      playerId,
    });

    if (!player) {
      throw new Error("Player not found.");
    }

    const storeItem = await getStoreItemById({
      db: transaction,
      storeItemId: itemId,
    });

    if (!storeItem) {
      throw new Error("Store item not found.");
    }

    if (storeItem.type !== "vip") {
      throw new Error("Provided item is not a VIP item.");
    }

    if (storeItem.durationSeconds === null || storeItem.durationSeconds <= 0) {
      throw new Error("VIP item has invalid durationSeconds.");
    }

    const playerVipItemQuantity = await getPlayerItemQuantityForUpdate({
      db: transaction,
      playerId,
      itemId,
    });

    if (!playerVipItemQuantity || playerVipItemQuantity.quantity < 1) {
      throw new Error("Player does not have enough VIP item quantity.");
    }

    const quantityToConsume = quantity === "all" ? playerVipItemQuantity.quantity : quantity;

    if (playerVipItemQuantity.quantity < quantityToConsume) {
      throw new Error("Player does not have enough VIP item quantity.");
    }

    const consumedVipItem = await decrementPlayerItemQuantity({
      db: transaction,
      playerId,
      itemId,
      quantityToDecrease: quantityToConsume,
    });

    if (!consumedVipItem) {
      throw new Error("Unable to consume VIP item.");
    }

    const totalDurationSeconds = storeItem.durationSeconds * quantityToConsume;
    assertPositiveInteger(totalDurationSeconds, "totalDurationSeconds");

    const currentDate = new Date();
    // TODO: hasActivevip is already used
    const hasActiveVip = player.vipExpiresAt !== null && player.vipExpiresAt >= currentDate;

    const vipDurationStartAt = hasActiveVip ? player.vipExpiresAt : currentDate;
    const newVipExpiresAt = new Date(
      vipDurationStartAt.getTime() + totalDurationSeconds * SECONDS_TO_MILLISECONDS
    );

    const updatedPlayerVip = await updatePlayerVipExpiresAt({
      db: transaction,
      playerId,
      vipExpiresAt: newVipExpiresAt,
    });

    if (!updatedPlayerVip) {
      throw new Error("Unable to extend player VIP.");
    }

    await insertPlayerItemUsageLog({
      db: transaction,
      itemId,
      playerId,
      quantityUsed: quantityToConsume,
      reason: VIP_USAGE_REASON,
    });

    console.log(
      `[vip] playerId=${playerId} itemId=${itemId} quantity=${quantityToConsume} newVipExpiresAt=${newVipExpiresAt.toISOString()}`
    );

    return {
      playerId,
      itemId,
      quantityConsumed: quantityToConsume,
      remainingQuantity: consumedVipItem.quantity,
      newVipExpiresAt,
    };
  });
}

export interface ConsumeVipItemResult {
  playerId: string;
  itemId: string;
  quantityConsumed: number;
  remainingQuantity: number;
  newVipExpiresAt: Date;
}

export async function consumeVipItem({
  playerId,
  itemId,
}: ConsumeVipItemParams): Promise<ConsumeVipItemResult> {
  return consumeVipItemQuantity({
    playerId,
    itemId,
    quantity: 1,
  });
}

export async function consumeMultipleVipItems({
  playerId,
  itemId,
  quantity,
}: ConsumeMultipleVipItemsParams): Promise<ConsumeVipItemResult> {
  if (quantity !== "all") {
    assertPositiveInteger(quantity, "quantity");
  }

  return consumeVipItemQuantity({
    playerId,
    itemId,
    quantity,
  });
}
