import { getPlayerIdByUserId } from "@/repositories/playerRepository";
import { buyStoreItemWithClubCoins } from "@/services/clubEconomy";
import { db } from "@/lib/drizzle";

export interface BuyClubStoreItemWithCoinsParams {
  userId: string;
  clubId: string;
  storeItemId: string;
  quantity: number;
}

export async function buyClubStoreItemWithCoins({
  userId,
  clubId,
  storeItemId,
  quantity,
}: BuyClubStoreItemWithCoinsParams) {
  const actorPlayer = await getPlayerIdByUserId({
    db,
    userId,
  });

  if (!actorPlayer) {
    throw new Error("Actor player not found.");
  }

  const result = await buyStoreItemWithClubCoins({
    actorPlayerId: actorPlayer.id,
    clubId,
    storeItemId,
    quantity,
  });

  return {
    clubId: result.clubId,
  };
}
