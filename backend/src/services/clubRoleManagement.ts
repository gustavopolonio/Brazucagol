import { db } from "@/lib/drizzle";
import { getPlayerIdByUserId } from "@/repositories/playerRepository";
import { assignRole, removeRole } from "@/services/clubRole";

type AssignableClubRole = "vice_president" | "director" | "captain";

export interface AssignClubRoleForUserParams {
  userId: string;
  clubId: string;
  targetPlayerId: string;
  roleToAssign: AssignableClubRole;
}

export async function assignClubRoleForUser({
  userId,
  clubId,
  targetPlayerId,
  roleToAssign,
}: AssignClubRoleForUserParams) {
  const actorPlayer = await getPlayerIdByUserId({
    db,
    userId,
  });

  if (!actorPlayer) {
    throw new Error("Actor player not found.");
  }

  return assignRole({
    actorPlayerId: actorPlayer.id,
    targetPlayerId,
    clubId,
    roleToAssign,
  });
}

export interface RemoveClubRoleForUserParams {
  userId: string;
  clubId: string;
  targetPlayerId: string;
}

export async function removeClubRoleForUser({
  userId,
  clubId,
  targetPlayerId,
}: RemoveClubRoleForUserParams) {
  const actorPlayer = await getPlayerIdByUserId({
    db,
    userId,
  });

  if (!actorPlayer) {
    throw new Error("Actor player not found.");
  }

  if (actorPlayer.id === targetPlayerId) {
    throw new Error("Use the self role removal flow for your own role.");
  }

  return removeRole({
    actorPlayerId: actorPlayer.id,
    targetPlayerId,
    clubId,
  });
}

export interface RemoveOwnClubRoleForUserParams {
  userId: string;
  clubId: string;
}

export async function removeOwnClubRoleForUser({ userId, clubId }: RemoveOwnClubRoleForUserParams) {
  const actorPlayer = await getPlayerIdByUserId({
    db,
    userId,
  });

  if (!actorPlayer) {
    throw new Error("Actor player not found.");
  }

  return removeRole({
    actorPlayerId: actorPlayer.id,
    targetPlayerId: actorPlayer.id,
    clubId,
  });
}
