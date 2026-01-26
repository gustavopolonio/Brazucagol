import { startGameplayPresence, refreshGameplayPresence } from "@/services/gameplayPresenceStore";

export async function handleGameplaySocketConnected(playerId: string) {
  await startGameplayPresence(playerId);
}

export async function handleGameplaySocketHeartbeat(playerId: string): Promise<void> {
  await refreshGameplayPresence(playerId);
}

export function handleGameplaySocketDisconnected() {
  // Presence relies on Redis TTL; no immediate action on disconnect.
}
