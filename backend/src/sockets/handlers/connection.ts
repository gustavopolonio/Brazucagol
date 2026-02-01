import { Socket } from "socket.io";
import {
  handleGameplaySocketConnected,
  handleGameplaySocketDisconnected,
} from "@/services/gameplayPresence";
import { resolvePlayerIdFromSocketToken } from "@/services/socketAuthentication";

export async function authenticateSocketConnection(socket: Socket): Promise<boolean> {
  console.log("🔐 Socket auth payload:", socket.handshake.auth);

  const token = socket.handshake.auth?.token;
  const playerId = await resolvePlayerIdFromSocketToken({ token });

  if (!playerId) {
    socket.disconnect();
    return false;
  }

  socket.data.playerId = playerId;
  return true;
}

export async function handleSocketConnected(socket: Socket): Promise<void> {
  const playerId = socket.data.playerId;

  if (!playerId) {
    return;
  }

  socket.join(`player:${playerId}`);
  await handleGameplaySocketConnected(playerId);
}

export function handleSocketDisconnected(socket: Socket): void {
  const playerId = socket.data.playerId;

  if (!playerId) {
    return;
  }

  handleGameplaySocketDisconnected();
}
