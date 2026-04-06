import { getPlayerIdByUserId } from "@/repositories/playerRepository";
import { giveClubItemToPlayer } from "@/services/clubEconomy";
import { db } from "@/lib/drizzle";

export interface GiveClubItemParams {
  userId: string;
  clubId: string;
  targetPlayerId: string;
  itemId: string;
  quantity: number;
  reason: string;
}

export async function giveClubItem({
  userId,
  clubId,
  targetPlayerId,
  itemId,
  quantity,
  reason,
}: GiveClubItemParams) {
  const actorPlayer = await getPlayerIdByUserId({
    db,
    userId,
  });

  if (!actorPlayer) {
    throw new Error("Actor player not found.");
  }

  const result = await giveClubItemToPlayer({
    actorPlayerId: actorPlayer.id,
    targetPlayerId,
    clubId,
    itemId,
    quantity,
    reason,
  });

  return {
    clubId: result.clubId,
  };
}
