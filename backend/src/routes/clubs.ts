import { FastifyInstance } from "fastify";
import { z } from "zod";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/drizzle";
import { clubMembers, clubs, levels, players } from "@/db/schema";
import { getClubInventory } from "@/services/clubInventory";

export const publicClubsRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/clubs/:clubId/players", async (request, reply) => {
    const getClubPlayersParamsSchema = z.object({
      clubId: z.uuid(),
    });

    const { clubId } = getClubPlayersParamsSchema.parse(request.params);

    try {
      const club = await db.query.clubs.findFirst({
        where: eq(clubs.id, clubId),
      });

      if (!club) {
        return reply.status(404).send({ error: "Club not found." });
      }

      const clubPlayers = await db
        .select({
          id: players.id,
          name: players.name,
          role: clubMembers.role,
          levelIconUrl: levels.iconUrl,
        })
        .from(clubMembers)
        .innerJoin(players, eq(clubMembers.playerId, players.id))
        .leftJoin(levels, eq(players.level, levels.id))
        .where(
          and(eq(clubMembers.clubId, clubId), isNull(clubMembers.leftAt), isNull(players.deletedAt))
        )
        .orderBy(desc(players.level));

      return reply.status(200).send({
        players: clubPlayers,
      });
    } catch (error) {
      request.log.error(error, "Failed to fetch club players");
      throw new Error(error);
    }
  });
};

export const protectedClubsRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/clubs/:clubId/items", async (request, reply) => {
    const getClubItemsParamsSchema = z.object({
      clubId: z.uuid(),
    });

    const { clubId } = getClubItemsParamsSchema.parse(request.params);
    const session = request.authSession!;

    try {
      const inventory = await getClubInventory({
        userId: session.user.id,
        clubId,
      });

      return reply.status(200).send(inventory);
    } catch (error) {
      request.log.error(error, "Failed to fetch club items inventory");

      if (error instanceof Error) {
        if (error.message === "Club not found.") {
          return reply.status(404).send({ error: error.message });
        }

        if (
          error.message === "Actor player not found." ||
          error.message === "Actor player does not belong to this club." ||
          error.message === "Actor does not have permission to access club inventory."
        ) {
          return reply.status(403).send({ error: error.message });
        }
      }

      throw new Error(error);
    }
  });
};
