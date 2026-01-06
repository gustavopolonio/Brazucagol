import { FastifyInstance } from "fastify";
import { auth } from "@/lib/auth";

export async function authPlugin(fastify: FastifyInstance) {
  fastify.addHook("onRequest", async (request, reply) => {
    const headers = new Headers();

    for (const [key, value] of Object.entries(request.headers)) {
      if (Array.isArray(value)) {
        value.forEach((v) => headers.append(key, v));
      } else if (value !== undefined) {
        headers.append(key, value);
      }
    }

    const session = await auth.api.getSession({ headers });

    if (!session) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    request.authSession = session;
  });
}
