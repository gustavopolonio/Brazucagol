import { FastifyInstance } from "fastify";
import { auth } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { getPlayerIdByUserId } from "@/repositories/playerRepository";
import { clearGameplayPresence } from "@/services/gameplayPresenceStore";

export const authRoutes = async (fastify: FastifyInstance) => {
  fastify.route({
    method: ["GET", "POST"],
    url: "/api/auth/*",
    async handler(request, reply) {
      try {
        // Construct request URL
        const url = new URL(request.url, `http://${request.headers.host}`);
        const pathname = url.pathname;

        // Convert Fastify headers to standard Headers object
        const headers = new Headers();
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value) headers.append(key, value.toString());
        });

        const isLogoutRequest =
          pathname.endsWith("/signout") ||
          pathname.endsWith("/sign-out") ||
          pathname.endsWith("/logout");
        let logoutPlayerId: string | null = null;

        if (isLogoutRequest) {
          const session = await auth.api.getSession({ headers });

          if (session?.user?.hasPlayer) {
            const player = await getPlayerIdByUserId({ db, userId: session.user.id });
            logoutPlayerId = player?.id ?? null;
          }
        }

        // Create Fetch API-compatible request
        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          body: request.body ? JSON.stringify(request.body) : undefined,
        });

        // Process authentication request
        const response = await auth.handler(req);

        if (logoutPlayerId) {
          await clearGameplayPresence(logoutPlayerId);
        }

        response.headers.forEach((value, key) => reply.header(key, value));
        return reply.status(response.status).send(response.body ? await response.text() : null);
      } catch (error) {
        console.log("Authentication Error:", error);
        reply.status(500).send({
          error: "Internal authentication error",
          code: "AUTH_FAILURE",
        });
      }
    },
  });
};
