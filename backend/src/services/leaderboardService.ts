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
import {
  checkAndUpdateHourSeasonRecord,
  checkAndUpdateRoundSeasonRecord,
} from "@/services/seasonRecordsService";
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

async function buildRecordLeadersSnapshot(
  leaderboardKey: string,
  leaderboardSnapshot: LeaderboardSnapshot | null
): Promise<LeaderboardSnapshot | null> {
  if (!leaderboardSnapshot || leaderboardSnapshot.length === 0) {
    return null;
  }

  let topScore = Number.NEGATIVE_INFINITY;

  for (const entry of leaderboardSnapshot) {
    if (!Number.isFinite(entry.goals)) continue;
    if (entry.goals > topScore) {
      topScore = entry.goals;
    }
  }

  if (!Number.isFinite(topScore)) {
    return null;
  }

  const playerIds = await redisClient.zrangebyscore(leaderboardKey, topScore, topScore);

  if (playerIds.length === 0) {
    return null;
  }

  return playerIds.map((playerId) => ({
    playerId,
    goals: topScore,
  }));
}

async function getLeaderboardSnapshotForKey(
  leaderboardKey: string
): Promise<LeaderboardSnapshot | null> {
  try {
    const rawEntries = await redisClient.zrevrange(leaderboardKey, 0, 9, "WITHSCORES");
    return buildLeaderboardEntriesFromZset(rawEntries);
  } catch (error) {
    console.error(`Failed to read leaderboard snapshot for ${leaderboardKey}`, error);
    return null;
  }
}

export async function refreshLeaderboardSnapshot({
  leaderboardKey,
  cacheKey,
}: RefreshLeaderboardSnapshotProps): Promise<LeaderboardSnapshot | null> {
  try {
    const rawEntries = await redisClient.zrevrange(leaderboardKey, 0, 9, "WITHSCORES");
    const snapshot: LeaderboardSnapshot = buildLeaderboardEntriesFromZset(rawEntries);

    await redisClient.set(cacheKey, JSON.stringify(snapshot));
    return snapshot;
  } catch (error) {
    console.error(`Failed to refresh leaderboard snapshot for ${cacheKey}`, error);
    return null;
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

export async function checkHourSeasonRecordForHourKey(
  seasonId: string,
  hourKey: string
): Promise<void> {
  const hourLeaderboardKey = buildHourlyLeaderboardKey(hourKey);
  const snapshot = await getLeaderboardSnapshotForKey(hourLeaderboardKey);
  const leadersSnapshot = await buildRecordLeadersSnapshot(hourLeaderboardKey, snapshot);

  await checkAndUpdateHourSeasonRecord(seasonId, leadersSnapshot);
}

export async function checkRoundSeasonRecordForRoundId(
  seasonId: string,
  roundId: string
): Promise<void> {
  const roundLeaderboardKey = buildRoundLeaderboardKey(roundId);
  const snapshot = await getLeaderboardSnapshotForKey(roundLeaderboardKey);
  const leadersSnapshot = await buildRecordLeadersSnapshot(roundLeaderboardKey, snapshot);

  await checkAndUpdateRoundSeasonRecord(seasonId, leadersSnapshot);
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
