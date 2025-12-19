import { z } from "zod";
import { and, eq, isNull } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { db } from "@/lib/drizzle";
import { clubs, clubMembers, players, users } from "@/db/schema";

export const playersRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/players', async (request, reply) => {
    const createPlayerBodySchema = z.object({
      playerName: z.string().trim().min(3).max(100),
      clubId: z.uuid()
    });

    const { playerName, clubId } = createPlayerBodySchema.parse(request.body);
    const session = request.authSession!;

    if (session.user.hasPlayer) {
      return reply.status(400).send({ error: "Player already created for this account." });
    }

    try {
      const [existingPlayerByName, club] = await Promise.all([
        db.query.players.findFirst({
          where: and(
            eq(players.name, playerName),
            isNull(players.deletedAt)
          )
        }),
        db.query.clubs.findFirst({
          where: eq(clubs.id, clubId)
        })
      ]);

      if (existingPlayerByName) {
        return reply.status(409).send({ error: "Player name already taken." });
      }

      if (!club) {
        return reply.status(404).send({ error: "Club not found." });
      }

      const player = await db.transaction(async (tx) => {
        const [createdPlayer] = await tx
          .insert(players)
          .values({
            name: playerName,
            userId: session.user.id,
          })
          .returning();

        await tx.insert(clubMembers).values({
          clubId,
          playerId: createdPlayer.id
        });

        await tx
          .update(users)
          .set({ hasPlayer: true })
          .where(eq(users.id, session.user.id));

        return createdPlayer;
      });

      return reply.status(201).send({
        player,
        club
      });
    } catch (error) {
      request.log.error(error, "Failed to create player");
      throw new Error(error);
    }
  });
};
