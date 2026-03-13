import {
  getClubMembershipByPlayerAndClub,
  type ClubRoleValue,
} from "@/repositories/clubMembersRepository";
import { getClubById } from "@/repositories/clubRepository";
import { getPlayerIdByUserId } from "@/repositories/playerRepository";
import { db } from "@/lib/drizzle";

const CLUB_MANAGEMENT_ACCESS_ROLES: ClubRoleValue[] = ["president", "vice_president", "director"];

export interface AssertClubManagementAccessParams {
  userId: string;
  clubId: string;
}

interface AssertClubMembershipAccessParams {
  userId: string;
  clubId: string;
}

async function getActorMembershipForClub({ userId, clubId }: AssertClubMembershipAccessParams) {
  const actorPlayer = await getPlayerIdByUserId({
    db,
    userId,
  });

  if (!actorPlayer) {
    throw new Error("Actor player not found.");
  }

  const club = await getClubById(clubId);

  if (!club) {
    throw new Error("Club not found.");
  }

  const actorMembership = await getClubMembershipByPlayerAndClub({
    db,
    playerId: actorPlayer.id,
    clubId,
  });

  if (!actorMembership) {
    throw new Error("Actor player does not belong to this club.");
  }

  return actorMembership;
}

export async function assertClubMembershipAccess({
  userId,
  clubId,
}: AssertClubMembershipAccessParams): Promise<void> {
  await getActorMembershipForClub({
    userId,
    clubId,
  });
}

export async function assertClubManagementAccess({
  userId,
  clubId,
}: AssertClubManagementAccessParams): Promise<void> {
  const actorMembership = await getActorMembershipForClub({
    userId,
    clubId,
  });

  if (!CLUB_MANAGEMENT_ACCESS_ROLES.includes(actorMembership.role)) {
    throw new Error("Actor does not have permission to access this club resource.");
  }
}
