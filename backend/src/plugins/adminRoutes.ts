import { FastifyInstance } from "fastify";
import { seasonsRoutes } from "@/routes/seasons";
import { authPlugin } from "@/plugins/authPlugin";
import { requirePermission } from "@/lib/authorization";

export async function adminRoutes(fastify: FastifyInstance) {
  fastify.register(async (app) => {
    await authPlugin(app);

    app.register(async (adminScope) => {
      adminScope.addHook("onRequest", requirePermission("admin.access_panel"));

      adminScope.register(seasonsRoutes);
    });
  });
}
