import { db } from "@/lib/drizzle";
import { getPlayerIdByUserId } from "@/repositories/playerRepository";
import { claimPresidency, makePresidencyAvailable } from "@/services/clubPresidency";

const RESIGN_PRESIDENCY_REASON = "resign_presidency";

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

export interface ResignClubPresidencyForUserParams {
  userId: string;
  clubId: string;
}

export async function resignClubPresidencyForUser({
  userId,
  clubId,
}: ResignClubPresidencyForUserParams) {
  const actorPlayer = await getPlayerIdByUserId({
    db,
    userId,
  });

  if (!actorPlayer) {
    throw new Error("Actor player not found.");
  }

  return makePresidencyAvailable(actorPlayer.id, clubId, RESIGN_PRESIDENCY_REASON);
}
