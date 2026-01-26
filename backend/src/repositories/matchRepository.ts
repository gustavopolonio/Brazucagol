import { eq, sql } from "drizzle-orm";
import { matches, type Match } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

type DbClient = (typeof import("@/lib/drizzle"))["db"];

export type MatchRow = Pick<
  Match,
  "id" | "status" | "homeGoals" | "awayGoals" | "clubHomeId" | "clubAwayId"
>;

export type LockedRoundMatch = MatchRow;

interface GetEarliestPendingRoundDateProps {
  db: Transaction | DbClient;
  now: Date;
}

export async function getEarliestPendingRoundDate({
  db,
  now,
}: GetEarliestPendingRoundDateProps): Promise<Date | null> {
  const result = await db.execute(sql`
    select min(${matches.date}) as "roundDate"
    from ${matches}
    where ${matches.status} = 'pending'
      and ${matches.date} <= ${now}
  `);

  const row = result.rows[0] as { roundDate: Date | string | null } | undefined;
  if (!row?.roundDate) {
    return null;
  }
  return new Date(row.roundDate);
}

interface GetEarliestInProgressRoundDateProps {
  db: Transaction | DbClient;
  now: Date;
}

export async function getEarliestInProgressRoundDate({
  db,
  now,
}: GetEarliestInProgressRoundDateProps): Promise<Date | null> {
  const result = await db.execute(sql`
    select min(${matches.date}) as "roundDate"
    from ${matches}
    where ${matches.status} = 'in_progress'
      and ${matches.date} + interval '24 hours' <= ${now}
  `);

  const row = result.rows[0] as { roundDate: Date | string | null } | undefined;
  if (!row?.roundDate) {
    return null;
  }
  return new Date(row.roundDate);
}

interface LockMatchesByDateProps {
  db: Transaction;
  roundDate: Date;
}

export async function lockMatchesByDate({
  db,
  roundDate,
}: LockMatchesByDateProps): Promise<LockedRoundMatch[]> {
  // Lock every match of the round so multiple workers cannot split the round.
  const result = await db.execute(sql`
    select
      ${matches.id} as "id",
      ${matches.status} as "status",
      ${matches.homeGoals} as "homeGoals",
      ${matches.awayGoals} as "awayGoals",
      ${matches.clubHomeId} as "clubHomeId",
      ${matches.clubAwayId} as "clubAwayId"
    from ${matches}
    where ${matches.date} = ${roundDate}
    for update
  `);

  return result.rows as LockedRoundMatch[];
}

interface MarkRoundInProgressProps {
  db: Transaction;
  roundDate: Date;
}

export async function markRoundInProgress({
  db,
  roundDate,
}: MarkRoundInProgressProps): Promise<void> {
  // Update the entire round in one statement to keep the transition atomic.
  await db.update(matches).set({ status: "in_progress" }).where(eq(matches.date, roundDate));
}

interface MarkRoundFinishedProps {
  db: Transaction;
  roundDate: Date;
}

export async function markRoundFinished({ db, roundDate }: MarkRoundFinishedProps): Promise<void> {
  await db
    .update(matches)
    .set({
      status: "finished",
    })
    .where(eq(matches.date, roundDate));
}

interface GetMatchByIdForUpdateProps {
  db: Transaction;
  matchId: string;
}

export async function getMatchByIdForUpdate({
  db,
  matchId,
}: GetMatchByIdForUpdateProps): Promise<MatchRow | null> {
  const result = await db.execute(sql`
    select
      ${matches.id} as "id",
      ${matches.status} as "status",
      ${matches.homeGoals} as "homeGoals",
      ${matches.awayGoals} as "awayGoals",
      ${matches.clubHomeId} as "clubHomeId",
      ${matches.clubAwayId} as "clubAwayId"
    from ${matches}
    where ${matches.id} = ${matchId}
    for update
  `);

  return (result.rows[0] as MatchRow | undefined) ?? null;
}

interface GetInProgressMatchByClubIdForUpdateProps {
  db: Transaction;
  clubId: string;
}

export async function getInProgressMatchByClubIdForUpdate({
  db,
  clubId,
}: GetInProgressMatchByClubIdForUpdateProps): Promise<MatchRow | null> {
  const result = await db.execute(sql`
    select
      ${matches.id} as "id",
      ${matches.status} as "status",
      ${matches.homeGoals} as "homeGoals",
      ${matches.awayGoals} as "awayGoals",
      ${matches.clubHomeId} as "clubHomeId",
      ${matches.clubAwayId} as "clubAwayId"
    from ${matches}
    where ${matches.status} = 'in_progress'
      and (${matches.clubHomeId} = ${clubId} or ${matches.clubAwayId} = ${clubId})
    limit 1
    for update
  `);

  return (result.rows[0] as MatchRow | undefined) ?? null;
}

type ScoringSide = "home" | "away";

interface IncrementMatchGoalsProps {
  db: Transaction;
  matchId: string;
  scoringSide: ScoringSide;
}

export async function incrementMatchGoals({
  db,
  matchId,
  scoringSide,
}: IncrementMatchGoalsProps): Promise<MatchRow> {
  const updateValues =
    scoringSide === "home"
      ? { homeGoals: sql`${matches.homeGoals} + 1` }
      : { awayGoals: sql`${matches.awayGoals} + 1` };

  const rows = await db.update(matches).set(updateValues).where(eq(matches.id, matchId)).returning({
    id: matches.id,
    status: matches.status,
    homeGoals: matches.homeGoals,
    awayGoals: matches.awayGoals,
    clubHomeId: matches.clubHomeId,
    clubAwayId: matches.clubAwayId,
  });

  return rows[0];
}
