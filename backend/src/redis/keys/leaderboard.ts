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
