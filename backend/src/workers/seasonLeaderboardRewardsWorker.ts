import { type SeasonRecordType } from "@/db/schema";
import { env } from "@/env";
import { db } from "@/lib/drizzle";
import { redisClient } from "@/lib/redis";
import {
  buildSeasonLeaderboardRewardProcessedKey,
  buildSeasonRecordRewardProcessedKey,
} from "@/redis/keys/leaderboard";
import { listEndedSeasons } from "@/repositories/seasonRepository";
import { processSeasonLeaderboardRewards } from "@/services/seasonLeaderboardRewardsService";
import { processSeasonRecordRewards } from "@/services/seasonRecordRewardsService";

const SEASON_REWARD_PROCESSED_TTL_SECONDS = 365 * 24 * 60 * 60; // 1 year
const SEASON_RECORD_TYPES: SeasonRecordType[] = ["hour_goals", "round_goals"];

export async function runSeasonLeaderboardRewardsWorkerOnce(
  currentDate: Date = new Date()
): Promise<void> {
  const endedSeasons = await listEndedSeasons({
    db,
    now: currentDate,
  });

  for (const endedSeason of endedSeasons) {
    const rewardProcessedKey = buildSeasonLeaderboardRewardProcessedKey(endedSeason.id);
    const rewardProcessed = await redisClient.set(
      rewardProcessedKey,
      "1",
      "EX",
      SEASON_REWARD_PROCESSED_TTL_SECONDS,
      "NX"
    );

    if (rewardProcessed !== "OK") {
      continue;
    }

    try {
      await processSeasonLeaderboardRewards(endedSeason.id);
    } catch (error) {
      await redisClient.del(rewardProcessedKey);
      throw error;
    }

    for (const seasonRecordType of SEASON_RECORD_TYPES) {
      const seasonRecordRewardProcessedKey = buildSeasonRecordRewardProcessedKey(
        endedSeason.id,
        seasonRecordType
      );
      const seasonRecordRewardProcessed = await redisClient.set(
        seasonRecordRewardProcessedKey,
        "1",
        "EX",
        SEASON_REWARD_PROCESSED_TTL_SECONDS,
        "NX"
      );

      if (seasonRecordRewardProcessed !== "OK") {
        continue;
      }

      try {
        await processSeasonRecordRewards({
          seasonId: endedSeason.id,
          type: seasonRecordType,
        });
      } catch (error) {
        await redisClient.del(seasonRecordRewardProcessedKey);
        throw error;
      }
    }
  }
}

interface StartSeasonLeaderboardRewardsWorkerProps {
  intervalMilliseconds?: number;
}

export function startSeasonLeaderboardRewardsWorker({
  intervalMilliseconds = env.SEASON_LEADERBOARD_REWARD_WORKER_INTERVAL_MS,
}: StartSeasonLeaderboardRewardsWorkerProps = {}) {
  const runTick = async () => {
    try {
      await runSeasonLeaderboardRewardsWorkerOnce();
    } catch (error) {
      console.error("Season leaderboard rewards worker tick failed", error);
    }
  };

  void runTick();

  return setInterval(() => {
    void runTick();
  }, intervalMilliseconds);
}

startSeasonLeaderboardRewardsWorker();
