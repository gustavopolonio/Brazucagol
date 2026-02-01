import { env } from "@/env";
import { db } from "@/lib/drizzle";
import { redisClient } from "@/lib/redis";
import { getPlayerClubMembership } from "@/repositories/clubMembersRepository";
import {
  getInProgressMatchByClubIdForUpdate,
  incrementMatchGoals,
} from "@/repositories/matchRepository";
import {
  createPlayerRoundStats,
  getPlayerRoundStatsForUpdate,
  incrementPlayerRoundStatsColumns,
} from "@/repositories/playerRoundStatsRepository";
import { getPlayerById } from "@/repositories/playerRepository";
import { getLevelForTotalGoals } from "@/repositories/levelsRepository";
import { getPlayerTotalStats } from "@/repositories/playerTotalStatsRepository";
import { clearGameplayPresence, isPlayerOffline } from "@/services/gameplayPresenceStore";
import { resolveScoringSide } from "@/services/scoringSide";
import { updateLeaderboardsForMatchGoal } from "@/services/leaderboardService";
import { AUTO_GOAL_SCHEDULE_KEY } from "@/redis/keys/gameplayPresence";
import { AUTO_GOAL_SCORED_CHANNEL } from "@/redis/keys/autoGoal";
import { getNextAutoGoalTimestamp, resolveCooldownTtlInSeconds } from "@/utils/gameplay";
import { updatePlayerLevel } from "@/repositories/playerRepository";

type AutoGoalProcessResult =
  | {
      status: "scored";
      cooldownTtlInSeconds: number;
      matchId: string;
      goalResult: {
        status: "scored";
        matchId: string;
        playerId: string;
        actionType: "auto";
        homeGoals: number;
        awayGoals: number;
        playerLevel: number;
        effectiveTotalGoals: number;
      };
    }
  | { status: "match_not_found" }
  | { status: "clear_presence" };

async function processAutoGoalForPlayer(playerId: string, now: number): Promise<void> {
  try {
    const isOffline = await isPlayerOffline(playerId, now);

    if (isOffline) {
      await clearGameplayPresence(playerId);
      return;
    }

    const currentTime = new Date();
    const result = await db.transaction(async (transaction): Promise<AutoGoalProcessResult> => {
      const player = await getPlayerById({ db: transaction, playerId });

      if (!player) {
        return { status: "clear_presence" };
      }

      const playerClubMembership = await getPlayerClubMembership({
        db: transaction,
        playerId,
      });

      if (!playerClubMembership) {
        return { status: "clear_presence" };
      }

      const match = await getInProgressMatchByClubIdForUpdate({
        db: transaction,
        clubId: playerClubMembership.clubId,
      });

      if (!match) {
        return { status: "match_not_found" };
      }

      if (!match.clubHomeId || !match.clubAwayId) {
        return { status: "clear_presence" };
      }

      const scoringSide = resolveScoringSide({
        playerClubId: playerClubMembership.clubId,
        matchClubHomeId: match.clubHomeId,
        matchClubAwayId: match.clubAwayId,
      });

      if (!scoringSide) {
        return { status: "clear_presence" };
      }

      const existingPlayerRoundStats = await getPlayerRoundStatsForUpdate({
        db: transaction,
        playerId,
        matchId: match.id,
      });

      if (!existingPlayerRoundStats) {
        await createPlayerRoundStats({ db: transaction, playerId, matchId: match.id });
      }

      const updatedPlayerRoundStats = await incrementPlayerRoundStatsColumns({
        db: transaction,
        playerId,
        matchId: match.id,
        columnNames: ["autoGoalAttempts", "autoGoal"],
      });

      const updatedMatch = await incrementMatchGoals({
        db: transaction,
        matchId: match.id,
        scoringSide,
      });

      const playerTotalStats = await getPlayerTotalStats({ db: transaction, playerId });

      if (!playerTotalStats) {
        throw new Error("Player total stats not found.");
      }

      const effectiveTotalGoals =
        playerTotalStats.autoGoal +
        playerTotalStats.penaltyGoal +
        playerTotalStats.freeKickGoal +
        playerTotalStats.trailGoal +
        updatedPlayerRoundStats.autoGoal +
        updatedPlayerRoundStats.penaltyGoal +
        updatedPlayerRoundStats.freeKickGoal +
        updatedPlayerRoundStats.trailGoal;

      const nextLevel = await getLevelForTotalGoals({
        db: transaction,
        totalGoals: effectiveTotalGoals,
      });

      let playerLevel = player.level;

      if (nextLevel && nextLevel.id > player.level) {
        await updatePlayerLevel({
          db: transaction,
          playerId,
          level: nextLevel.id,
        });
        playerLevel = nextLevel.id;
      }

      const cooldownTtlInSeconds = resolveCooldownTtlInSeconds(player.vipExpiresAt, currentTime);

      return {
        status: "scored",
        cooldownTtlInSeconds,
        matchId: match.id,
        goalResult: {
          status: "scored",
          matchId: match.id,
          playerId,
          actionType: "auto",
          homeGoals: updatedMatch.homeGoals,
          awayGoals: updatedMatch.awayGoals,
          playerLevel,
          effectiveTotalGoals,
        },
      };
    });

    if (result.status === "scored") {
      const nextAutoGoalTimestamp = getNextAutoGoalTimestamp(
        currentTime.getTime(),
        result.cooldownTtlInSeconds
      );

      await redisClient.zadd(AUTO_GOAL_SCHEDULE_KEY, nextAutoGoalTimestamp, playerId);
      await updateLeaderboardsForMatchGoal({ playerId, matchId: result.matchId });
      try {
        await redisClient.publish(AUTO_GOAL_SCORED_CHANNEL, JSON.stringify(result.goalResult));
      } catch (error) {
        console.warn("Failed to publish auto-goal result", error);
      }
    }

    if (result.status === "clear_presence") {
      await clearGameplayPresence(playerId);
    }
  } catch (error) {
    await clearGameplayPresence(playerId);
    throw error;
  }
}

export async function runAutoGoalWorkerOnce() {
  const now = Date.now();
  const duePlayers = await redisClient.zrangebyscore(AUTO_GOAL_SCHEDULE_KEY, 0, now);

  for (const playerId of duePlayers) {
    try {
      await processAutoGoalForPlayer(playerId, now);
    } catch (error) {
      console.error(`Auto-goal processing failed for player ${playerId}`, error);
    }
  }
}

interface StartAutoGoalWorkerProps {
  intervalMilliseconds?: number;
}

export function startAutoGoalWorker({
  intervalMilliseconds = env.AUTO_GOAL_WORKER_INTERVAL_MS,
}: StartAutoGoalWorkerProps = {}) {
  const runTick = async () => {
    try {
      await runAutoGoalWorkerOnce();
    } catch (error) {
      console.error("Auto-goal worker tick failed", error);
    }
  };

  void runTick();

  return setInterval(() => {
    void runTick();
  }, intervalMilliseconds);
}

startAutoGoalWorker();
