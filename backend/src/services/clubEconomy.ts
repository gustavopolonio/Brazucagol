import { type ClubRoleValue } from "@/repositories/clubMembersRepository";
import { db } from "@/lib/drizzle";
import { getClubMembershipByPlayerAndClubForUpdate } from "@/repositories/clubMembersRepository";
import {
  getClubItemQuantityForUpdate,
  setClubItemQuantity,
  upsertClubItemQuantityIncrease,
} from "@/repositories/clubItemsRepository";
import { decrementClubCoins, getClubCoinsForUpdate } from "@/repositories/clubRepository";
import { insertClubItemPurchaseLogWithCoins } from "@/repositories/itemPurchaseLogsRepository";
import { insertItemTransferLog } from "@/repositories/itemTransferLogsRepository";
import { upsertPlayerItemQuantityIncrease } from "@/repositories/playerItemsRepository";
import { getStoreItemById } from "@/repositories/storeItemsRepository";
import { assertPositiveInteger, assertStoreItemAllowsCoins } from "@/utils/validation";

const CLUB_ECONOMY_MANAGER_ROLES: ClubRoleValue[] = ["president", "vice_president", "director"];
const CLUB_VIP_MANAGER_ROLES: ClubRoleValue[] = ["president", "vice_president"];

export interface SpendClubCoinsParams {
  actorPlayerId: string;
  clubId: string;
  amount: number;
  reason: string;
}

export interface BuyStoreItemWithClubCoinsParams {
  actorPlayerId: string;
  clubId: string;
  storeItemId: string;
  quantity: number;
}

export interface GiveClubItemToPlayerParams {
  actorPlayerId: string;
  targetPlayerId: string;
  clubId: string;
  itemId: string;
  quantity: number;
  reason: string;
}

type ClubEconomyOperationResult = {
  clubId: string;
  actorPlayerId: string;
};

function assertActorCanManageClubEconomy(actorRole: ClubRoleValue): void {
  if (!CLUB_ECONOMY_MANAGER_ROLES.includes(actorRole)) {
    throw new Error("Actor does not have permission to manage club economy.");
  }
}

function assertActorCanManageVipItems(actorRole: ClubRoleValue): void {
  if (!CLUB_VIP_MANAGER_ROLES.includes(actorRole)) {
    throw new Error("Actor does not have permission to manage VIP items.");
  }
}

export async function buyStoreItemWithClubCoins({
  actorPlayerId,
  clubId,
  storeItemId,
  quantity,
}: BuyStoreItemWithClubCoinsParams): Promise<ClubEconomyOperationResult> {
  assertPositiveInteger(quantity, "quantity");

  return db.transaction(async (transaction) => {
    const actorMembership = await getClubMembershipByPlayerAndClubForUpdate({
      db: transaction,
      playerId: actorPlayerId,
      clubId,
    });

    if (!actorMembership) {
      throw new Error("Actor player does not belong to this club.");
    }

    assertActorCanManageClubEconomy(actorMembership.role);

    const storeItem = await getStoreItemById({
      db: transaction,
      storeItemId,
    });

    if (!storeItem) {
      throw new Error("Store item not found.");
    }

    assertStoreItemAllowsCoins(
      storeItem.pricingType,
      "Store item cannot be purchased with club coins."
    );

    if (storeItem.coinPriceCents === null) {
      throw new Error("Store item does not have a coin price.");
    }

    if (storeItem.type === "vip") {
      assertActorCanManageVipItems(actorMembership.role);
    }

    const totalPrice = storeItem.coinPriceCents * quantity;
    assertPositiveInteger(totalPrice, "totalPrice");

    const clubCoins = await getClubCoinsForUpdate({
      db: transaction,
      clubId,
    });

    if (!clubCoins) {
      throw new Error("Club not found.");
    }

    if (clubCoins.coins < totalPrice) {
      throw new Error("Club does not have enough coins.");
    }

    const updatedClubCoins = await decrementClubCoins({
      db: transaction,
      clubId,
      amount: totalPrice,
    });

    if (!updatedClubCoins) {
      throw new Error("Unable to complete club item purchase.");
    }

    await upsertClubItemQuantityIncrease({
      db: transaction,
      clubId,
      itemId: storeItemId,
      quantityToIncrease: quantity,
    });

    await insertClubItemPurchaseLogWithCoins({
      db: transaction,
      clubId,
      itemId: storeItemId,
      unitPrice: storeItem.coinPriceCents,
      quantity,
    });

    console.log(
      `[club_economy] buy_store_item_with_club_coins actorPlayerId=${actorPlayerId} clubId=${clubId} storeItemId=${storeItemId} quantity=${quantity} totalPrice=${totalPrice} remainingCoins=${updatedClubCoins.coins}`
    );

    return {
      clubId,
      actorPlayerId,
    };
  });
}

export async function giveClubItemToPlayer({
  actorPlayerId,
  targetPlayerId,
  clubId,
  itemId,
  quantity,
  reason,
}: GiveClubItemToPlayerParams): Promise<ClubEconomyOperationResult> {
  assertPositiveInteger(quantity, "quantity");

  return db.transaction(async (transaction) => {
    const actorMembership = await getClubMembershipByPlayerAndClubForUpdate({
      db: transaction,
      playerId: actorPlayerId,
      clubId,
    });

    if (!actorMembership) {
      throw new Error("Actor player does not belong to this club.");
    }

    assertActorCanManageClubEconomy(actorMembership.role);

    const targetMembership = await getClubMembershipByPlayerAndClubForUpdate({
      db: transaction,
      playerId: targetPlayerId,
      clubId,
    });

    if (!targetMembership) {
      throw new Error("Target player does not belong to this club.");
    }

    const storeItem = await getStoreItemById({
      db: transaction,
      storeItemId: itemId,
    });

    if (!storeItem) {
      throw new Error("Item not found.");
    }

    if (storeItem.type === "vip") {
      assertActorCanManageVipItems(actorMembership.role);
    }

    const currentClubItem = await getClubItemQuantityForUpdate({
      db: transaction,
      clubId,
      itemId,
    });

    if (!currentClubItem || currentClubItem.quantity < quantity) {
      throw new Error("Club does not have enough item quantity.");
    }

    const newQuantity = currentClubItem.quantity - quantity;
    const updatedClubItem = await setClubItemQuantity({
      db: transaction,
      clubId,
      itemId,
      quantity: newQuantity,
    });

    if (!updatedClubItem) {
      throw new Error("Unable to update club item quantity.");
    }

    const updatedPlayerItem = await upsertPlayerItemQuantityIncrease({
      db: transaction,
      playerId: targetPlayerId,
      itemId,
      quantityToIncrease: quantity,
    });

    await insertItemTransferLog({
      db: transaction,
      itemId,
      fromClubId: clubId,
      fromPlayerId: null,
      toClubId: null,
      toPlayerId: targetPlayerId,
      quantity,
      reason,
    });

    console.log(
      `[club_economy] give_club_item_to_player actorPlayerId=${actorPlayerId} targetPlayerId=${targetPlayerId} clubId=${clubId} itemId=${itemId} transferredQuantity=${quantity} previousClubQuantity=${currentClubItem.quantity} newClubQuantity=${updatedClubItem.quantity} newPlayerQuantity=${updatedPlayerItem.quantity} reason=${reason}`
    );

    return {
      clubId,
      actorPlayerId,
    };
  });
}
