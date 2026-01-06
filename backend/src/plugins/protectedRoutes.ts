import { protectedPlayersRoutes } from "@/routes/players";
import { usersRoutes } from "@/routes/users";
import { FastifyInstance } from "fastify";
import { authPlugin } from "@/plugins/authPlugin";

export async function protectedRoutes(fastify: FastifyInstance) {
  // Auth middleware
  fastify.register(async (app) => {
    await authPlugin(app);

    app.register(protectedPlayersRoutes);
    app.register(usersRoutes);
  });
}
