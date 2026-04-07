import { db } from "@/lib/drizzle";
import { getPlayerIdByUserId } from "@/repositories/playerRepository";
import { claimPresidency } from "@/services/clubPresidency";

export interface ClaimClubPresidencyForUserParams {
  userId: string;
  clubId: string;
}

export async function claimClubPresidencyForUser({
  userId,
  clubId,
}: ClaimClubPresidencyForUserParams) {
  const actorPlayer = await getPlayerIdByUserId({
    db,
    userId,
  });

  if (!actorPlayer) {
    throw new Error("Actor player not found.");
  }

  return claimPresidency(actorPlayer.id, clubId);
}
