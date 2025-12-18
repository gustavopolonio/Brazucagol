import { auth } from "@/lib/auth";
import { FastifyReply, FastifyRequest } from "fastify";

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
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
}
