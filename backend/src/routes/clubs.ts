import { FastifyInstance } from "fastify";
import { z } from "zod";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/drizzle";
import { clubMembers, clubs, levels, players } from "@/db/schema";

export const clubsRoutes = async (fastify: FastifyInstance) => {
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
