import { auth } from "@/lib/auth";
import { protectedPlayersRoutes } from "@/routes/players";
import { usersRoutes } from "@/routes/users";
import { FastifyInstance } from "fastify";

export async function protectedRoutes(fastify: FastifyInstance) {
  // Auth middleware
  fastify.addHook('onRequest', async (request, reply) => {
    const headers = new Headers();
    Object.entries(request.headers).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val) => headers.append(key, val));
      } else if (value !== undefined) {
        headers.append(key, value);
      }
    });

    const session = await auth.api.getSession({
      headers,
    });

    if (!session) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    request.authSession = session;
  });

  fastify.register(protectedPlayersRoutes);
  fastify.register(usersRoutes);
}
