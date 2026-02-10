import { and, eq, isNull, ne, sql } from "drizzle-orm";
import { clubMembers, type ClubMember } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

export type PlayerClubMembershipRow = Pick<ClubMember, "clubId">;
export type ClubMemberRoleRow = Pick<ClubMember, "clubId" | "playerId" | "role" | "leftAt">;
export type ActivePresidentRow = Pick<ClubMember, "clubId" | "playerId">;
export type ClubRoleValue = ClubMember["role"];

type DbClient = (typeof import("@/lib/drizzle"))["db"];

interface GetPlayerClubMembershipProps {
  db: Transaction | DbClient;
  playerId: string;
}

export async function getPlayerClubMembership({
  db,
  playerId,
}: GetPlayerClubMembershipProps): Promise<PlayerClubMembershipRow | null> {
  const rows = await db
    .select({
      clubId: clubMembers.clubId,
    })
    .from(clubMembers)
    .where(and(eq(clubMembers.playerId, playerId), isNull(clubMembers.leftAt)))
    .limit(1);

  return rows[0] ?? null;
}

interface GetPlayerActiveClubMembershipForUpdateProps {
  db: Transaction;
  playerId: string;
}

export async function getPlayerActiveClubMembershipForUpdate({
  db,
  playerId,
}: GetPlayerActiveClubMembershipForUpdateProps): Promise<ClubMemberRoleRow | null> {
  const result = await db.execute(sql`
    select
      ${clubMembers.clubId} as "clubId",
      ${clubMembers.playerId} as "playerId",
      ${clubMembers.role} as "role",
      ${clubMembers.leftAt} as "leftAt"
    from ${clubMembers}
    where ${clubMembers.playerId} = ${playerId}
      and ${clubMembers.leftAt} is null
    limit 1
    for update
  `);

  return (result.rows[0] as ClubMemberRoleRow | undefined) ?? null;
}

interface LockActiveClubMembersByClubIdProps {
  db: Transaction;
  clubId: string;
}

export async function lockActiveClubMembersByClubId({
  db,
  clubId,
}: LockActiveClubMembersByClubIdProps): Promise<void> {
  await db.execute(sql`
    select ${clubMembers.id}
    from ${clubMembers}
    where ${clubMembers.clubId} = ${clubId}
      and ${clubMembers.leftAt} is null
    for update
  `);
}

interface GetClubMembershipByPlayerAndClubForUpdateProps {
  db: Transaction;
  playerId: string;
  clubId: string;
}

export async function getClubMembershipByPlayerAndClubForUpdate({
  db,
  playerId,
  clubId,
}: GetClubMembershipByPlayerAndClubForUpdateProps): Promise<ClubMemberRoleRow | null> {
  const result = await db.execute(sql`
    select
      ${clubMembers.clubId} as "clubId",
      ${clubMembers.playerId} as "playerId",
      ${clubMembers.role} as "role",
      ${clubMembers.leftAt} as "leftAt"
    from ${clubMembers}
    where ${clubMembers.clubId} = ${clubId}
      and ${clubMembers.playerId} = ${playerId}
      and ${clubMembers.leftAt} is null
    limit 1
    for update
  `);

  return (result.rows[0] as ClubMemberRoleRow | undefined) ?? null;
}

interface GetActivePresidentByClubIdForUpdateProps {
  db: Transaction;
  clubId: string;
}

export async function getActivePresidentByClubIdForUpdate({
  db,
  clubId,
}: GetActivePresidentByClubIdForUpdateProps): Promise<ActivePresidentRow | null> {
  const result = await db.execute(sql`
    select
      ${clubMembers.clubId} as "clubId",
      ${clubMembers.playerId} as "playerId"
    from ${clubMembers}
    where ${clubMembers.clubId} = ${clubId}
      and ${clubMembers.role} = 'president'
      and ${clubMembers.leftAt} is null
    limit 1
    for update
  `);

  return (result.rows[0] as ActivePresidentRow | undefined) ?? null;
}

