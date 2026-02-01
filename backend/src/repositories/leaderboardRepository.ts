import { redisClient } from "@/lib/redis";
import {
  buildLeaderboardCacheRoundKey,
  LEADERBOARD_CACHE_HOUR_KEY,
  LEADERBOARD_CACHE_SEASON_KEY,
} from "@/redis/keys/leaderboard";
import { LeaderboardSnapshot } from "@/types/leaderboard.types";

async function loadCachedLeaderboard(cacheKey: string): Promise<LeaderboardSnapshot | null> {
  try {
    const cachedValue = await redisClient.get(cacheKey);

    if (!cachedValue) {
      return null;
    }

    return JSON.parse(cachedValue) as LeaderboardSnapshot;
  } catch (error) {
    console.error(`Failed to read cached leaderboard ${cacheKey}`, error);
    return null;
  }
}

export async function getCachedHourLeaderboard(): Promise<LeaderboardSnapshot | null> {
  return loadCachedLeaderboard(LEADERBOARD_CACHE_HOUR_KEY);
}

export async function getCachedSeasonLeaderboard(): Promise<LeaderboardSnapshot | null> {
  return loadCachedLeaderboard(LEADERBOARD_CACHE_SEASON_KEY);
}

export async function getCachedRoundLeaderboard(
  roundId: string
): Promise<LeaderboardSnapshot | null> {
  const cacheKey = buildLeaderboardCacheRoundKey(roundId);
  return loadCachedLeaderboard(cacheKey);
}
