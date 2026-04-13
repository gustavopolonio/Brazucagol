import { z } from "zod";
import { and, eq, isNull, ne } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { db } from "@/lib/drizzle";
import { clubs, clubMembers, levels, playerTotalStats, players, users } from "@/db/schema";
import { getLoggedPlayerCoins } from "@/services/playerCoins";
import { getLoggedPlayerInventory } from "@/services/playerInventory";
import {
  getLoggedPlayerLatestNotifications,
  getLoggedPlayerUnreadNotificationsCount,
  markAllLoggedPlayerNotificationsAsRead,
  markLoggedPlayerNotificationAsRead,
} from "@/services/playerNotifications";
import { getLoggedPlayerPurchaseHistory } from "@/services/playerPurchaseHistory";
import { createLoggedPlayerRealMoneyPurchase } from "@/services/playerRealMoneyPurchase";
import { useTransferPassToJoinClub } from "@/services/playerTransfer";
import { getLoggedPlayerPendingIncomingTransferProposals } from "@/services/playerTransferProposals";
import { consumeLoggedPlayerVip } from "@/services/playerVipConsumption";
import { canCreatePlayer } from "@/lib/authorization";

export const publicPlayersRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/players", async (request, reply) => {
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
        .where(and(eq(players.name, playerName), isNull(players.deletedAt)))
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
        .where(and(eq(clubMembers.playerId, player.id), isNull(clubMembers.leftAt)))
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
          trailAttempts: playerStats.trailAttempts,
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
  fastify.get("/players/notifications", async (request, reply) => {
    const querySchema = z.object({
      limit: z.coerce.number().int().positive().max(100).default(50),
    });

    const { limit } = querySchema.parse(request.query);
    const session = request.authSession!;

    try {
      const notifications = await getLoggedPlayerLatestNotifications({
        userId: session.user.id,
        limit,
      });

      return reply.status(200).send(notifications);
    } catch (error) {
      request.log.error(error, "Failed to fetch player notifications");

      if (error instanceof Error && error.message === "Player not found.") {
        return reply.status(404).send({ error: error.message });
      }

      throw new Error(error);
    }
  });

  fastify.get("/players/notifications/unread-count", async (request, reply) => {
    const session = request.authSession!;

    try {
      const unreadCount = await getLoggedPlayerUnreadNotificationsCount({
        userId: session.user.id,
      });

      return reply.status(200).send(unreadCount);
    } catch (error) {
      request.log.error(error, "Failed to fetch unread notifications count");

      if (error instanceof Error && error.message === "Player not found.") {
        return reply.status(404).send({ error: error.message });
      }

      throw new Error(error);
    }
  });

  fastify.get("/players/transfer-proposals/incoming", async (request, reply) => {
    const session = request.authSession!;

    try {
      const proposals = await getLoggedPlayerPendingIncomingTransferProposals({
        userId: session.user.id,
      });

      return reply.status(200).send(proposals);
    } catch (error) {
      request.log.error(error, "Failed to fetch incoming transfer proposals");

      if (error instanceof Error && error.message === "Player not found.") {
        return reply.status(404).send({ error: error.message });
      }

      throw new Error(error);
    }
  });

  fastify.get("/players/purchases", async (request, reply) => {
    const session = request.authSession!;

    try {
      const purchaseHistory = await getLoggedPlayerPurchaseHistory({
        userId: session.user.id,
      });

      return reply.status(200).send(purchaseHistory);
    } catch (error) {
      request.log.error(error, "Failed to fetch player purchase history");

      if (error instanceof Error && error.message === "Player not found.") {
        return reply.status(404).send({ error: error.message });
      }

      throw new Error(error);
    }
  });

  fastify.get("/players/items", async (request, reply) => {
    const session = request.authSession!;

    try {
      const inventory = await getLoggedPlayerInventory({
        userId: session.user.id,
      });

      return reply.status(200).send(inventory);
    } catch (error) {
      request.log.error(error, "Failed to fetch player items");

      if (error instanceof Error && error.message === "Player not found.") {
        return reply.status(404).send({ error: error.message });
      }

      throw new Error(error);
    }
  });

  fastify.get("/players/coins", async (request, reply) => {
    const session = request.authSession!;

    try {
      const playerCoins = await getLoggedPlayerCoins({
        userId: session.user.id,
      });

      return reply.status(200).send(playerCoins);
    } catch (error) {
      request.log.error(error, "Failed to fetch player coins");

      if (error instanceof Error && error.message === "Player not found.") {
        return reply.status(404).send({ error: error.message });
      }

      throw new Error(error);
    }
  });

  fastify.post("/players", async (request, reply) => {
    const createPlayerBodySchema = z.object({
      playerName: z.string().trim().min(3).max(100),
      clubId: z.uuid(),
    });

    const { playerName, clubId } = createPlayerBodySchema.parse(request.body);
    const session = request.authSession!;

    if (!canCreatePlayer(session.user.role)) {
      return reply.status(403).send({ error: "Only gameplay accounts can create a player." });
    }

    if (session.user.hasPlayer) {
      return reply.status(400).send({ error: "Player already created for this account." });
    }

    try {
      const [existingPlayerByName, club] = await Promise.all([
        db.query.players.findFirst({
          where: and(eq(players.name, playerName), isNull(players.deletedAt)),
        }),
        db.query.clubs.findFirst({
          where: eq(clubs.id, clubId),
        }),
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
          playerId: createdPlayer.id,
        });

        await tx.update(users).set({ hasPlayer: true }).where(eq(users.id, session.user.id));

        await tx.insert(playerTotalStats).values({
          playerId: createdPlayer.id,
        });

        return createdPlayer;
      });

      return reply.status(201).send({
        player,
        club,
      });
    } catch (error) {
      request.log.error(error, "Failed to create player");
      throw new Error(error);
    }
  });

  fastify.post("/players/items/vip/consume", async (request, reply) => {
    const bodySchema = z
      .object({
        itemId: z.uuid(),
        quantity: z.number().int().positive().optional(),
        useAll: z.boolean().optional(),
      })
      .refine((value) => value.useAll === true || value.quantity !== undefined, {
        message: "quantity is required when useAll is not true",
        path: ["quantity"],
      });

    const { itemId, quantity, useAll } = bodySchema.parse(request.body);
    const session = request.authSession!;

    try {
      const result = await consumeLoggedPlayerVip({
        userId: session.user.id,
        itemId,
        quantity,
        useAll,
      });

      return reply.status(200).send(result);
    } catch (error) {
      request.log.error(error, "Failed to consume VIP item");

      if (error instanceof Error) {
        if (error.message === "Player not found." || error.message === "Store item not found.") {
          return reply.status(404).send({ error: error.message });
        }

        if (
          error.message === "Provided item is not a VIP item." ||
          error.message === "VIP item has invalid durationSeconds." ||
          error.message === "Player does not have enough VIP item quantity." ||
          error.message === "Unable to consume VIP item." ||
          error.message === "Unable to extend player VIP."
        ) {
          return reply.status(400).send({ error: error.message });
        }
      }

      throw new Error(error);
    }
  });

  fastify.post("/players/items/transfer-pass/use", async (request, reply) => {
    const bodySchema = z.object({
      targetClubId: z.uuid(),
    });

    const { targetClubId } = bodySchema.parse(request.body);
    const session = request.authSession!;

    try {
      const transfer = await useTransferPassToJoinClub({
        userId: session.user.id,
        destinationClubId: targetClubId,
      });

      return reply.status(200).send(transfer);
    } catch (error) {
      request.log.error(error, "Failed to use transfer pass to change clubs");

      if (error instanceof Error) {
        if (
          error.message === "Player not found." ||
          error.message === "Destination club not found."
        ) {
          return reply.status(404).send({ error: error.message });
        }

        if (
          error.message === "Player does not belong to any club." ||
          error.message === "Player already belongs to destination club." ||
          error.message === "Player does not have enough transfer pass items." ||
          error.message === "Unable to consume transfer pass item." ||
          error.message === "Unable to leave current club." ||
          error.message === "Unable to resolve competing transfer proposal as denied."
        ) {
          return reply.status(400).send({ error: error.message });
        }
      }

      throw new Error(error);
    }
  });

  fastify.post("/players/items/purchase/real-money", async (request, reply) => {
    const bodySchema = z.object({
      items: z
        .array(
          z.object({
            storeItemId: z.uuid(),
            quantity: z.number().int().positive(),
          })
        )
        .min(1),
    });

    const { items } = bodySchema.parse(request.body);
    const session = request.authSession!;

    try {
      const checkout = await createLoggedPlayerRealMoneyPurchase({
        userId: session.user.id,
        userName: session.user.name,
        userEmail: session.user.email,
        items,
      });

      return reply.status(201).send(checkout);
    } catch (error) {
      request.log.error(error, "Failed to create real money purchase checkout");

      if (error instanceof Error) {
        if (error.message === "Player not found." || error.message === "Store item not found.") {
          return reply.status(404).send({ error: error.message });
        }

        if (
          error.message === "items must contain at least one purchase item." ||
          error.message === "One or more store items are not available in store." ||
          error.message === "One or more store items cannot be purchased with real money." ||
          error.message === "One or more store items do not have a real money price."
        ) {
          return reply.status(400).send({ error: error.message });
        }

        if (error.message === "One or more store items were not found.") {
          return reply.status(404).send({ error: error.message });
        }
      }

      throw error;
    }
  });

  fastify.patch("/players/:playerId", async (request, reply) => {
    const paramsSchema = z.object({
      playerId: z.uuid(),
    });

    const bodySchema = z.object({
      playerName: z.string().trim().min(3).max(100),
    });

    const { playerId } = paramsSchema.parse(request.params);
    const { playerName } = bodySchema.parse(request.body);
    const session = request.authSession!;

    try {
      const player = await db.query.players.findFirst({
        where: and(
          eq(players.id, playerId),
          eq(players.userId, session.user.id),
          isNull(players.deletedAt)
        ),
      });

      if (!player) {
        return reply.status(404).send({ error: "Player not found." });
      }

      const nameAlreadyExists = await db.query.players.findFirst({
        where: and(
          eq(players.name, playerName),
          isNull(players.deletedAt),
          ne(players.id, playerId)
        ),
      });

      if (nameAlreadyExists) {
        return reply.status(409).send({ error: "Player name already taken." });
      }

      // TODO: only let update name with some item from store

      const [updatedPlayer] = await db
        .update(players)
        .set({ name: playerName })
        .where(eq(players.id, playerId))
        .returning();

      return reply.status(200).send({ player: updatedPlayer });
    } catch (error) {
      request.log.error(error, "Failed to update player");
      throw new Error(error);
    }
  });

  fastify.patch("/players/notifications/:notificationId/read", async (request, reply) => {
    const paramsSchema = z.object({
      notificationId: z.uuid(),
    });

    const { notificationId } = paramsSchema.parse(request.params);
    const session = request.authSession!;

    try {
      const notification = await markLoggedPlayerNotificationAsRead({
        userId: session.user.id,
        notificationId,
      });

      return reply.status(200).send(notification);
    } catch (error) {
      request.log.error(error, "Failed to mark player notification as read");

      if (
        error instanceof Error &&
        (error.message === "Player not found." || error.message === "Notification not found.")
      ) {
        return reply.status(404).send({ error: error.message });
      }

      throw new Error(error);
    }
  });

  fastify.patch("/players/notifications/read-all", async (request, reply) => {
    const session = request.authSession!;

    try {
      const result = await markAllLoggedPlayerNotificationsAsRead({
        userId: session.user.id,
      });

      return reply.status(200).send(result);
    } catch (error) {
      request.log.error(error, "Failed to mark all player notifications as read");

      if (error instanceof Error && error.message === "Player not found.") {
        return reply.status(404).send({ error: error.message });
      }

      throw new Error(error);
    }
  });
};
