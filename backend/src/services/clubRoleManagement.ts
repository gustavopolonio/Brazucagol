import { db } from "@/lib/drizzle";
import { getPlayerIdByUserId } from "@/repositories/playerRepository";
import { assignRole } from "@/services/clubRole";

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
