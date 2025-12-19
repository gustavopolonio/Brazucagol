import { z } from "zod";
import { and, eq, isNull } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { db } from "@/lib/drizzle";
import { clubs, clubMembers, levels, playerTotalStats, players, users } from "@/db/schema";

export const publicPlayersRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/players', async (request, reply) => {
    const getPlayerQuerySchema = z.object({
      playerName: z.string().trim().min(3).max(100),
    });

    const { playerName } = getPlayerQuerySchema.parse(request.query);

    try {
      const [player] = await db
        .select({
          id: players.id,
          name: players.name,
          levelNumber: players.level,
          levelTitle: levels.title,
          levelIconUrl: levels.iconUrl,
        })
        .from(players)
        .leftJoin(levels, eq(players.level, levels.id))
        .where(
          and(
            eq(players.name, playerName),
            isNull(players.deletedAt)
          )
        )
        .limit(1);

      if (!player) {
        return reply.status(404).send({ error: "Player not found." });
      }

      const [playerStats] = await db
        .select({
          autoGoal: playerTotalStats.autoGoal,
          penaltyGoal: playerTotalStats.penaltyGoal,
          freeKickGoal: playerTotalStats.freeKickGoal,
          trailGoal: playerTotalStats.trailGoal,
          penaltyAttempts: playerTotalStats.penaltyAttempts,
          freeKickAttempts: playerTotalStats.freeKickAttempts,
          trailAttempts: playerTotalStats.trailAttempts,
        })
        .from(playerTotalStats)
        .where(eq(playerTotalStats.playerId, player.id))
        .limit(1);

      if (!playerStats) {
        return reply.status(404).send({ error: "Player stats not found." });
      }

      const totalGoals =
        playerStats.autoGoal +
        playerStats.penaltyGoal +
        playerStats.freeKickGoal +
        playerStats.trailGoal;

      const [playerClub] = await db
        .select({
          clubName: clubs.name,
          clubLogoUrl: clubs.logoUrl,
        })
        .from(clubMembers)
        .leftJoin(clubs, eq(clubMembers.clubId, clubs.id))
        .where(
          and(
            eq(clubMembers.playerId, player.id),
            isNull(clubMembers.leftAt)
          )
        )
        .limit(1);

      if (!playerClub) {
        return reply.status(404).send({ error: "Player club not found." });
      }

      return reply.status(200).send({
        name: player.name,
        level: {
          number: player.levelNumber,
          title: player.levelTitle ?? null,
          iconUrl: player.levelIconUrl ?? null,
        },
        stats: {
          totalGoals,
          penaltyGoal: playerStats.penaltyGoal,
          penaltyAttempts: playerStats.penaltyAttempts,
          freeKickGoal: playerStats.freeKickGoal,
          freeKickAttempts: playerStats.freeKickAttempts,
          trailGoal: playerStats.trailGoal,
          trailAttempts: playerStats.trailAttempts
        },
        club: playerClub.clubName
          ? {
            name: playerClub.clubName,
            logoUrl: playerClub.clubLogoUrl,
          }
          : null,
      });
    } catch (error) {
      request.log.error(error, "Failed to fetch player");
      throw new Error(error);
    }
  });
};

export const protectedPlayersRoutes = async (fastify: FastifyInstance) => {
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
