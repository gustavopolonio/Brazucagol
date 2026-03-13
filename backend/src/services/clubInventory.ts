import {
  getClubMembershipByPlayerAndClub,
  type ClubRoleValue,
} from "@/repositories/clubMembersRepository";
import { listClubInventoryItemsByClubId } from "@/repositories/clubItemsRepository";
import { getClubById } from "@/repositories/clubRepository";
import { getPlayerIdByUserId } from "@/repositories/playerRepository";
import { db } from "@/lib/drizzle";

const CLUB_INVENTORY_ACCESS_ROLES: ClubRoleValue[] = ["president", "vice_president", "director"];

export interface GetClubInventoryParams {
  userId: string;
  clubId: string;
}

export async function getClubInventory({ userId, clubId }: GetClubInventoryParams) {
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

  if (!CLUB_INVENTORY_ACCESS_ROLES.includes(actorMembership.role)) {
    throw new Error("Actor does not have permission to access club inventory.");
  }

  const items = await listClubInventoryItemsByClubId({
    db,
    clubId,
  });

  return {
    items,
  };
}
