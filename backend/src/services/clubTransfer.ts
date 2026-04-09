import { db } from "@/lib/drizzle";
import {
  createClubMembership,
  getPlayerActiveClubMembershipForUpdate,
  markPlayerLeftClub,
  type ClubRoleValue,
} from "@/repositories/clubMembersRepository";
import {
  createClubTransferProposal,
  getClubTransferProposalById,
  getClubTransferProposalByIdForUpdate,
  listPendingClubTransferProposalsByTargetPlayerIdForUpdate,
  resolveClubTransferProposal,
} from "@/repositories/clubTransferProposalsRepository";
import { insertPlayerItemUsageLog } from "@/repositories/itemUsageLogsRepository";
import {
  decrementPlayerItemQuantity,
  getPlayerItemQuantityForUpdate,
  upsertPlayerItemQuantityIncrease,
} from "@/repositories/playerItemsRepository";
import { getStoreItemById } from "@/repositories/storeItemsRepository";
import { assertClubManagementRoleAccess } from "@/services/clubAccess";
import { createAndDeliverNotification } from "@/services/notification";

const TRANSFER_PROPOSAL_EXPIRATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
const TRANSFER_PASS_ITEM_TYPE = "transfer_pass";
const TRANSFER_PROPOSAL_ACCEPTED_USAGE_REASON = "transfer_proposal_accepted";

export interface CreateTransferProposalParams {
  actorPlayerId: string;
  targetPlayerId: string;
  transferPassItemId: string;
}

export interface AcceptTransferProposalParams {
  proposalId: string;
  targetPlayerId: string;
}

export interface DenyTransferProposalParams {
  proposalId: string;
  targetPlayerId: string;
}

type ClubTransferResult = {
  proposalId: string;
};

function assertActorCanProposeTransfer(actorRole: ClubRoleValue): void {
  assertClubManagementRoleAccess(actorRole, "Actor does not have permission to propose transfers.");
}

function resolveProposalExpirationDate(currentDate: Date): Date {
  return new Date(currentDate.getTime() + TRANSFER_PROPOSAL_EXPIRATION_MS);
}

export async function createTransferProposal({
  actorPlayerId,
  targetPlayerId,
  transferPassItemId,
}: CreateTransferProposalParams): Promise<ClubTransferResult> {
  const transactionResult = await db.transaction(async (transaction) => {
    const actorClubMembership = await getPlayerActiveClubMembershipForUpdate({
      db: transaction,
      playerId: actorPlayerId,
    });

    if (!actorClubMembership) {
      throw new Error("Actor player does not belong to any club.");
    }

    assertActorCanProposeTransfer(actorClubMembership.role);

    const targetClubMembership = await getPlayerActiveClubMembershipForUpdate({
      db: transaction,
      playerId: targetPlayerId,
    });

    if (!targetClubMembership) {
      throw new Error("Target player does not belong to any club.");
    }

    if (actorPlayerId === targetPlayerId) {
      throw new Error("Actor cannot propose transfer to itself.");
    }

    if (actorClubMembership.clubId === targetClubMembership.clubId) {
      throw new Error("Actor cannot propose transfer to own club.");
    }

    const transferPassItem = await getStoreItemById({
      db: transaction,
      storeItemId: transferPassItemId,
    });

    if (!transferPassItem) {
      throw new Error("Transfer pass item not found.");
    }

    if (transferPassItem.type !== TRANSFER_PASS_ITEM_TYPE) {
      throw new Error("Provided item is not a transfer pass.");
    }

    const actorTransferPass = await getPlayerItemQuantityForUpdate({
      db: transaction,
      playerId: actorPlayerId,
      itemId: transferPassItemId,
    });

    if (!actorTransferPass || actorTransferPass.quantity < 1) {
      throw new Error("Actor does not have enough transfer pass items.");
    }

    const reservedTransferPass = await decrementPlayerItemQuantity({
      db: transaction,
      playerId: actorPlayerId,
      itemId: transferPassItemId,
      quantityToDecrease: 1,
    });

    if (!reservedTransferPass) {
      throw new Error("Unable to reserve transfer pass item.");
    }

    const currentDate = new Date();
    const proposalExpiresAt = resolveProposalExpirationDate(currentDate);
    const proposal = await createClubTransferProposal({
      db: transaction,
      proposerClubId: actorClubMembership.clubId,
      targetPlayerCurrentClubId: targetClubMembership.clubId,
      actorPlayerId,
      targetPlayerId,
      transferPassItemId,
      expiresAt: proposalExpiresAt,
    });

    console.log(
      `[club_transfer] create_transfer_proposal proposalId=${proposal.id} actorPlayerId=${actorPlayerId} targetPlayerId=${targetPlayerId} proposerClubId=${actorClubMembership.clubId} targetPlayerCurrentClubId=${targetClubMembership.clubId} transferPassItemId=${transferPassItemId}`
    );

    return {
      proposalId: proposal.id,
      targetPlayerId,
      actorPlayerId,
      proposerClubId: actorClubMembership.clubId,
      proposalExpiresAt,
    };
  });

  await createAndDeliverNotification({
    playerId: transactionResult.targetPlayerId,
    type: "transfer_proposal_received",
    payload: {
      proposalId: transactionResult.proposalId,
      fromClubId: transactionResult.proposerClubId,
      expiresAt: transactionResult.proposalExpiresAt,
      actorPlayerId: transactionResult.actorPlayerId,
    },
  });

  return {
    proposalId: transactionResult.proposalId,
  };
}

