import { and, eq, isNotNull, sql } from "drizzle-orm";
import { competitions, cupRounds, matches, seasons, Competition } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

type DbClient = (typeof import("@/lib/drizzle"))["db"];

interface GetSeasonByIdProps {
  db: Transaction | DbClient;
  seasonId: string;
}

export async function getSeasonById({ db, seasonId }: GetSeasonByIdProps) {
  const rows = await db.select({ id: seasons.id }).from(seasons).where(eq(seasons.id, seasonId));

  return rows[0] ?? null;
}

interface GetSeasonCompetitionsBySeasonIdProps {
  db: Transaction;
  seasonId: string;
}

export async function getSeasonCompetitionsBySeasonId({
  db,
  seasonId,
}: GetSeasonCompetitionsBySeasonIdProps): Promise<
  Array<{ id: string; type: Competition["type"] }>
> {
  const seasonCompetitions = await db
    .select({
      id: competitions.id,
      type: competitions.type,
    })
    .from(competitions)
    .where(eq(competitions.seasonId, seasonId));

  return seasonCompetitions;
}

interface GetSeasonMatchesStatsBySeasonIdProps {
  db: Transaction;
  seasonId: string;
}

type SeasonMatchesStats = {
  nonPendingMatches: number;
  totalMatches: number;
};

export async function getSeasonMatchesStatsBySeasonId({
  db,
  seasonId,
}: GetSeasonMatchesStatsBySeasonIdProps): Promise<SeasonMatchesStats | null> {
  const rows = await db
    .select({
      nonPendingMatches: sql<number>`count(*) filter (where ${matches.status} <> 'pending')`.as(
        "non_pending_matches"
      ),
      totalMatches: sql<number>`count(*)`.as("total_matches"),
    })
    .from(matches)
    .innerJoin(competitions, eq(matches.competitionId, competitions.id))
    .where(eq(competitions.seasonId, seasonId));

  return rows[0] ?? null;
}

interface GetSeasonLeagueRoundsBySeasonIdProps {
  db: Transaction;
  seasonId: string;
}

export async function getSeasonLeagueRoundsBySeasonId({
  db,
  seasonId,
}: GetSeasonLeagueRoundsBySeasonIdProps): Promise<
  Array<{ competitionId: string | null; leagueRound: number | null }>
> {
  const rows = await db
    .select({
      competitionId: matches.competitionId,
      leagueRound: matches.leagueRound,
    })
    .from(matches)
    .innerJoin(competitions, eq(matches.competitionId, competitions.id))
    .where(
      and(
        eq(competitions.seasonId, seasonId),
        eq(matches.type, "league"),
        isNotNull(matches.leagueRound)
      )
    )
    .groupBy(matches.competitionId, matches.leagueRound);

  return rows;
}

interface GetSeasonCupRoundsBySeasonIdProps {
  db: Transaction;
  seasonId: string;
}

export async function getSeasonCupRoundsBySeasonId({
  db,
  seasonId,
}: GetSeasonCupRoundsBySeasonIdProps): Promise<
  Array<{ competitionId: string | null; cupRoundId: string | null; stage: number }>
> {
  const rows = await db
    .select({
      competitionId: matches.competitionId,
      cupRoundId: matches.cupRoundId,
      stage: cupRounds.stage,
    })
    .from(matches)
    .innerJoin(competitions, eq(matches.competitionId, competitions.id))
    .innerJoin(cupRounds, eq(matches.cupRoundId, cupRounds.id))
    .where(
      and(
        eq(competitions.seasonId, seasonId),
        eq(matches.type, "cup"),
        isNotNull(matches.cupRoundId)
      )
    )
    .groupBy(matches.competitionId, matches.cupRoundId, cupRounds.stage);

  return rows;
}

interface UpdateSeasonScheduleDatesProps {
  db: Transaction;
  seasonId: string;
  startsAt: Date;
  endsAt: Date;
}

export async function updateSeasonScheduleDates({
  db,
  seasonId,
  startsAt,
  endsAt,
}: UpdateSeasonScheduleDatesProps) {
  await db.update(seasons).set({ startsAt, endsAt }).where(eq(seasons.id, seasonId));
}

interface UpdatePendingLeagueMatchesDateProps {
  db: Transaction;
  competitionId: string;
  leagueRound: number;
  date: Date;
}

export async function updatePendingLeagueMatchDate({
  db,
  competitionId,
  leagueRound,
  date,
}: UpdatePendingLeagueMatchesDateProps) {
  await db
    .update(matches)
    .set({ date })
    .where(
      and(
        eq(matches.competitionId, competitionId),
        eq(matches.type, "league"),
        eq(matches.leagueRound, leagueRound),
        eq(matches.status, "pending")
      )
    );
}

interface UpdatePendingCupMatchesDateProps {
  db: Transaction;
  competitionId: string;
  cupRoundId: string;
  date: Date;
}

export async function updatePendingCupMatchDate({
  db,
  competitionId,
  cupRoundId,
  date,
}: UpdatePendingCupMatchesDateProps) {
  await db
    .update(matches)
    .set({ date })
    .where(
      and(
        eq(matches.competitionId, competitionId),
        eq(matches.type, "cup"),
        eq(matches.cupRoundId, cupRoundId),
        eq(matches.status, "pending")
      )
    );
}
