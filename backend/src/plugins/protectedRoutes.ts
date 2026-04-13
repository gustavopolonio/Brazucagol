import { protectedPlayersRoutes } from "@/routes/players";
import { protectedTransferProposalRoutes } from "@/routes/transferProposals";
import { usersRoutes } from "@/routes/users";
import { protectedClubsRoutes } from "@/routes/clubs";
import { FastifyInstance } from "fastify";
import { authPlugin } from "@/plugins/authPlugin";
import { requirePermission } from "@/lib/authorization";

export async function protectedRoutes(fastify: FastifyInstance) {
  // Auth middleware
  fastify.register(async (app) => {
    await authPlugin(app);

    app.register(async (gameplayScope) => {
      gameplayScope.addHook("onRequest", requirePermission("gameplay.access"));

      gameplayScope.register(protectedPlayersRoutes);
      gameplayScope.register(protectedClubsRoutes);
      gameplayScope.register(protectedTransferProposalRoutes);
    });

    app.register(usersRoutes);
  });
}
