import { Server } from "socket.io";

let io: Server | null = null;

export function setSocketServer(server: Server) {
  io = server;
}

export function getSocketServer(): Server {
  if (!io) {
    throw new Error("Socket.IO server not initialized");
  }
  return io;
}
