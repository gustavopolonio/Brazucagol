import { eq, sql } from "drizzle-orm";
import { matches } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

type DbClient = (typeof import("@/lib/drizzle"))["db"];

export type LockedRoundMatch = {
  id: string;
  status: "pending" | "in_progress" | "finished";
  homeGoals: number;
  awayGoals: number;
  clubHomeId: string | null;
  clubAwayId: string | null;
};

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

export async function markRoundInProgress({ db, roundDate }: MarkRoundInProgressProps) {
  // Update the entire round in one statement to keep the transition atomic.
  await db.update(matches).set({ status: "in_progress" }).where(eq(matches.date, roundDate));
}

interface MarkRoundFinishedProps {
  db: Transaction;
  roundDate: Date;
}

export async function markRoundFinished({ db, roundDate }: MarkRoundFinishedProps) {
  await db
    .update(matches)
    .set({
      status: "finished",
    })
    .where(eq(matches.date, roundDate));
}
