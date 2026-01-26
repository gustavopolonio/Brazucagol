import { env } from "@/env";
import { redisClient } from "@/lib/redis";
import { buildCooldownKey } from "@/services/cooldown";
import { AUTO_GOAL_SCHEDULE_KEY, GAMEPLAY_ONLINE_PLAYERS_KEY } from "@/redis/keys/gameplayPresence";
import { GoalActionType } from "@/types/goal.types";

const COOLDOWN_ACTION_TYPES: GoalActionType[] = ["auto", "penalty", "free_kick", "trail"];

function buildCooldownKeysForPlayers(playerIds: string[]): string[] {
  return playerIds.flatMap((playerId) =>
    COOLDOWN_ACTION_TYPES.map((actionType) => buildCooldownKey({ playerId, actionType }))
  );
}

async function loadOfflinePlayerIds(now: number): Promise<string[]> {
  try {
    return await redisClient.zrangebyscore(
      GAMEPLAY_ONLINE_PLAYERS_KEY,
      0,
      now - env.ONLINE_WINDOW_MS
    );
  } catch (error) {
    console.error("Failed to load offline players", error);
    return [];
  }
}

async function cleanupOfflinePresenceState(offlinePlayerIds: string[]): Promise<void> {
  if (offlinePlayerIds.length === 0) return;

  const cooldownKeys = buildCooldownKeysForPlayers(offlinePlayerIds);

  try {
    await redisClient
      .multi()
      .zrem(GAMEPLAY_ONLINE_PLAYERS_KEY, ...offlinePlayerIds)
      .zrem(AUTO_GOAL_SCHEDULE_KEY, ...offlinePlayerIds)
      .del(...cooldownKeys)
      .exec();
  } catch (error) {
    console.error("Failed to cleanup offline players", error);
  }
}

export async function runPresenceCleanupWorkerOnce() {
  const now = Date.now();
  const offlinePlayerIds = await loadOfflinePlayerIds(now);

  await cleanupOfflinePresenceState(offlinePlayerIds);
}

interface StartPresenceCleanupWorkerProps {
  intervalMilliseconds?: number;
}

export function startPresenceCleanupWorker({
  intervalMilliseconds = env.PRESENCE_CLEANUP_INTERVAL_MS,
}: StartPresenceCleanupWorkerProps = {}) {
  const runTick = async () => {
    try {
      await runPresenceCleanupWorkerOnce();
    } catch (error) {
      console.error("Presence cleanup worker tick failed", error);
    }
  };

  void runTick();

  return setInterval(() => {
    void runTick();
  }, intervalMilliseconds);
}

startPresenceCleanupWorker();
