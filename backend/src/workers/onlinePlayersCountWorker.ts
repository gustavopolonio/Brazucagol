import { env } from "@/env";
import { redisClient } from "@/lib/redis";
import { getOnlinePlayersCount } from "@/services/gameplayPresenceStore";
import { ONLINE_PLAYERS_COUNT_CACHE_KEY } from "@/redis/keys/gameplayPresence";

async function runOnlinePlayersCountWorkerOnce(): Promise<void> {
  const onlinePlayersCount = await getOnlinePlayersCount();
  await redisClient.set(ONLINE_PLAYERS_COUNT_CACHE_KEY, String(onlinePlayersCount));
}

interface StartOnlinePlayersCountWorkerProps {
  intervalMilliseconds?: number;
}

export function startOnlinePlayersCountWorker({
  intervalMilliseconds = env.ONLINE_PLAYERS_COUNT_INTERVAL_MS,
}: StartOnlinePlayersCountWorkerProps = {}) {
  const runTick = async () => {
    try {
      await runOnlinePlayersCountWorkerOnce();
    } catch (error) {
      console.error("Online players count worker tick failed", error);
    }
  };

  void runTick();

  return setInterval(() => {
    void runTick();
  }, intervalMilliseconds);
}

startOnlinePlayersCountWorker();
