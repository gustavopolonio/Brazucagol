import { FastifyInstance } from "fastify";
import { Server } from "socket.io";
import { env } from "@/env";
import {
  authenticateSocketConnection,
  handleSocketConnected,
  handleSocketDisconnected,
} from "@/sockets/handlers/connection";
import { registerGameplayHandlers } from "@/sockets/handlers/gameplay";
import { setSocketServer } from "@/sockets/emitter";
import { startLeaderboardSnapshotEmitter } from "@/sockets/emitters/leaderboardSnapshotEmitter";
import { startOnlinePlayersCountEmitter } from "@/sockets/emitters/onlinePlayersCountEmitter";
import { startAutoGoalSubscriber } from "@/sockets/autoGoalSubscriber";

export function startSocketServer(fastify: FastifyInstance) {
  const io = new Server(fastify.server, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  setSocketServer(io);
  startLeaderboardSnapshotEmitter();
  startAutoGoalSubscriber();
  startOnlinePlayersCountEmitter();

  io.on("connection", async (socket) => {
    console.log("🔌 Socket attempting connection");
    const isAuthenticated = await authenticateSocketConnection(socket);

    if (!isAuthenticated) {
      console.log("❌ Socket authentication failed");
      return;
    }

    console.log("✅ Socket authenticated", socket.data.playerId);

    await handleSocketConnected(socket);
    registerGameplayHandlers(socket);

    socket.on("disconnect", () => {
      handleSocketDisconnected(socket);
    });
  });

  return io;
}
