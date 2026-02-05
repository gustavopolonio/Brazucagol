import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import { competitions, matches, type Match } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

type DbClient = (typeof import("@/lib/drizzle"))["db"];

export type MatchRow = Pick<
  Match,
  "id" | "status" | "homeGoals" | "awayGoals" | "clubHomeId" | "clubAwayId"
>;

export type LockedRoundMatch = MatchRow;

export type MatchCompetitionContext = {
  matchId: string;
  matchType: Match["type"];
  competitionId: string | null;
  leagueRound: number | null;
  cupRoundId: string | null;
  seasonId: string | null;
};

export type InProgressLeagueRound = {
  competitionId: string;
  leagueRound: number;
};

export type RoundSeasonContext = {
  seasonId: string;
  matchType: Match["type"];
  competitionId: string;
  leagueRound: number | null;
  cupRoundId: string | null;
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

interface GetMatchCompetitionContextByIdProps {
  db: Transaction | DbClient;
  matchId: string;
}

export async function getMatchCompetitionContextById({
  db,
  matchId,
}: GetMatchCompetitionContextByIdProps): Promise<MatchCompetitionContext | null> {
  const matchRows = await db
    .select({
      matchId: matches.id,
      matchType: matches.type,
      competitionId: matches.competitionId,
      leagueRound: matches.leagueRound,
      cupRoundId: matches.cupRoundId,
      seasonId: competitions.seasonId,
    })
    .from(matches)
    .leftJoin(competitions, eq(matches.competitionId, competitions.id))
    .where(eq(matches.id, matchId))
    .limit(1);

  return matchRows[0] ?? null;
}

interface GetInProgressLeagueRoundProps {
  db: Transaction | DbClient;
}

export async function getInProgressLeagueRound({
  db,
}: GetInProgressLeagueRoundProps): Promise<InProgressLeagueRound | null> {
  const leagueRoundRows = await db
    .select({
      competitionId: matches.competitionId,
      leagueRound: matches.leagueRound,
    })
    .from(matches)
    .where(
      and(
        eq(matches.status, "in_progress"),
        eq(matches.type, "league"),
        isNotNull(matches.competitionId),
        isNotNull(matches.leagueRound)
      )
    )
    .groupBy(matches.competitionId, matches.leagueRound)
    .limit(1);

  return leagueRoundRows[0] ?? null;
}

interface GetInProgressCupRoundIdProps {
  db: Transaction | DbClient;
}

export async function getInProgressCupRoundId({
  db,
}: GetInProgressCupRoundIdProps): Promise<string | null> {
  const cupRoundRows = await db
    .select({
      cupRoundId: matches.cupRoundId,
    })
    .from(matches)
    .where(
      and(eq(matches.status, "in_progress"), eq(matches.type, "cup"), isNotNull(matches.cupRoundId))
    )
    .groupBy(matches.cupRoundId);

  return cupRoundRows[0]?.cupRoundId ?? null;
}

interface GetInProgressSeasonIdProps {
  db: Transaction | DbClient;
}

export async function getInProgressSeasonId({
  db,
}: GetInProgressSeasonIdProps): Promise<string | null> {
  const seasonRows = await db
    .select({ seasonId: competitions.seasonId })
    .from(matches)
    .innerJoin(competitions, eq(matches.competitionId, competitions.id))
    .where(eq(matches.status, "in_progress"))
    .orderBy(desc(matches.date))
    .limit(1);

  return seasonRows[0]?.seasonId ?? null;
}

interface GetRoundSeasonContextsByDateProps {
  db: Transaction | DbClient;
  roundDate: Date;
}

export async function getRoundSeasonContextsByDate({
  db,
  roundDate,
}: GetRoundSeasonContextsByDateProps): Promise<RoundSeasonContext[]> {
  const leagueRounds = await db
    .select({
      seasonId: competitions.seasonId,
      competitionId: matches.competitionId,
      leagueRound: matches.leagueRound,
    })
    .from(matches)
    .innerJoin(competitions, eq(matches.competitionId, competitions.id))
    .where(
      and(
        eq(matches.date, roundDate),
        eq(matches.type, "league"),
        isNotNull(matches.competitionId),
        isNotNull(matches.leagueRound)
      )
    )
    .groupBy(competitions.seasonId, matches.competitionId, matches.leagueRound);

  const cupRounds = await db
    .select({
      seasonId: competitions.seasonId,
      competitionId: matches.competitionId,
      cupRoundId: matches.cupRoundId,
    })
    .from(matches)
    .innerJoin(competitions, eq(matches.competitionId, competitions.id))
    .where(
      and(
        eq(matches.date, roundDate),
        eq(matches.type, "cup"),
        isNotNull(matches.competitionId),
        isNotNull(matches.cupRoundId)
      )
    )
    .groupBy(competitions.seasonId, matches.competitionId, matches.cupRoundId);

  return [
    ...leagueRounds.map((row) => ({
      seasonId: row.seasonId,
      matchType: "league" as const,
      competitionId: row.competitionId,
      leagueRound: row.leagueRound,
      cupRoundId: null,
    })),
    ...cupRounds.map((row) => ({
      seasonId: row.seasonId,
      matchType: "cup" as const,
      competitionId: row.competitionId,
      leagueRound: null,
      cupRoundId: row.cupRoundId,
    })),
  ];
}
