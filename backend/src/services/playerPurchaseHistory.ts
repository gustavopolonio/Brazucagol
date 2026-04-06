import { listPlayerPurchaseHistory } from "@/repositories/itemPurchaseLogsRepository";
import { getPlayerIdByUserId } from "@/repositories/playerRepository";
import { db } from "@/lib/drizzle";

export interface GetLoggedPlayerPurchaseHistoryParams {
  userId: string;
}

export async function getLoggedPlayerPurchaseHistory({
  userId,
}: GetLoggedPlayerPurchaseHistoryParams) {
  const player = await getPlayerIdByUserId({
    db,
    userId,
  });

  if (!player) {
    throw new Error("Player not found.");
  }

  const purchases = await listPlayerPurchaseHistory({
    db,
    playerId: player.id,
  });

  return {
    purchases,
  };
}
