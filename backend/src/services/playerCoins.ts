import { getPlayerCoinsById, getPlayerIdByUserId } from "@/repositories/playerRepository";
import { db } from "@/lib/drizzle";

export interface GetLoggedPlayerCoinsParams {
  userId: string;
}

export async function getLoggedPlayerCoins({ userId }: GetLoggedPlayerCoinsParams) {
  const player = await getPlayerIdByUserId({
    db,
    userId,
  });

  if (!player) {
    throw new Error("Player not found.");
  }

  const playerCoins = await getPlayerCoinsById({
    db,
    playerId: player.id,
  });

  if (!playerCoins) {
    throw new Error("Player not found.");
  }

  return {
    coins: playerCoins.coins,
  };
}
