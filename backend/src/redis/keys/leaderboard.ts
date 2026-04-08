export function buildHourlyLeaderboardKey(hourKey: string) {
  return `leaderboard:v1:hour:${hourKey}`;
}

export function buildRoundLeaderboardKey(roundId: string) {
  return `leaderboard:v1:round:${roundId}`;
}

export function buildSeasonLeaderboardKey(seasonId: string) {
  return `leaderboard:v1:season:${seasonId}`;
}

export const LEADERBOARD_CACHE_HOUR_KEY = "cache:v1:leaderboard:hour";
export const LEADERBOARD_CACHE_SEASON_KEY = "cache:v1:leaderboard:season";

export function buildLeaderboardCacheRoundKey(roundId: string) {
  return `cache:v1:leaderboard:round:${roundId}`;
}

export function buildSeasonRecordHourProcessedKey(hourKey: string) {
  return `season_record:v1:hour_processed:${hourKey}`;
}

export function buildHourLeaderboardRewardProcessedKey(hourKey: string) {
  return `leaderboard_reward:v1:hour_processed:${hourKey}`;
}

export function buildRoundLeaderboardRewardProcessedKey(roundId: string) {
  return `leaderboard_reward:v1:round_processed:${roundId}`;
}

export function buildSeasonLeaderboardRewardProcessedKey(seasonId: string) {
  return `leaderboard_reward:v1:season_processed:${seasonId}`;
}

export function buildSeasonRecordRewardProcessedKey(seasonId: string, type: string) {
  return `season_record_reward:v1:processed:${seasonId}:${type}`;
}
