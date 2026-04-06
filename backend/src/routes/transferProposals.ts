import { FastifyInstance } from "fastify";
import { z } from "zod";
import { createTransferProposalForUser } from "@/services/transferProposalCreation";

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
};
