import { getPlayerIdByUserId } from "@/repositories/playerRepository";
import { listPlayerInventoryItemsByPlayerId } from "@/repositories/playerItemsRepository";
import { db } from "@/lib/drizzle";

export interface GetLoggedPlayerInventoryParams {
  userId: string;
}

export async function getLoggedPlayerInventory({ userId }: GetLoggedPlayerInventoryParams) {
  const player = await getPlayerIdByUserId({
    db,
    userId,
  });

  if (!player) {
    throw new Error("Player not found.");
  }

  const items = await listPlayerInventoryItemsByPlayerId({
    db,
    playerId: player.id,
  });

  return {
    items,
  };
}
