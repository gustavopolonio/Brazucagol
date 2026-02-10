import { db } from "@/lib/drizzle";
import {
  createClubMembership,
  getPlayerActiveClubMembershipForUpdate,
  markPlayerLeftClub,
  type ClubRoleValue,
} from "@/repositories/clubMembersRepository";
import {
  createClubTransferProposal,
  getClubTransferProposalByIdForUpdate,
  resolveClubTransferProposal,
} from "@/repositories/clubTransferProposalsRepository";
import {
  decrementPlayerItemQuantity,
  getPlayerItemQuantityForUpdate,
  upsertPlayerItemQuantityIncrease,
} from "@/repositories/playerItemsRepository";
import { getStoreItemById } from "@/repositories/storeItemsRepository";

const TRANSFER_PROPOSAL_EXPIRATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
const TRANSFER_PASS_ITEM_TYPE = "transfer_pass";
const CLUB_TRANSFER_MANAGER_ROLES: ClubRoleValue[] = ["president", "vice_president", "director"];

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
  if (!CLUB_TRANSFER_MANAGER_ROLES.includes(actorRole)) {
    throw new Error("Actor does not have permission to propose transfers.");
  }
}

function resolveProposalExpirationDate(currentDate: Date): Date {
  return new Date(currentDate.getTime() + TRANSFER_PROPOSAL_EXPIRATION_MS);
}

export async function createTransferProposal({
  actorPlayerId,
  targetPlayerId,
  transferPassItemId,
}: CreateTransferProposalParams): Promise<ClubTransferResult> {
  return db.transaction(async (transaction) => {
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
    };
  });
}

export async function acceptTransferProposal({
  proposalId,
  targetPlayerId,
}: AcceptTransferProposalParams): Promise<ClubTransferResult> {
  return db.transaction(async (transaction) => {
    const proposal = await getClubTransferProposalByIdForUpdate({
      db: transaction,
      proposalId,
    });

    if (!proposal) {
      throw new Error("Transfer proposal not found.");
    }

    if (proposal.targetPlayerId !== targetPlayerId) {
      throw new Error("Only proposal target player can accept this transfer.");
    }

    if (proposal.status !== "pending" || proposal.resolvedAt !== null) {
      throw new Error("Transfer proposal is already resolved.");
    }

    const currentDate = new Date();
    if (currentDate.getTime() > proposal.expiresAt.getTime()) {
      throw new Error("Transfer proposal is expired.");
    }

    const targetClubMembership = await getPlayerActiveClubMembershipForUpdate({
      db: transaction,
      playerId: targetPlayerId,
    });

    if (
      !targetClubMembership ||
      targetClubMembership.clubId !== proposal.targetPlayerCurrentClubId
    ) {
      throw new Error("Target player does not belong to original club anymore.");
    }

    const leftClubMembership = await markPlayerLeftClub({
      db: transaction,
      playerId: targetPlayerId,
      clubId: proposal.targetPlayerCurrentClubId,
      leftAt: currentDate,
    });

    if (!leftClubMembership) {
      throw new Error("Unable to remove target player from original club.");
    }

    await createClubMembership({
      db: transaction,
      playerId: targetPlayerId,
      clubId: proposal.proposerClubId,
      role: "player",
    });

    const resolvedProposal = await resolveClubTransferProposal({
      db: transaction,
      proposalId,
      status: "accepted",
      resolvedAt: currentDate,
    });

    if (!resolvedProposal) {
      throw new Error("Unable to resolve transfer proposal as accepted.");
    }

    console.log(
      `[club_transfer] accept_transfer_proposal proposalId=${proposalId} targetPlayerId=${targetPlayerId} proposerClubId=${proposal.proposerClubId} targetPlayerCurrentClubId=${proposal.targetPlayerCurrentClubId}`
    );

    return {
      proposalId,
    };
  });
}

export async function denyTransferProposal({
  proposalId,
  targetPlayerId,
}: DenyTransferProposalParams): Promise<ClubTransferResult> {
  return db.transaction(async (transaction) => {
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
    };
  });
}
