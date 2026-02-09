import { db } from "@/lib/drizzle";
import {
  assignClubMemberRole,
  countActiveClubMembersByRole,
  getClubMembershipByPlayerAndClubForUpdate,
  removeClubMemberRole,
  lockActiveClubMembersByClubId,
  type ClubRoleValue,
} from "@/repositories/clubMembersRepository";

type AssignableClubRole = "vice_president" | "director" | "captain";
type RoleChangeReason = "assign_role" | "remove_role" | "self_remove_role";

const CLUB_ROLE_LIMIT_BY_ROLE: Record<AssignableClubRole, number> = {
  vice_president: 1,
  director: 9,
  captain: 10,
};

const PRESIDENT_ASSIGNABLE_ROLES: AssignableClubRole[] = ["vice_president", "director", "captain"];
const VICE_PRESIDENT_ASSIGNABLE_ROLES: AssignableClubRole[] = ["director", "captain"];
const PRESIDENT_REMOVABLE_ROLES: ClubRoleValue[] = ["vice_president", "director", "captain"];
const VICE_PRESIDENT_REMOVABLE_ROLES: ClubRoleValue[] = ["director", "captain"];

export interface AssignClubRoleParams {
  actorPlayerId: string;
  targetPlayerId: string;
  clubId: string;
  roleToAssign: AssignableClubRole;
}

export interface RemoveClubRoleParams {
  actorPlayerId: string;
  targetPlayerId: string;
  clubId: string;
}

export type ClubRoleChangeResult = {
  changed: boolean;
  clubId: string;
  actorPlayerId: string;
  targetPlayerId: string;
  previousRole: ClubRoleValue;
  newRole: ClubRoleValue;
};

function logRoleChange({
  actorPlayerId,
  targetPlayerId,
  clubId,
  previousRole,
  newRole,
  reason,
}: {
  actorPlayerId: string;
  targetPlayerId: string;
  clubId: string;
  previousRole: ClubRoleValue;
  newRole: ClubRoleValue;
  reason: RoleChangeReason;
}) {
  console.log(
    `[club_role] role_changed actorPlayerId=${actorPlayerId} targetPlayerId=${targetPlayerId} clubId=${clubId} previousRole=${previousRole} newRole=${newRole} reason=${reason}`
  );
}

function assertRoleCanBeAssigned(roleToAssign: AssignableClubRole): void {
  if (
    roleToAssign === "vice_president" ||
    roleToAssign === "director" ||
    roleToAssign === "captain"
  )
    return;

  throw new Error("Invalid role assignment target.");
}

function actorCanAssignRole(actorRole: ClubRoleValue, roleToAssign: AssignableClubRole): boolean {
  if (actorRole === "president") {
    return PRESIDENT_ASSIGNABLE_ROLES.includes(roleToAssign);
  }

  if (actorRole === "vice_president") {
    return VICE_PRESIDENT_ASSIGNABLE_ROLES.includes(roleToAssign);
  }

  return false;
}

function actorCanRemoveRole(actorRole: ClubRoleValue, targetRole: ClubRoleValue): boolean {
  if (actorRole === "president") {
    return PRESIDENT_REMOVABLE_ROLES.includes(targetRole);
  }

  if (actorRole === "vice_president") {
    return VICE_PRESIDENT_REMOVABLE_ROLES.includes(targetRole);
  }

  return false;
}

function assertActorCanAssignRole({
  actorRole,
  roleToAssign,
}: {
  actorRole: ClubRoleValue;
  roleToAssign: AssignableClubRole;
}): void {
  if (!actorCanAssignRole(actorRole, roleToAssign)) {
    throw new Error("Actor does not have permission to assign this role.");
  }
}

function assertActorCanRemoveRole({
  actorRole,
  targetRole,
}: {
  actorRole: ClubRoleValue;
  targetRole: ClubRoleValue;
}): void {
  if (!actorCanRemoveRole(actorRole, targetRole)) {
    throw new Error("Actor does not have permission to remove this role.");
  }
}

