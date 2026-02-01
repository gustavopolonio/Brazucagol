import { env } from "@/env";
import { db } from "@/lib/drizzle";
import { redisClient } from "@/lib/redis";
import {
  buildHourlyLeaderboardKey,
  buildLeaderboardCacheRoundKey,
  buildRoundLeaderboardKey,
  buildSeasonLeaderboardKey,
  LEADERBOARD_CACHE_HOUR_KEY,
  LEADERBOARD_CACHE_SEASON_KEY,
} from "@/redis/keys/leaderboard";
import {
  getCachedHourLeaderboard,
  getCachedRoundLeaderboard,
  getCachedSeasonLeaderboard,
} from "@/repositories/leaderboardRepository";
import { getMatchCompetitionContextById } from "@/repositories/matchRepository";
import { LeaderboardEntry, LeaderboardSnapshot } from "@/types/leaderboard.types";
import { toZonedHourKey } from "@/utils";

interface UpdateLeaderboardsOnGoalProps {
  playerId: string;
  seasonId: string;
  roundId: string | null;
}

export function buildLeagueRoundId({
  competitionId,
  leagueRound,
}: {
  competitionId: string;
  leagueRound: number;
}) {
  return `${competitionId}:${leagueRound}`;
}

export async function updateLeaderboardsOnGoal({
  playerId,
  seasonId,
  roundId,
}: UpdateLeaderboardsOnGoalProps): Promise<void> {
  const hourKey = toZonedHourKey(new Date());
  const hourLeaderboardKey = buildHourlyLeaderboardKey(hourKey);
  const seasonLeaderboardKey = buildSeasonLeaderboardKey(seasonId);
  const roundLeaderboardKey = buildRoundLeaderboardKey(roundId);

  try {
    const pipeline = redisClient
      .multi()
      .zincrby(hourLeaderboardKey, 1, playerId)
      .expire(hourLeaderboardKey, env.HOUR_LEADERBOARD_TTL_SECONDS)
      .zincrby(roundLeaderboardKey, 1, playerId)
      .expire(roundLeaderboardKey, env.ROUND_LEADERBOARD_TTL_SECONDS)
      .zincrby(seasonLeaderboardKey, 1, playerId);

    await pipeline.exec();
  } catch (error) {
    console.error("Failed to update leaderboards after goal", error);
  }
}

interface RefreshLeaderboardSnapshotProps {
  leaderboardKey: string;
  cacheKey: string;
}

function buildLeaderboardEntriesFromZset(rawEntries: string[]): LeaderboardEntry[] {
  const leaderboardEntries: LeaderboardEntry[] = [];

  for (let index = 0; index < rawEntries.length; index += 2) {
    const playerId = rawEntries[index];
    const scoreValue = rawEntries[index + 1];

    if (!playerId || scoreValue === null) continue;

    const goals = Number(scoreValue);

    if (!Number.isFinite(goals)) continue;

    leaderboardEntries.push({ playerId, goals });
  }

  return leaderboardEntries;
}

export async function refreshLeaderboardSnapshot({
  leaderboardKey,
  cacheKey,
}: RefreshLeaderboardSnapshotProps): Promise<void> {
  try {
    const rawEntries = await redisClient.zrevrange(leaderboardKey, 0, 9, "WITHSCORES");
    const snapshot: LeaderboardSnapshot = buildLeaderboardEntriesFromZset(rawEntries);

    await redisClient.set(cacheKey, JSON.stringify(snapshot));
  } catch (error) {
    console.error(`Failed to refresh leaderboard snapshot for ${cacheKey}`, error);
  }
}

interface UpdateLeaderboardsForMatchGoalProps {
  playerId: string;
  matchId: string;
}

export async function updateLeaderboardsForMatchGoal({
  playerId,
  matchId,
}: UpdateLeaderboardsForMatchGoalProps): Promise<void> {
  try {
    const matchCompetitionContext = await getMatchCompetitionContextById({ db, matchId });

    if (!matchCompetitionContext?.seasonId) {
      console.error(`Leaderboard update skipped for match ${matchId}: missing season.`);
      return;
    }

    const roundId =
      matchCompetitionContext.matchType === "league"
        ? buildLeagueRoundId({
            competitionId: matchCompetitionContext.competitionId,
            leagueRound: matchCompetitionContext.leagueRound,
          })
        : matchCompetitionContext.cupRoundId;

    await updateLeaderboardsOnGoal({
      playerId,
      seasonId: matchCompetitionContext.seasonId,
      roundId,
    });
  } catch (error) {
    console.error(`Failed to update leaderboards for match ${matchId}`, error);
  }
}

export async function refreshCurrentHourLeaderboardSnapshot(): Promise<void> {
  const hourKey = toZonedHourKey(new Date());
  const hourLeaderboardKey = buildHourlyLeaderboardKey(hourKey);

  await refreshLeaderboardSnapshot({
    leaderboardKey: hourLeaderboardKey,
    cacheKey: LEADERBOARD_CACHE_HOUR_KEY,
  });
}

interface RefreshSeasonLeaderboardSnapshotProps {
  seasonId: string;
}

export async function refreshSeasonLeaderboardSnapshot({
  seasonId,
}: RefreshSeasonLeaderboardSnapshotProps): Promise<void> {
  const seasonLeaderboardKey = buildSeasonLeaderboardKey(seasonId);

  await refreshLeaderboardSnapshot({
    leaderboardKey: seasonLeaderboardKey,
    cacheKey: LEADERBOARD_CACHE_SEASON_KEY,
  });
}

interface RefreshRoundLeaderboardSnapshotProps {
  roundId: string;
}

export async function refreshRoundLeaderboardSnapshot({
  roundId,
}: RefreshRoundLeaderboardSnapshotProps): Promise<void> {
  const roundLeaderboardKey = buildRoundLeaderboardKey(roundId);
  const roundCacheKey = buildLeaderboardCacheRoundKey(roundId);

  await refreshLeaderboardSnapshot({
    leaderboardKey: roundLeaderboardKey,
    cacheKey: roundCacheKey,
  });
}

export async function getCurrentHourLeaderboardSnapshot(): Promise<LeaderboardSnapshot | null> {
  return getCachedHourLeaderboard();
}

export async function getCurrentSeasonLeaderboardSnapshot(): Promise<LeaderboardSnapshot | null> {
  return getCachedSeasonLeaderboard();
}

export async function getRoundLeaderboardSnapshot(
  roundId: string
): Promise<LeaderboardSnapshot | null> {
  return getCachedRoundLeaderboard(roundId);
}
