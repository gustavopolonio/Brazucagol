import crypto from "node:crypto";
import { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { db } from "@/lib/drizzle";
import { accounts, players, sessions, users } from "@/db/schema";

export const usersRoutes = async (fastify: FastifyInstance) => {
  fastify.delete("/users", async (request, reply) => {
    const session = request.authSession;
    const expectedPlayer = Boolean(session.user.hasPlayer);

    try {
      await db.transaction(async (tx) => {
        const timeNow = new Date();
        const scrubbedEmail = `${session.user.email}.deleted.${crypto.randomUUID()}`;

        const updatedUser = await tx
          .update(users)
          .set({
            email: scrubbedEmail,
            hasPlayer: false,
            deletedAt: timeNow,
          })
          .where(eq(users.id, session.user.id))
          .returning();

        if (updatedUser.length === 0) {
          return reply.status(404).send({ error: "User not found to delete." });
        }

        const playerResult = await tx
          .update(players)
          .set({ deletedAt: timeNow })
          .where(eq(players.userId, session.user.id))
          .returning();

        // Clear sessions and linked social accounts
        await tx.delete(sessions).where(eq(sessions.userId, session.user.id));
        await tx.delete(accounts).where(eq(accounts.userId, session.user.id));

        // User has player created (users.has_player) but this player was not soft deleted
        if (expectedPlayer && playerResult.length === 0) {
          return reply.status(404).send({ error: "User deleted, but player not found to delete." });
        }

        return reply.status(204).send();
      });
    } catch (error) {
      request.log.error(error, "Failed to delete user");
      throw new Error(error);
    }
  });
};