interface ListActivePresidentsProps {
  db: Transaction | DbClient;
}

export async function listActivePresidents({
  db,
}: ListActivePresidentsProps): Promise<ActivePresidentRow[]> {
  return db
    .select({
      clubId: clubMembers.clubId,
      playerId: clubMembers.playerId,
    })
    .from(clubMembers)
    .where(and(eq(clubMembers.role, "president"), isNull(clubMembers.leftAt)));
}

interface AssignClubMemberRoleProps {
  db: Transaction;
  playerId: string;
  clubId: string;
  role: ClubRoleValue;
}

export async function assignClubMemberRole({
  db,
  playerId,
  clubId,
  role,
}: AssignClubMemberRoleProps): Promise<ClubMemberRoleRow | null> {
  const rows = await db
    .update(clubMembers)
    .set({ role })
    .where(
      and(
        eq(clubMembers.playerId, playerId),
        eq(clubMembers.clubId, clubId),
        isNull(clubMembers.leftAt)
      )
    )
    .returning({
      clubId: clubMembers.clubId,
      playerId: clubMembers.playerId,
      role: clubMembers.role,
      leftAt: clubMembers.leftAt,
    });

  return rows[0] ?? null;
}

interface CreateClubMembershipProps {
  db: Transaction;
  playerId: string;
  clubId: string;
  role?: ClubRoleValue;
}

export async function createClubMembership({
  db,
  playerId,
  clubId,
  role = "player",
}: CreateClubMembershipProps): Promise<ClubMemberRoleRow> {
  const rows = await db
    .insert(clubMembers)
    .values({
      playerId,
      clubId,
      role,
    })
    .returning({
      clubId: clubMembers.clubId,
      playerId: clubMembers.playerId,
      role: clubMembers.role,
      leftAt: clubMembers.leftAt,
    });

  return rows[0];
}

interface RemoveClubMemberRoleProps {
  db: Transaction;
  playerId: string;
  clubId: string;
}

export async function removeClubMemberRole({
  db,
  playerId,
  clubId,
}: RemoveClubMemberRoleProps): Promise<ClubMemberRoleRow | null> {
  const rows = await db
    .update(clubMembers)
    .set({ role: "player" })
    .where(
      and(
        eq(clubMembers.playerId, playerId),
        eq(clubMembers.clubId, clubId),
        ne(clubMembers.role, "player"),
        isNull(clubMembers.leftAt)
      )
    )
    .returning({
      clubId: clubMembers.clubId,
      playerId: clubMembers.playerId,
      role: clubMembers.role,
      leftAt: clubMembers.leftAt,
    });

  return rows[0] ?? null;
}

interface CountActiveClubMembersByRoleProps {
  db: Transaction;
  clubId: string;
  role: ClubRoleValue;
}

export async function countActiveClubMembersByRole({
  db,
  clubId,
  role,
}: CountActiveClubMembersByRoleProps): Promise<number> {
  const rows = await db
    .select({
      count: sql<number>`count(*)::int`,
    })
    .from(clubMembers)
    .where(
      and(eq(clubMembers.clubId, clubId), eq(clubMembers.role, role), isNull(clubMembers.leftAt))
    );

  return rows[0]?.count ?? 0;
}

interface MarkPlayerLeftClubProps {
  db: Transaction;
  playerId: string;
  clubId: string;
  leftAt?: Date;
}

export async function markPlayerLeftClub({
  db,
  playerId,
  clubId,
  leftAt = new Date(),
}: MarkPlayerLeftClubProps): Promise<ClubMemberRoleRow | null> {
  const rows = await db
    .update(clubMembers)
    .set({
      leftAt,
      role: "player",
    })
    .where(
      and(
        eq(clubMembers.playerId, playerId),
        eq(clubMembers.clubId, clubId),
        isNull(clubMembers.leftAt)
      )
    )
    .returning({
      clubId: clubMembers.clubId,
      playerId: clubMembers.playerId,
      role: clubMembers.role,
      leftAt: clubMembers.leftAt,
    });

  return rows[0] ?? null;
}
