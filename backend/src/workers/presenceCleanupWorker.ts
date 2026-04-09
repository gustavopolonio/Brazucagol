import { env } from "@/env";
import { cleanupOfflinePresenceAtomically } from "@/services/gameplayPresenceStore";

export async function runPresenceCleanupWorkerOnce() {
  const now = Date.now();
  await cleanupOfflinePresenceAtomically(now);
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
