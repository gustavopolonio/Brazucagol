import { and, eq, sql } from "drizzle-orm";
import { leagueStandings, matches, playerRoundStats, playerTotalStats } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

export type FinalizableMatch = {
  id: string;
  status: "pending" | "in_progress" | "finished";
  type: "league" | "cup" | "friendly";
  competitionId: string | null;
  divisionId: string | null;
  clubHomeId: string | null;
  clubAwayId: string | null;
  homeFromMatchId: string | null;
  awayFromMatchId: string | null;
  homeGoals: number;
  awayGoals: number;
  winnerClubId: string | null;
};

interface LockRoundMatchesForFinalizeProps {
  db: Transaction;
  roundDate: Date;
}

export async function lockRoundMatchesForFinalize({
  db,
  roundDate,
}: LockRoundMatchesForFinalizeProps): Promise<FinalizableMatch[]> {
  // Lock the full round so every match is finalized together.
  const result = await db.execute(sql`
    select
      ${matches.id} as "id",
      ${matches.status} as "status",
      ${matches.type} as "type",
      ${matches.competitionId} as "competitionId",
      ${matches.divisionId} as "divisionId",
      ${matches.clubHomeId} as "clubHomeId",
      ${matches.clubAwayId} as "clubAwayId",
      ${matches.homeFromMatchId} as "homeFromMatchId",
      ${matches.awayFromMatchId} as "awayFromMatchId",
      ${matches.homeGoals} as "homeGoals",
      ${matches.awayGoals} as "awayGoals",
      ${matches.winnerClubId} as "winnerClubId"
    from ${matches}
    where ${matches.date} = ${roundDate}
    for update
  `);

  return result.rows as FinalizableMatch[];
}

interface UpdateMatchWinnerProps {
  db: Transaction;
  matchId: string;
  winnerClubId: string | null;
}

export async function updateMatchWinner({ db, matchId, winnerClubId }: UpdateMatchWinnerProps) {
  await db
    .update(matches)
    .set({ winnerClubId: winnerClubId })
    .where(
      and(eq(matches.id, matchId), sql`${matches.winnerClubId} is distinct from ${winnerClubId}`)
    );
}

interface AggregatePlayerTotalsForMatchProps {
  db: Transaction;
  matchId: string;
}

export async function aggregatePlayerTotalStatsForMatch({
  db,
  matchId,
}: AggregatePlayerTotalsForMatchProps) {
  // Idempotency: only aggregate if the match is still in progress.
  await db.execute(sql`
    with match_context as (
      select ${matches.id} as match_id
      from ${matches}
      where ${matches.id} = ${matchId}
        and ${matches.status} = 'in_progress'
    ),
    aggregated as (
      select
        ${playerRoundStats.playerId} as player_id,
        sum(${playerRoundStats.autoGoal}) as auto_goal,
        sum(${playerRoundStats.autoGoalAttempts}) as auto_goal_attempts,
        sum(${playerRoundStats.penaltyGoal}) as penalty_goal,
        sum(${playerRoundStats.penaltyAttempts}) as penalty_attempts,
        sum(${playerRoundStats.freeKickGoal}) as free_kick_goal,
        sum(${playerRoundStats.freeKickAttempts}) as free_kick_attempts,
        sum(${playerRoundStats.trailGoal}) as trail_goal,
        sum(${playerRoundStats.trailAttempts}) as trail_attempts
      from ${playerRoundStats}
      join match_context on match_context.match_id = ${playerRoundStats.matchId}
      group by ${playerRoundStats.playerId}
    )
    update ${playerTotalStats} as totals
    set
      "auto_goal" = totals."auto_goal" + aggregated.auto_goal,
      "auto_goal_attempts" = totals."auto_goal_attempts" + aggregated.auto_goal_attempts,
      "penalty_goal" = totals."penalty_goal" + aggregated.penalty_goal,
      "penalty_attempts" = totals."penalty_attempts" + aggregated.penalty_attempts,
      "free_kick_goal" = totals."free_kick_goal" + aggregated.free_kick_goal,
      "free_kick_attempts" = totals."free_kick_attempts" + aggregated.free_kick_attempts,
      "trail_goal" = totals."trail_goal" + aggregated.trail_goal,
      "trail_attempts" = totals."trail_attempts" + aggregated.trail_attempts
    from aggregated
    where totals."player_id" = aggregated.player_id
  `);
}

interface ApplyLeagueStandingsForMatchProps {
  db: Transaction;
  matchId: string;
}

