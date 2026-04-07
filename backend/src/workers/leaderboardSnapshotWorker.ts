import { env } from "@/env";
import { db } from "@/lib/drizzle";
import { redisClient } from "@/lib/redis";
import {
  buildHourLeaderboardRewardProcessedKey,
  buildSeasonRecordHourProcessedKey,
} from "@/redis/keys/leaderboard";
import {
  getInProgressCupRoundId,
  getInProgressLeagueRound,
  getInProgressSeasonId,
} from "@/repositories/matchRepository";
import {
  buildLeagueRoundId,
  checkHourSeasonRecordForHourKey,
  refreshCurrentHourLeaderboardSnapshot,
  refreshRoundLeaderboardSnapshot,
  refreshSeasonLeaderboardSnapshot,
} from "@/services/leaderboardService";
import { processHourLeaderboardRewards } from "@/services/hourLeaderboardRewardsService";
import { toZonedHourKey } from "@/utils";

const HOUR_REWARD_PROCESSED_TTL_SECONDS = 60 * 60 * 2;

async function refreshActiveRoundSnapshots(): Promise<void> {
  const leagueRound = await getInProgressLeagueRound({ db });

  if (leagueRound) {
    // League round
    const roundId = buildLeagueRoundId({
      competitionId: leagueRound.competitionId,
      leagueRound: leagueRound.leagueRound,
    });

    await refreshRoundLeaderboardSnapshot({ roundId });

    return;
  }

  const cupRoundId = await getInProgressCupRoundId({ db });

  if (!cupRoundId) {
    return;
  }

  // Cup round
  await refreshRoundLeaderboardSnapshot({ roundId: cupRoundId });
}

export async function runLeaderboardSnapshotWorkerOnce() {
  const currentDate = new Date();
  const currentHourKey = toZonedHourKey(currentDate);
  const previousHourKey = toZonedHourKey(new Date(currentDate.getTime() - 60 * 60 * 1000));

  await refreshCurrentHourLeaderboardSnapshot();
  await refreshActiveRoundSnapshots();

  const hourRewardProcessedKey = buildHourLeaderboardRewardProcessedKey(previousHourKey);

  if (previousHourKey !== currentHourKey) {
    const hourRewardProcessed = await redisClient.set(
      hourRewardProcessedKey,
      "1",
      "EX",
      HOUR_REWARD_PROCESSED_TTL_SECONDS,
      "NX"
    );

    if (hourRewardProcessed === "OK") {
      try {
        await processHourLeaderboardRewards(previousHourKey);
      } catch (error) {
        await redisClient.del(hourRewardProcessedKey);
        throw error;
      }
    }
  }

  const seasonId = await getInProgressSeasonId({ db });

  if (seasonId) {
    await refreshSeasonLeaderboardSnapshot({ seasonId });

    const processedKey = buildSeasonRecordHourProcessedKey(previousHourKey);
    const processed = await redisClient.set(processedKey, "1", "EX", 60 * 60 * 2, "NX");

    if (processed === "OK" && previousHourKey !== currentHourKey) {
      await checkHourSeasonRecordForHourKey(seasonId, previousHourKey);
    }
  }
}

interface StartLeaderboardSnapshotWorkerProps {
  intervalMilliseconds?: number;
}

export function startLeaderboardSnapshotWorker({
  intervalMilliseconds = env.LEADERBOARD_SNAPSHOT_INTERVAL_MS,
}: StartLeaderboardSnapshotWorkerProps = {}) {
  const runTick = async () => {
    try {
      await runLeaderboardSnapshotWorkerOnce();
    } catch (error) {
      console.error("Leaderboard snapshot worker tick failed", error);
    }
  };

  void runTick();

  return setInterval(() => {
    void runTick();
  }, intervalMilliseconds);
}

startLeaderboardSnapshotWorker();
