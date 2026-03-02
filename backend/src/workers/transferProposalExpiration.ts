import { env } from "@/env";
import { db } from "@/lib/drizzle";
import {
  getClubTransferProposalByIdForUpdate,
  listExpiredPendingClubTransferProposals,
  resolveClubTransferProposal,
} from "@/repositories/clubTransferProposalsRepository";
import { upsertPlayerItemQuantityIncrease } from "@/repositories/playerItemsRepository";
import { getPlayerById } from "@/repositories/playerRepository";
import { createNotification } from "@/services/notification";

async function expireTransferProposal(proposalId: string): Promise<void> {
  const transactionResult = await db.transaction(async (transaction) => {
    const proposal = await getClubTransferProposalByIdForUpdate({
      db: transaction,
      proposalId,
    });

    if (!proposal) {
      return null;
    }

    if (proposal.status !== "pending" || proposal.resolvedAt !== null) {
      return null;
    }

    const currentDate = new Date();
    if (proposal.expiresAt.getTime() >= currentDate.getTime()) {
      return null;
    }

    const actorPlayer = await getPlayerById({
      db: transaction,
      playerId: proposal.actorPlayerId,
    });

    if (!actorPlayer) {
      console.warn(
        `[transfer_proposal] skip_expiration_missing_actor proposalId=${proposal.id} actorPlayerId=${proposal.actorPlayerId}`
      );
      return null;
    }

    await upsertPlayerItemQuantityIncrease({
      db: transaction,
      playerId: proposal.actorPlayerId,
      itemId: proposal.transferPassItemId,
      quantityToIncrease: 1,
    });

    const resolvedProposal = await resolveClubTransferProposal({
      db: transaction,
      proposalId: proposal.id,
      status: "expired",
      resolvedAt: currentDate,
    });

    if (!resolvedProposal) {
      throw new Error("Unable to resolve transfer proposal as expired.");
    }

    console.log(
      `[transfer_proposal] expired proposalId=${proposal.id} actorPlayerId=${proposal.actorPlayerId} targetPlayerId=${proposal.targetPlayerId}`
    );

    return {
      proposalId: proposal.id,
      actorPlayerId: proposal.actorPlayerId,
      targetPlayerId: proposal.targetPlayerId,
      transferPassItemId: proposal.transferPassItemId,
    };
  });

  if (!transactionResult) {
    return;
  }

  await createNotification({
    playerId: transactionResult.actorPlayerId,
    type: "transfer_pass_received",
    payload: {
      itemId: transactionResult.transferPassItemId,
      quantity: 1,
      reason: "transfer_proposal_expired",
      proposalId: transactionResult.proposalId,
    },
  });

  await createNotification({
    playerId: transactionResult.actorPlayerId,
    type: "transfer_proposal_denied",
    payload: {
      proposalId: transactionResult.proposalId,
      targetPlayerId: transactionResult.targetPlayerId,
      reason: "expired",
    },
  });
}

export async function runTransferProposalExpirationWorkerOnce(): Promise<void> {
  const currentDate = new Date();
  const expiredPendingProposals = await listExpiredPendingClubTransferProposals({
    db,
    currentDate,
  });

  for (const expiredPendingProposal of expiredPendingProposals) {
    try {
      await expireTransferProposal(expiredPendingProposal.id);
    } catch (error) {
      console.error(
        `[transfer_proposal] expiration failed proposalId=${expiredPendingProposal.id}`,
        error
      );
    }
  }
}

interface StartTransferProposalExpirationWorkerProps {
  intervalMilliseconds?: number;
}

export function startTransferProposalExpirationWorker({
  intervalMilliseconds = env.TRANSFER_PROPOSAL_EXPIRATION_WORKER_INTERVAL_MS,
}: StartTransferProposalExpirationWorkerProps = {}) {
  const runTick = async () => {
    try {
      await runTransferProposalExpirationWorkerOnce();
    } catch (error) {
      console.error("[transfer_proposal] expiration worker tick failed", error);
    }
  };

  void runTick();

  return setInterval(() => {
    void runTick();
  }, intervalMilliseconds);
}

startTransferProposalExpirationWorker();
