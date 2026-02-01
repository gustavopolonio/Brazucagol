import { Server } from "socket.io";
import {
  getSocketServer,
  setSocketServer as setSocketServerInstance,
} from "@/sockets/socketServer";

export function setSocketServer(server: Server) {
  setSocketServerInstance(server);
}

export function emitToPlayer(playerId: string, event: string, payload: unknown) {
  try {
    const io = getSocketServer();
    io.to(`player:${playerId}`).emit(event, payload);
  } catch {
    // Socket.IO server not initialized; ignore emits in worker-only processes.
  }
}

export function emitToAll(event: string, payload: unknown) {
  try {
    const io = getSocketServer();
    io.emit(event, payload);
  } catch {
    // Socket.IO server not initialized; ignore emits in worker-only processes.
  }
}
