import { FastifyInstance } from "fastify";
import { seasonsRoutes } from "@/routes/seasons";
import { authPlugin } from "@/plugins/authPlugin";

export async function adminRoutes(fastify: FastifyInstance) {
  fastify.register(async (app) => {
    await authPlugin(app);

    app.register(async (adminScope) => {
      adminScope.addHook("onRequest", async (request, reply) => {
        if (request.authSession?.user.role !== "admin") {
          return reply.status(403).send({ error: "Forbidden" });
        }
      });

      adminScope.register(seasonsRoutes);
    });
  });
}
