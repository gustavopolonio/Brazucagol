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
import { clearGameplayPresence, isPlayerOffline } from "@/services/gameplayPresenceStore";
import { resolveScoringSide } from "@/services/scoringSide";
import { AUTO_GOAL_SCHEDULE_KEY } from "@/redis/keys/gameplayPresence";
import { getNextAutoGoalTimestamp, resolveCooldownTtlInSeconds } from "@/utils/gameplay";

type AutoGoalProcessResult =
  | { status: "scored"; cooldownTtlInSeconds: number }
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

      await incrementPlayerRoundStatsColumns({
        db: transaction,
        playerId,
        matchId: match.id,
        columnNames: ["autoGoalAttempts", "autoGoal"],
      });

      await incrementMatchGoals({
        db: transaction,
        matchId: match.id,
        scoringSide,
      });

      const cooldownTtlInSeconds = resolveCooldownTtlInSeconds(player.vipExpiresAt, currentTime);
      return { status: "scored", cooldownTtlInSeconds };
    });

    if (result.status === "scored") {
      const nextAutoGoalTimestamp = getNextAutoGoalTimestamp(
        currentTime.getTime(),
        result.cooldownTtlInSeconds
      );

      await redisClient.zadd(AUTO_GOAL_SCHEDULE_KEY, nextAutoGoalTimestamp, playerId);
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
