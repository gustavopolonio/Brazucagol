import { env } from "@/env";
import { getCachedOnlinePlayersCount } from "@/services/gameplayPresenceStore";
import { getSocketServer } from "@/sockets/socketServer";

async function emitOnlinePlayersCountOnce() {
  let io: ReturnType<typeof getSocketServer> | null = null;

  try {
    io = getSocketServer();
  } catch (error) {
    console.warn("Socket.IO server not initialized for online count emitter", error);
    return;
  }

  const count = await getCachedOnlinePlayersCount();
  io.emit("online_players_count", { count });
}

export function startOnlinePlayersCountEmitter({
  intervalMilliseconds = env.ONLINE_PLAYERS_COUNT_INTERVAL_MS,
}: {
  intervalMilliseconds?: number;
} = {}) {
  // Workers write presence data to Redis; the API process emits sockets.
  const runTick = async () => {
    try {
      await emitOnlinePlayersCountOnce();
    } catch (error) {
      console.warn("Online players count emitter tick failed", error);
    }
  };

  void runTick();

  return setInterval(() => {
    void runTick();
  }, intervalMilliseconds);
}
