import { SQL, and, eq, sql } from "drizzle-orm";
import { playerRoundStats, type PlayerRoundStat } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

export type PlayerRoundStatsRow = Pick<
  PlayerRoundStat,
  | "id"
  | "playerId"
  | "matchId"
  | "autoGoal"
  | "autoGoalAttempts"
  | "penaltyGoal"
  | "penaltyAttempts"
  | "freeKickGoal"
  | "freeKickAttempts"
  | "trailGoal"
  | "trailAttempts"
>;

export type GoalColumnName = "autoGoal" | "penaltyGoal" | "freeKickGoal" | "trailGoal";
export type AttemptColumnName =
  | "autoGoalAttempts"
  | "penaltyAttempts"
  | "freeKickAttempts"
  | "trailAttempts";

interface GetPlayerRoundStatsForUpdateProps {
  db: Transaction;
  playerId: string;
  matchId: string;
}

export async function getPlayerRoundStatsForUpdate({
  db,
  playerId,
  matchId,
}: GetPlayerRoundStatsForUpdateProps): Promise<PlayerRoundStatsRow | null> {
  const result = await db.execute(sql`
    select
      ${playerRoundStats.id} as "id",
      ${playerRoundStats.playerId} as "playerId",
      ${playerRoundStats.matchId} as "matchId",
      ${playerRoundStats.autoGoal} as "autoGoal",
      ${playerRoundStats.autoGoalAttempts} as "autoGoalAttempts",
      ${playerRoundStats.penaltyGoal} as "penaltyGoal",
      ${playerRoundStats.penaltyAttempts} as "penaltyAttempts",
      ${playerRoundStats.freeKickGoal} as "freeKickGoal",
      ${playerRoundStats.freeKickAttempts} as "freeKickAttempts",
      ${playerRoundStats.trailGoal} as "trailGoal",
      ${playerRoundStats.trailAttempts} as "trailAttempts"
    from ${playerRoundStats}
    where ${playerRoundStats.playerId} = ${playerId}
      and ${playerRoundStats.matchId} = ${matchId}
    for update
  `);

  return (result.rows[0] as PlayerRoundStatsRow | undefined) ?? null;
}

interface CreatePlayerRoundStatsProps {
  db: Transaction;
  playerId: string;
  matchId: string;
}

export async function createPlayerRoundStats({
  db,
  playerId,
  matchId,
}: CreatePlayerRoundStatsProps): Promise<PlayerRoundStatsRow> {
  const rows = await db
    .insert(playerRoundStats)
    .values({
      playerId,
      matchId,
    })
    .returning({
      id: playerRoundStats.id,
      playerId: playerRoundStats.playerId,
      matchId: playerRoundStats.matchId,
      autoGoal: playerRoundStats.autoGoal,
      autoGoalAttempts: playerRoundStats.autoGoalAttempts,
      penaltyGoal: playerRoundStats.penaltyGoal,
      penaltyAttempts: playerRoundStats.penaltyAttempts,
      freeKickGoal: playerRoundStats.freeKickGoal,
      freeKickAttempts: playerRoundStats.freeKickAttempts,
      trailGoal: playerRoundStats.trailGoal,
      trailAttempts: playerRoundStats.trailAttempts,
    });

  return rows[0];
}

interface IncrementPlayerRoundStatsColumnsProps {
  db: Transaction;
  playerId: string;
  matchId: string;
  columnNames: Array<GoalColumnName | AttemptColumnName>;
}

export async function incrementPlayerRoundStatsColumns({
  db,
  playerId,
  matchId,
  columnNames,
}: IncrementPlayerRoundStatsColumnsProps): Promise<PlayerRoundStatsRow> {
  const updateValues = columnNames.reduce<Record<string, SQL<number>>>((values, columnName) => {
    const column = playerRoundStats[columnName];
    values[columnName] = sql<number>`${column} + 1`;
    return values;
  }, {});

  const rows = await db
    .update(playerRoundStats)
    .set(updateValues)
    .where(and(eq(playerRoundStats.playerId, playerId), eq(playerRoundStats.matchId, matchId)))
    .returning({
      id: playerRoundStats.id,
      playerId: playerRoundStats.playerId,
      matchId: playerRoundStats.matchId,
      autoGoal: playerRoundStats.autoGoal,
      autoGoalAttempts: playerRoundStats.autoGoalAttempts,
      penaltyGoal: playerRoundStats.penaltyGoal,
      penaltyAttempts: playerRoundStats.penaltyAttempts,
      freeKickGoal: playerRoundStats.freeKickGoal,
      freeKickAttempts: playerRoundStats.freeKickAttempts,
      trailGoal: playerRoundStats.trailGoal,
      trailAttempts: playerRoundStats.trailAttempts,
    });

  return rows[0];
}