export async function acceptTransferProposal({
  proposalId,
  targetPlayerId,
}: AcceptTransferProposalParams): Promise<ClubTransferResult> {
  const existingProposal = await getClubTransferProposalById({
    db,
    proposalId,
  });

  if (!existingProposal) {
    throw new Error("Transfer proposal not found.");
  }

  if (existingProposal.targetPlayerId !== targetPlayerId) {
    throw new Error("Only proposal target player can accept this transfer.");
  }

  const transactionResult = await db.transaction(async (transaction) => {
    const currentDate = new Date();
    if (currentDate.getTime() > existingProposal.expiresAt.getTime()) {
      throw new Error("Transfer proposal is expired.");
    }

    const targetClubMembership = await getPlayerActiveClubMembershipForUpdate({
      db: transaction,
      playerId: targetPlayerId,
    });

    if (
      !targetClubMembership ||
      targetClubMembership.clubId !== existingProposal.targetPlayerCurrentClubId
    ) {
      throw new Error("Target player does not belong to original club anymore.");
    }

    const lockedPendingTargetProposals =
      await listPendingClubTransferProposalsByTargetPlayerIdForUpdate({
        db: transaction,
        targetPlayerId,
      });

    const selectedProposal = lockedPendingTargetProposals.find(
      (pendingProposal) => pendingProposal.id === proposalId
    );

    if (!selectedProposal) {
      throw new Error("Transfer proposal is already resolved.");
    }

    const leftClubMembership = await markPlayerLeftClub({
      db: transaction,
      playerId: targetPlayerId,
      clubId: existingProposal.targetPlayerCurrentClubId,
      leftAt: currentDate,
    });

    if (!leftClubMembership) {
      throw new Error("Unable to remove target player from original club.");
    }

    await createClubMembership({
      db: transaction,
      playerId: targetPlayerId,
      clubId: selectedProposal.proposerClubId,
      role: "player",
    });

    const acceptedProposal = await resolveClubTransferProposal({
      db: transaction,
      proposalId,
      status: "accepted",
      resolvedAt: currentDate,
    });

    if (!acceptedProposal) {
      throw new Error("Unable to resolve transfer proposal as accepted.");
    }

    await insertPlayerItemUsageLog({
      db: transaction,
      itemId: selectedProposal.transferPassItemId,
      playerId: selectedProposal.actorPlayerId,
      quantityUsed: 1,
      reason: TRANSFER_PROPOSAL_ACCEPTED_USAGE_REASON,
    });

    const deniedCompetingProposals: Array<{
      proposalId: string;
      actorPlayerId: string;
      transferPassItemId: string;
    }> = [];

    for (const competingProposal of lockedPendingTargetProposals) {
      if (competingProposal.id === proposalId) {
        continue;
      }

      await upsertPlayerItemQuantityIncrease({
        db: transaction,
        playerId: competingProposal.actorPlayerId,
        itemId: competingProposal.transferPassItemId,
        quantityToIncrease: 1,
      });

      const deniedProposal = await resolveClubTransferProposal({
        db: transaction,
        proposalId: competingProposal.id,
        status: "denied",
        resolvedAt: currentDate,
      });

      if (!deniedProposal) {
        throw new Error("Unable to resolve competing transfer proposal as denied.");
      }

      deniedCompetingProposals.push({
        proposalId: competingProposal.id,
        actorPlayerId: competingProposal.actorPlayerId,
        transferPassItemId: competingProposal.transferPassItemId,
      });
    }

    console.log(
      `[club_transfer] accept_transfer_proposal proposalId=${proposalId} targetPlayerId=${targetPlayerId} proposerClubId=${selectedProposal.proposerClubId} targetPlayerCurrentClubId=${selectedProposal.targetPlayerCurrentClubId} deniedCompetingProposalsCount=${deniedCompetingProposals.length}`
    );

    return {
      proposalId,
      actorPlayerId: selectedProposal.actorPlayerId,
      targetPlayerId,
      previousClubId: selectedProposal.targetPlayerCurrentClubId,
      newClubId: selectedProposal.proposerClubId,
      deniedCompetingProposals,
    };
  });

  await createAndDeliverNotification({
    playerId: transactionResult.actorPlayerId,
    type: "transfer_proposal_accepted",
    payload: {
      proposalId: transactionResult.proposalId,
      targetPlayerId: transactionResult.targetPlayerId,
    },
  });

  await createAndDeliverNotification({
    playerId: transactionResult.targetPlayerId,
    type: "system",
    payload: {
      message: "Transfer proposal accepted.",
      proposalId: transactionResult.proposalId,
      previousClubId: transactionResult.previousClubId,
      newClubId: transactionResult.newClubId,
    },
  });

  await Promise.all(
    transactionResult.deniedCompetingProposals.flatMap((deniedProposal) => [
      createAndDeliverNotification({
        playerId: deniedProposal.actorPlayerId,
        type: "transfer_pass_received",
        payload: {
          itemId: deniedProposal.transferPassItemId,
          quantity: 1,
          reason: "transfer_proposal_denied_other_accepted",
          proposalId: deniedProposal.proposalId,
          acceptedProposalId: transactionResult.proposalId,
        },
      }),
      createAndDeliverNotification({
        playerId: deniedProposal.actorPlayerId,
        type: "transfer_proposal_denied",
        payload: {
          proposalId: deniedProposal.proposalId,
          targetPlayerId: transactionResult.targetPlayerId,
          reason: "another_proposal_accepted",
          acceptedProposalId: transactionResult.proposalId,
        },
      }),
    ])
  );

  return {
    proposalId: transactionResult.proposalId,
  };
}

