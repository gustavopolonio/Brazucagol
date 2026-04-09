import { env } from "@/env";
import { redisClient } from "@/lib/redis";
import { getPlayerById } from "@/repositories/playerRepository";
import { buildCooldownKey, initializeCooldownIfMissing } from "@/services/cooldown";
import { GoalActionType } from "@/types/goal.types";
import { db } from "@/lib/drizzle";
import { isFiniteNumber } from "@/utils";
import { getNextAutoGoalTimestamp, resolveCooldownTtlInSeconds } from "@/utils/gameplay";
import {
  AUTO_GOAL_SCHEDULE_KEY,
  GAMEPLAY_ONLINE_PLAYERS_KEY,
  ONLINE_PLAYERS_COUNT_CACHE_KEY,
} from "@/redis/keys/gameplayPresence";

const MANUAL_COOLDOWN_ACTIONS: GoalActionType[] = ["penalty", "free_kick", "trail"];
const PRESENCE_CLEANUP_COOLDOWN_ACTIONS: GoalActionType[] = [
  "auto",
  "penalty",
  "free_kick",
  "trail",
];

const CLEANUP_OFFLINE_PRESENCE_SCRIPT = `
local onlinePlayersKey = KEYS[1]
local autoGoalScheduleKey = KEYS[2]
local cutoffTimestamp = tonumber(ARGV[1])
local actionTypesCount = tonumber(ARGV[2])
local removedPlayerIds = {}

local candidatePlayerIds = redis.call("zrangebyscore", onlinePlayersKey, 0, cutoffTimestamp)

for _, playerId in ipairs(candidatePlayerIds) do
  local lastSeenTimestamp = redis.call("zscore", onlinePlayersKey, playerId)

  if lastSeenTimestamp and tonumber(lastSeenTimestamp) <= cutoffTimestamp then
    redis.call("zrem", onlinePlayersKey, playerId)
    redis.call("zrem", autoGoalScheduleKey, playerId)

    for actionTypeIndex = 1, actionTypesCount do
      local actionType = ARGV[2 + actionTypeIndex]
      redis.call("del", "cooldown:v1:" .. actionType .. ":" .. playerId)
    end

    table.insert(removedPlayerIds, playerId)
  end
end

return removedPlayerIds
`;

export async function startGameplayPresence(playerId: string): Promise<void> {
  const player = await getPlayerById({ db, playerId });

  if (!player) {
    throw new Error("Player not found to create gameplay session.");
  }

  const cooldownTtlInSeconds = resolveCooldownTtlInSeconds(player.vipExpiresAt, new Date());
  const currentTimestamp = Date.now();
  const nextAutoGoalTimestamp = getNextAutoGoalTimestamp(currentTimestamp, cooldownTtlInSeconds);

  await redisClient
    .multi()
    .zadd(GAMEPLAY_ONLINE_PLAYERS_KEY, currentTimestamp, playerId)
    .zadd(AUTO_GOAL_SCHEDULE_KEY, "NX", nextAutoGoalTimestamp, playerId)
    .exec();

  await Promise.all(
    MANUAL_COOLDOWN_ACTIONS.map((actionType) =>
      initializeCooldownIfMissing({
        playerId,
        actionType,
        ttlInSeconds: cooldownTtlInSeconds,
      })
    )
  );
}

export async function refreshGameplayPresence(playerId: string): Promise<void> {
  await redisClient.zadd(GAMEPLAY_ONLINE_PLAYERS_KEY, Date.now(), playerId);
}

export async function clearGameplayPresence(playerId: string): Promise<void> {
  const cooldownKeys = MANUAL_COOLDOWN_ACTIONS.map((actionType) =>
    buildCooldownKey({ playerId, actionType })
  );

  await redisClient
    .multi()
    .zrem(GAMEPLAY_ONLINE_PLAYERS_KEY, playerId)
    .zrem(AUTO_GOAL_SCHEDULE_KEY, playerId)
    .del(...cooldownKeys)
    .exec();
}

export async function cleanupOfflinePresenceAtomically(now: number): Promise<string[]> {
  const cutoffTimestamp = now - env.ONLINE_WINDOW_MS;

  try {
    const removedPlayerIds = await redisClient.eval(
      CLEANUP_OFFLINE_PRESENCE_SCRIPT,
      2,
      GAMEPLAY_ONLINE_PLAYERS_KEY,
      AUTO_GOAL_SCHEDULE_KEY,
      String(cutoffTimestamp),
      String(PRESENCE_CLEANUP_COOLDOWN_ACTIONS.length),
      ...PRESENCE_CLEANUP_COOLDOWN_ACTIONS
    );

    return Array.isArray(removedPlayerIds)
      ? removedPlayerIds.filter((playerId): playerId is string => typeof playerId === "string")
      : [];
  } catch (error) {
    console.error("Failed to cleanup offline presence atomically", error);
    return [];
  }
}

export async function isPlayerOffline(
  playerId: string,
  now: number = Date.now()
): Promise<boolean> {
  const lastSeen = await redisClient.zscore(GAMEPLAY_ONLINE_PLAYERS_KEY, playerId);

  if (!lastSeen) {
    return true;
  }

  const lastSeenTimestamp = Number(lastSeen);

  if (!isFiniteNumber(lastSeenTimestamp)) {
    return true;
  }

  return lastSeenTimestamp < now - env.ONLINE_WINDOW_MS;
}

export async function getOnlinePlayersCount(now: number = Date.now()): Promise<number> {
  try {
    const minScore = now - env.ONLINE_WINDOW_MS;
    const count = await redisClient.zcount(GAMEPLAY_ONLINE_PLAYERS_KEY, minScore, "+inf");
    return count;
  } catch (error) {
    console.error("Failed to load online players count", error);
    return 0;
  }
}

export async function getCachedOnlinePlayersCount(): Promise<number> {
  try {
    const cachedValue = await redisClient.get(ONLINE_PLAYERS_COUNT_CACHE_KEY);

    if (!cachedValue) {
      return 0;
    }

    const count = Number(cachedValue);
    return Number.isFinite(count) ? count : 0;
  } catch (error) {
    console.error("Failed to load cached online players count", error);
    return 0;
  }
}
