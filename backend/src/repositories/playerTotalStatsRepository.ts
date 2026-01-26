import { eq } from "drizzle-orm";
import { playerTotalStats, type PlayerTotalStat } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

export type PlayerTotalStatsRow = Pick<
  PlayerTotalStat,
  "playerId" | "autoGoal" | "penaltyGoal" | "freeKickGoal" | "trailGoal"
>;

interface GetPlayerTotalStatsProps {
  db: Transaction;
  playerId: string;
}

export async function getPlayerTotalStats({
  db,
  playerId,
}: GetPlayerTotalStatsProps): Promise<PlayerTotalStatsRow | null> {
  const rows = await db
    .select({
      playerId: playerTotalStats.playerId,
      autoGoal: playerTotalStats.autoGoal,
      penaltyGoal: playerTotalStats.penaltyGoal,
      freeKickGoal: playerTotalStats.freeKickGoal,
      trailGoal: playerTotalStats.trailGoal,
    })
    .from(playerTotalStats)
    .where(eq(playerTotalStats.playerId, playerId))
    .limit(1);

  return rows[0] ?? null;
}