export async function denyTransferProposal({
  proposalId,
  targetPlayerId,
}: DenyTransferProposalParams): Promise<ClubTransferResult> {
  const transactionResult = await db.transaction(async (transaction) => {
    const proposal = await getClubTransferProposalByIdForUpdate({
      db: transaction,
      proposalId,
    });

    if (!proposal) {
      throw new Error("Transfer proposal not found.");
    }

    if (proposal.targetPlayerId !== targetPlayerId) {
      throw new Error("Only proposal target player can deny this transfer.");
    }

    if (proposal.status !== "pending" || proposal.resolvedAt !== null) {
      throw new Error("Transfer proposal is already resolved.");
    }

    await upsertPlayerItemQuantityIncrease({
      db: transaction,
      playerId: proposal.actorPlayerId,
      itemId: proposal.transferPassItemId,
      quantityToIncrease: 1,
    });

    const currentDate = new Date();
    const resolvedProposal = await resolveClubTransferProposal({
      db: transaction,
      proposalId,
      status: "denied",
      resolvedAt: currentDate,
    });

    if (!resolvedProposal) {
      throw new Error("Unable to resolve transfer proposal as denied.");
    }

    console.log(
      `[club_transfer] deny_transfer_proposal proposalId=${proposalId} targetPlayerId=${targetPlayerId} actorPlayerId=${proposal.actorPlayerId}`
    );

    return {
      proposalId,
      actorPlayerId: proposal.actorPlayerId,
      targetPlayerId,
      transferPassItemId: proposal.transferPassItemId,
    };
  });

  await createAndDeliverNotification({
    playerId: transactionResult.actorPlayerId,
    type: "transfer_pass_received",
    payload: {
      itemId: transactionResult.transferPassItemId,
      quantity: 1,
      reason: "transfer_proposal_denied",
      proposalId: transactionResult.proposalId,
    },
  });

  await createAndDeliverNotification({
    playerId: transactionResult.actorPlayerId,
    type: "transfer_proposal_denied",
    payload: {
      proposalId: transactionResult.proposalId,
      targetPlayerId: transactionResult.targetPlayerId,
      reason: "denied",
    },
  });

  return {
    proposalId: transactionResult.proposalId,
  };
}
