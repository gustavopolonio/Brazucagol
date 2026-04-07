import { FastifyInstance } from "fastify";
import { z } from "zod";
import { createTransferProposalForUser } from "@/services/transferProposalCreation";
import { acceptTransferProposalForUser } from "@/services/transferProposalResolution";

export const protectedTransferProposalRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/transfer-proposals", async (request, reply) => {
    const createTransferProposalBodySchema = z.object({
      targetPlayerId: z.uuid(),
      transferPassItemId: z.uuid(),
    });

    const { targetPlayerId, transferPassItemId } = createTransferProposalBodySchema.parse(
      request.body
    );
    const session = request.authSession!;

    try {
      const proposal = await createTransferProposalForUser({
        userId: session.user.id,
        targetPlayerId,
        transferPassItemId,
      });

      return reply.status(201).send(proposal);
    } catch (error) {
      request.log.error(error, "Failed to create transfer proposal");

      if (error instanceof Error) {
        if (error.message === "Transfer pass item not found.") {
          return reply.status(404).send({ error: error.message });
        }

        if (
          error.message === "Actor player not found." ||
          error.message === "Actor does not have permission to propose transfers."
        ) {
          return reply.status(403).send({ error: error.message });
        }

        if (
          error.message === "Actor player does not belong to any club." ||
          error.message === "Target player does not belong to any club." ||
          error.message === "Actor cannot propose transfer to itself." ||
          error.message === "Actor cannot propose transfer to own club." ||
          error.message === "Provided item is not a transfer pass." ||
          error.message === "Actor does not have enough transfer pass items." ||
          error.message === "Unable to reserve transfer pass item."
        ) {
          return reply.status(400).send({ error: error.message });
        }
      }

      throw new Error(error);
    }
  });

  fastify.post("/transfer-proposals/:proposalId/accept", async (request, reply) => {
    const paramsSchema = z.object({
      proposalId: z.uuid(),
    });

    const { proposalId } = paramsSchema.parse(request.params);
    const session = request.authSession!;

    try {
      const proposal = await acceptTransferProposalForUser({
        userId: session.user.id,
        proposalId,
      });

      return reply.status(200).send(proposal);
    } catch (error) {
      request.log.error(error, "Failed to accept transfer proposal");

      if (error instanceof Error) {
        if (
          error.message === "Player not found." ||
          error.message === "Transfer proposal not found."
        ) {
          return reply.status(404).send({ error: error.message });
        }

        if (error.message === "Only proposal target player can accept this transfer.") {
          return reply.status(403).send({ error: error.message });
        }

        if (
          error.message === "Transfer proposal is already resolved." ||
          error.message === "Transfer proposal is expired." ||
          error.message === "Target player does not belong to original club anymore." ||
          error.message === "Unable to remove target player from original club." ||
          error.message === "Unable to resolve transfer proposal as accepted."
        ) {
          return reply.status(400).send({ error: error.message });
        }
      }

      throw new Error(error);
    }
  });
};