export async function assignRole({
  actorPlayerId,
  targetPlayerId,
  clubId,
  roleToAssign,
}: AssignClubRoleParams): Promise<ClubRoleChangeResult> {
  assertRoleCanBeAssigned(roleToAssign);

  return db.transaction(async (transaction) => {
    await lockActiveClubMembersByClubId({
      db: transaction,
      clubId,
    });

    const actorMembership = await getClubMembershipByPlayerAndClubForUpdate({
      db: transaction,
      playerId: actorPlayerId,
      clubId,
    });

    if (!actorMembership) {
      throw new Error("Actor player does not belong to this club.");
    }

    const targetMembership = await getClubMembershipByPlayerAndClubForUpdate({
      db: transaction,
      playerId: targetPlayerId,
      clubId,
    });

    if (!targetMembership) {
      throw new Error("Target player does not belong to this club.");
    }

    if (targetMembership.role === "president") {
      throw new Error("Cannot assign or replace the president role.");
    }

    if (targetMembership.role === roleToAssign) {
      throw new Error("Target player already has this role.");
    }

    assertActorCanAssignRole({
      actorRole: actorMembership.role,
      roleToAssign,
    });

    const currentRoleCount = await countActiveClubMembersByRole({
      db: transaction,
      clubId,
      role: roleToAssign,
    });

    const roleLimit = CLUB_ROLE_LIMIT_BY_ROLE[roleToAssign];
    if (currentRoleCount >= roleLimit) {
      throw new Error(`Role limit reached for ${roleToAssign}.`);
    }

    const previousRole = targetMembership.role;
    const updatedTargetMembership = await assignClubMemberRole({
      db: transaction,
      playerId: targetPlayerId,
      clubId,
      role: roleToAssign,
    });

    if (!updatedTargetMembership) {
      throw new Error("Failed to assign role to target player.");
    }

    logRoleChange({
      actorPlayerId,
      targetPlayerId,
      clubId,
      previousRole,
      newRole: updatedTargetMembership.role,
      reason: "assign_role",
    });

    return {
      changed: true,
      clubId,
      actorPlayerId,
      targetPlayerId,
      previousRole,
      newRole: updatedTargetMembership.role,
    };
  });
}

export async function removeRole({
  actorPlayerId,
  targetPlayerId,
  clubId,
}: RemoveClubRoleParams): Promise<ClubRoleChangeResult> {
  return db.transaction(async (transaction) => {
    await lockActiveClubMembersByClubId({
      db: transaction,
      clubId,
    });

    const actorMembership = await getClubMembershipByPlayerAndClubForUpdate({
      db: transaction,
      playerId: actorPlayerId,
      clubId,
    });

    if (!actorMembership) {
      throw new Error("Actor player does not belong to this club.");
    }

    const targetMembership = await getClubMembershipByPlayerAndClubForUpdate({
      db: transaction,
      playerId: targetPlayerId,
      clubId,
    });

    if (!targetMembership) {
      throw new Error("Target player does not belong to this club.");
    }

    if (targetMembership.role === "president") {
      throw new Error("Cannot remove president role.");
    }

    if (targetMembership.role === "player") {
      throw new Error("Target player already has default role.");
    }

    const isSelfRemoval = actorPlayerId === targetPlayerId;

    if (!isSelfRemoval) {
      assertActorCanRemoveRole({
        actorRole: actorMembership.role,
        targetRole: targetMembership.role,
      });
    }

    const previousRole = targetMembership.role;
    const updatedTargetMembership = await removeClubMemberRole({
      db: transaction,
      playerId: targetPlayerId,
      clubId,
    });

    if (!updatedTargetMembership) {
      throw new Error("Failed to remove target role.");
    }

    logRoleChange({
      actorPlayerId,
      targetPlayerId,
      clubId,
      previousRole,
      newRole: updatedTargetMembership.role,
      reason: isSelfRemoval ? "self_remove_role" : "remove_role",
    });

    return {
      changed: true,
      clubId,
      actorPlayerId,
      targetPlayerId,
      previousRole,
      newRole: updatedTargetMembership.role,
    };
  });
}