export async function applyLeagueStandingsForMatch({
  db,
  matchId,
}: ApplyLeagueStandingsForMatchProps) {
  // Idempotency: standings move only when the match is still in progress.

  // Home club
  await db.execute(sql`
    with match_context as (
      select
        ${matches.id} as match_id,
        ${matches.competitionId} as competition_id,
        ${matches.divisionId} as division_id,
        ${matches.clubHomeId} as club_home_id,
        ${matches.homeGoals} as home_goals,
        ${matches.awayGoals} as away_goals
      from ${matches}
      where ${matches.id} = ${matchId}
        and ${matches.status} = 'in_progress'
        and ${matches.type} = 'league'
    )
    update ${leagueStandings} as standings
    set
      "matches_played" = "matches_played" + 1,
      "wins" =
        "wins" + case when match_context.home_goals > match_context.away_goals then 1 else 0 end,
      "draws" =
        "draws" + case when match_context.home_goals = match_context.away_goals then 1 else 0 end,
      "defeats" =
        "defeats" + case when match_context.home_goals < match_context.away_goals then 1 else 0 end,
      "goals_for" = "goals_for" + match_context.home_goals,
      "goals_against" = "goals_against" + match_context.away_goals,
      "points" =
        "points"
        + case
            when match_context.home_goals > match_context.away_goals then 3
            when match_context.home_goals = match_context.away_goals then 1
            else 0
          end
    from match_context
    where standings."competition_id" = match_context.competition_id
      and standings."division_id" = match_context.division_id
      and standings."club_id" = match_context.club_home_id
  `);

  // Away club
  await db.execute(sql`
    with match_context as (
      select
        ${matches.id} as match_id,
        ${matches.competitionId} as competition_id,
        ${matches.divisionId} as division_id,
        ${matches.clubAwayId} as club_away_id,
        ${matches.homeGoals} as home_goals,
        ${matches.awayGoals} as away_goals
      from ${matches}
      where ${matches.id} = ${matchId}
        and ${matches.status} = 'in_progress'
        and ${matches.type} = 'league'
    )
    update ${leagueStandings} as standings
    set
      "matches_played" = "matches_played" + 1,
      "wins" =
        "wins" + case when match_context.away_goals > match_context.home_goals then 1 else 0 end,
      "draws" =
        "draws" + case when match_context.away_goals = match_context.home_goals then 1 else 0 end,
      "defeats" =
        "defeats" + case when match_context.away_goals < match_context.home_goals then 1 else 0 end,
      "goals_for" = "goals_for" + match_context.away_goals,
      "goals_against" = "goals_against" + match_context.home_goals,
      "points" =
        "points"
        + case
            when match_context.away_goals > match_context.home_goals then 3
            when match_context.away_goals = match_context.home_goals then 1
            else 0
          end
    from match_context
    where standings."competition_id" = match_context.competition_id
      and standings."division_id" = match_context.division_id
      and standings."club_id" = match_context.club_away_id
  `);
}

interface EnsureCupWinnerPropagationProps {
  db: Transaction;
  matchId: string;
  winnerClubId: string;
}

export async function ensureCupWinnerPropagation({
  db,
  matchId,
  winnerClubId,
}: EnsureCupWinnerPropagationProps) {
  const homeConflict = await db.execute(sql`
    select ${matches.id} as "id"
    from ${matches}
    where ${matches.homeFromMatchId} = ${matchId}
      and ${matches.clubHomeId} is not null
      and ${matches.clubHomeId} <> ${winnerClubId}
  `);

  if (homeConflict.rows.length > 0) {
    throw new Error(`Home slot already has a different club for match ${matchId}.`);
  }

  const awayConflict = await db.execute(sql`
    select ${matches.id} as "id"
    from ${matches}
    where ${matches.awayFromMatchId} = ${matchId}
      and ${matches.clubAwayId} is not null
      and ${matches.clubAwayId} <> ${winnerClubId}
  `);

  if (awayConflict.rows.length > 0) {
    throw new Error(`Away slot already has a different club for match ${matchId}.`);
  }

  await db
    .update(matches)
    .set({ clubHomeId: winnerClubId })
    .where(
      and(
        eq(matches.homeFromMatchId, matchId),
        sql`${matches.clubHomeId} is distinct from ${winnerClubId}`
      )
    );

  await db
    .update(matches)
    .set({ clubAwayId: winnerClubId })
    .where(
      and(
        eq(matches.awayFromMatchId, matchId),
        sql`${matches.clubAwayId} is distinct from ${winnerClubId}`
      )
    );
}
