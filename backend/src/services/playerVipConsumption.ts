import { db } from "@/lib/drizzle";
import { getPlayerIdByUserId } from "@/repositories/playerRepository";
import { consumeMultipleVipItems, consumeVipItem } from "@/services/vip";

export interface ConsumeLoggedPlayerVipParams {
  userId: string;
  itemId: string;
  quantity?: number;
  useAll?: boolean;
}

export async function consumeLoggedPlayerVip({
  userId,
  itemId,
  quantity,
  useAll = false,
}: ConsumeLoggedPlayerVipParams) {
  const player = await getPlayerIdByUserId({
    db,
    userId,
  });

  if (!player) {
    throw new Error("Player not found.");
  }

  if (useAll) {
    return consumeMultipleVipItems({
      playerId: player.id,
      itemId,
      quantity: "all",
    });
  }

  if (quantity === undefined || quantity === 1) {
    return consumeVipItem({
      playerId: player.id,
      itemId,
    });
  }

  return consumeMultipleVipItems({
    playerId: player.id,
    itemId,
    quantity,
  });
}
