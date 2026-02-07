import { db } from "@/lib/drizzle";
import {
  assignClubMemberRole,
  demoteActivePresidentToPlayer,
  getActivePresidentByClubIdForUpdate,
  getClubMembershipByPlayerAndClubForUpdate,
  lockActiveClubMembersByClubId,
  removeClubMemberRole,
  type ClubRoleValue,
} from "@/repositories/clubMembersRepository";
import { getPlayerById } from "@/repositories/playerRepository";
import { isVipActive } from "@/utils/gameplay";

export type ClubPresidencyChangeResult = {
  changed: boolean;
  clubId: string;
  playerId?: string;
};

function logRoleChange({
  clubId,
  playerId,
  previousRole,
  nextRole,
  reason,
}: {
  clubId: string;
  playerId: string;
  previousRole: ClubRoleValue;
  nextRole: ClubRoleValue;
  reason: string;
}) {
  console.log(
    `[club_presidency] role_changed clubId=${clubId} playerId=${playerId} previousRole=${previousRole} nextRole=${nextRole} reason=${reason}`
  );
}

export async function claimPresidency(
  playerId: string,
  clubId: string
): Promise<ClubPresidencyChangeResult> {
  return db.transaction(async (transaction) => {
    await lockActiveClubMembersByClubId({ db: transaction, clubId });

    const clubMembership = await getClubMembershipByPlayerAndClubForUpdate({
      db: transaction,
      playerId,
      clubId,
    });

    if (!clubMembership) {
      throw new Error("Player does not belong to this club.");
    }

    const player = await getPlayerById({ db: transaction, playerId });
    if (!player) {
      throw new Error("Player not found.");
    }

    const currentDate = new Date();
    if (!isVipActive(player.vipExpiresAt, currentDate)) {
      throw new Error("Player needs an active VIP to claim presidency.");
    }

    const activePresident = await getActivePresidentByClubIdForUpdate({
      db: transaction,
      clubId,
    });

    if (activePresident) {
      throw new Error("Club already has a president.");
    }

    const updatedClubMember = await assignClubMemberRole({
      db: transaction,
      playerId,
      clubId,
      role: "president",
    });

    if (!updatedClubMember) {
      throw new Error("Unable to assign presidency role.");
    }

    logRoleChange({
      clubId,
      playerId,
      previousRole: clubMembership.role,
      nextRole: "president",
      reason: "claim_presidency",
    });

    return {
      changed: true,
      clubId,
      playerId,
    };
  });
}

export async function removePresident(
  clubId: string,
  reason: string
): Promise<ClubPresidencyChangeResult> {
  return db.transaction(async (transaction) => {
    await lockActiveClubMembersByClubId({ db: transaction, clubId });

    const activePresident = await getActivePresidentByClubIdForUpdate({
      db: transaction,
      clubId,
    });

    if (!activePresident) {
      return {
        changed: false,
        clubId,
      };
    }

    const demotedPresident = await demoteActivePresidentToPlayer({
      db: transaction,
      clubId,
    });

    if (!demotedPresident) {
      return {
        changed: false,
        clubId,
      };
    }

    logRoleChange({
      clubId,
      playerId: demotedPresident.playerId,
      previousRole: "president",
      nextRole: "player",
      reason,
    });

    return {
      changed: true,
      clubId,
      playerId: demotedPresident.playerId,
    };
  });
}

export async function makePresidencyAvailable(
  clubId: string,
  reason: string
): Promise<ClubPresidencyChangeResult> {
  return removePresident(clubId, reason);
}

export async function removePlayerRole(
  playerId: string,
  clubId: string,
  reason: string
): Promise<ClubPresidencyChangeResult> {
  return db.transaction(async (transaction) => {
    await lockActiveClubMembersByClubId({ db: transaction, clubId });

    const clubMembership = await getClubMembershipByPlayerAndClubForUpdate({
      db: transaction,
      playerId,
      clubId,
    });

    if (!clubMembership) {
      return {
        changed: false,
        clubId,
        playerId,
      };
    }

    if (clubMembership.role === "player") {
      return {
        changed: false,
        clubId,
        playerId,
      };
    }

    const updatedClubMember = await removeClubMemberRole({
      db: transaction,
      playerId,
      clubId,
    });

    if (!updatedClubMember) {
      return {
        changed: false,
        clubId,
        playerId,
      };
    }

    logRoleChange({
      clubId,
      playerId,
      previousRole: clubMembership.role,
      nextRole: "player",
      reason,
    });

    return {
      changed: true,
      clubId,
      playerId,
    };
  });
}
