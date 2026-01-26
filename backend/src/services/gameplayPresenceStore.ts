import { env } from "@/env";
import { redisClient } from "@/lib/redis";
import { getPlayerById } from "@/repositories/playerRepository";
import { buildCooldownKey, initializeCooldownIfMissing } from "@/services/cooldown";
import { GoalActionType } from "@/types/goal.types";
import { db } from "@/lib/drizzle";
import { isFiniteNumber } from "@/utils";
import { getNextAutoGoalTimestamp, resolveCooldownTtlInSeconds } from "@/utils/gameplay";
import { AUTO_GOAL_SCHEDULE_KEY, GAMEPLAY_ONLINE_PLAYERS_KEY } from "@/redis/keys/gameplayPresence";

const MANUAL_COOLDOWN_ACTIONS: GoalActionType[] = ["penalty", "free_kick", "trail"];

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

export async function cleanupOfflinePresence(now: number) {
  const offlinePlayers = await redisClient.zrangebyscore(
    GAMEPLAY_ONLINE_PLAYERS_KEY,
    0,
    now - env.ONLINE_WINDOW_MS
  );

  if (offlinePlayers.length === 0) return;

  const cooldownKeys = offlinePlayers.flatMap((playerId) =>
    MANUAL_COOLDOWN_ACTIONS.map((actionType) => buildCooldownKey({ playerId, actionType }))
  );

  await redisClient
    .multi()
    .zrem(GAMEPLAY_ONLINE_PLAYERS_KEY, ...offlinePlayers)
    .zrem(AUTO_GOAL_SCHEDULE_KEY, ...offlinePlayers)
    .del(...cooldownKeys)
    .exec();
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
