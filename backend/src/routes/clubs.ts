import { FastifyInstance } from "fastify";
import { z } from "zod";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/drizzle";
import { clubMembers, clubs, levels, players } from "@/db/schema";
import { getClubCoins } from "@/services/clubCoins";
import { getClubInventory } from "@/services/clubInventory";
import { getClubItemTransferHistory } from "@/services/clubItemTransferHistory";
import { getClubPurchaseHistory } from "@/services/clubPurchaseHistory";
import { buyClubStoreItemWithCoins } from "@/services/clubStorePurchase";

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
          error.message === "Actor does not have permission to access this club resource."
        ) {
          return reply.status(403).send({ error: error.message });
        }
      }

      throw new Error(error);
    }
  });

  fastify.get("/clubs/:clubId/coins", async (request, reply) => {
    const getClubCoinsParamsSchema = z.object({
      clubId: z.uuid(),
    });

    const { clubId } = getClubCoinsParamsSchema.parse(request.params);
    const session = request.authSession!;

    try {
      const clubCoins = await getClubCoins({
        userId: session.user.id,
        clubId,
      });

      return reply.status(200).send(clubCoins);
    } catch (error) {
      request.log.error(error, "Failed to fetch club coins");

      if (error instanceof Error) {
        if (error.message === "Club not found.") {
          return reply.status(404).send({ error: error.message });
        }

        if (
          error.message === "Actor player not found." ||
          error.message === "Actor player does not belong to this club." ||
          error.message === "Actor does not have permission to access this club resource."
        ) {
          return reply.status(403).send({ error: error.message });
        }
      }

      throw new Error(error);
    }
  });

  fastify.get("/clubs/:clubId/purchases", async (request, reply) => {
    const getClubPurchasesParamsSchema = z.object({
      clubId: z.uuid(),
    });

    const { clubId } = getClubPurchasesParamsSchema.parse(request.params);
    const session = request.authSession!;

    try {
      const purchaseHistory = await getClubPurchaseHistory({
        userId: session.user.id,
        clubId,
      });

      return reply.status(200).send(purchaseHistory);
    } catch (error) {
      request.log.error(error, "Failed to fetch club purchase history");

      if (error instanceof Error) {
        if (error.message === "Club not found.") {
          return reply.status(404).send({ error: error.message });
        }

        if (
          error.message === "Actor player not found." ||
          error.message === "Actor player does not belong to this club."
        ) {
          return reply.status(403).send({ error: error.message });
        }
      }

      throw new Error(error);
    }
  });

  fastify.get("/clubs/:clubId/item-transfers", async (request, reply) => {
    const getClubItemTransfersParamsSchema = z.object({
      clubId: z.uuid(),
    });

    const { clubId } = getClubItemTransfersParamsSchema.parse(request.params);
    const session = request.authSession!;

    try {
      const transferHistory = await getClubItemTransferHistory({
        userId: session.user.id,
        clubId,
      });

      return reply.status(200).send(transferHistory);
    } catch (error) {
      request.log.error(error, "Failed to fetch club item transfer history");

      if (error instanceof Error) {
        if (error.message === "Club not found.") {
          return reply.status(404).send({ error: error.message });
        }

        if (
          error.message === "Actor player not found." ||
          error.message === "Actor player does not belong to this club."
        ) {
          return reply.status(403).send({ error: error.message });
        }
      }

      throw new Error(error);
    }
  });

  fastify.post("/clubs/:clubId/items/purchase", async (request, reply) => {
    const buyClubItemParamsSchema = z.object({
      clubId: z.uuid(),
    });

    const buyClubItemBodySchema = z.object({
      storeItemId: z.uuid(),
      quantity: z.number().int().positive(),
    });

    const { clubId } = buyClubItemParamsSchema.parse(request.params);
    const { storeItemId, quantity } = buyClubItemBodySchema.parse(request.body);
    const session = request.authSession!;

    try {
      const purchase = await buyClubStoreItemWithCoins({
        userId: session.user.id,
        clubId,
        storeItemId,
        quantity,
      });

      return reply.status(200).send(purchase);
    } catch (error) {
      request.log.error(error, "Failed to buy club item with coins");

      if (error instanceof Error) {
        if (error.message === "Store item not found." || error.message === "Club not found.") {
          return reply.status(404).send({ error: error.message });
        }

        if (
          error.message === "Actor player not found." ||
          error.message === "Actor player does not belong to this club." ||
          error.message === "Actor does not have permission to manage club economy." ||
          error.message === "Actor does not have permission to manage VIP items."
        ) {
          return reply.status(403).send({ error: error.message });
        }

        if (
          error.message === "Store item cannot be purchased with club coins." ||
          error.message === "Store item does not have a coin price." ||
          error.message === "Club does not have enough coins." ||
          error.message === "Unable to complete club item purchase."
        ) {
          return reply.status(400).send({ error: error.message });
        }
      }

      throw new Error(error);
    }
  });
};
