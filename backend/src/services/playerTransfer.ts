import { db } from "@/lib/drizzle";
import {
  createClubMembership,
  getPlayerActiveClubMembershipForUpdate,
  markPlayerLeftClub,
} from "@/repositories/clubMembersRepository";
import {
  listPendingClubTransferProposalsByTargetPlayerIdForUpdate,
  resolveClubTransferProposal,
} from "@/repositories/clubTransferProposalsRepository";
import { getClubByIdForUpdate } from "@/repositories/clubRepository";
import {
  decrementPlayerItemQuantity,
  getPlayerOwnedItemByTypeForUpdate,
  upsertPlayerItemQuantityIncrease,
} from "@/repositories/playerItemsRepository";
import { getPlayerIdByUserId } from "@/repositories/playerRepository";
import { createAndDeliverNotification } from "@/services/notification";

const TRANSFER_PASS_ITEM_TYPE = "transfer_pass";

export interface UseTransferPassToJoinClubParams {
  userId: string;
  destinationClubId: string;
}

type PlayerTransferResult = {
  playerId: string;
  previousClubId: string;
  destinationClubId: string;
};

export async function useTransferPassToJoinClub({
  userId,
  destinationClubId,
}: UseTransferPassToJoinClubParams): Promise<PlayerTransferResult> {
  const transactionResult = await db.transaction(async (transaction) => {
    const player = await getPlayerIdByUserId({
      db: transaction,
      userId,
    });

    if (!player) {
      throw new Error("Player not found.");
    }

    const transferPassItem = await getPlayerOwnedItemByTypeForUpdate({
      db: transaction,
      playerId: player.id,
      itemType: TRANSFER_PASS_ITEM_TYPE,
    });

    if (!transferPassItem) {
      throw new Error("Player does not have enough transfer pass items.");
    }

    const playerClubMembership = await getPlayerActiveClubMembershipForUpdate({
      db: transaction,
      playerId: player.id,
    });

    if (!playerClubMembership) {
      throw new Error("Player does not belong to any club.");
    }

    if (playerClubMembership.clubId === destinationClubId) {
      throw new Error("Player already belongs to destination club.");
    }

    const destinationClub = await getClubByIdForUpdate({
      db: transaction,
      clubId: destinationClubId,
    });

    if (!destinationClub) {
      throw new Error("Destination club not found.");
    }

    const lockedPendingTransferProposals =
      await listPendingClubTransferProposalsByTargetPlayerIdForUpdate({
        db: transaction,
        targetPlayerId: player.id,
      });

    const consumedTransferPass = await decrementPlayerItemQuantity({
      db: transaction,
      playerId: player.id,
      itemId: transferPassItem.itemId,
      quantityToDecrease: 1,
    });

    if (!consumedTransferPass) {
      throw new Error("Unable to consume transfer pass item.");
    }

    const currentDate = new Date();
    const removedClubMembership = await markPlayerLeftClub({
      db: transaction,
      playerId: player.id,
      clubId: playerClubMembership.clubId,
      leftAt: currentDate,
    });

    if (!removedClubMembership) {
      throw new Error("Unable to leave current club.");
    }

    await createClubMembership({
      db: transaction,
      playerId: player.id,
      clubId: destinationClubId,
      role: "player",
    });

    const deniedPendingProposals: Array<{
      proposalId: string;
      actorPlayerId: string;
      transferPassItemId: string;
    }> = [];

    for (const pendingProposal of lockedPendingTransferProposals) {
      await upsertPlayerItemQuantityIncrease({
        db: transaction,
        playerId: pendingProposal.actorPlayerId,
        itemId: pendingProposal.transferPassItemId,
        quantityToIncrease: 1,
      });

      const deniedProposal = await resolveClubTransferProposal({
        db: transaction,
        proposalId: pendingProposal.id,
        status: "denied",
        resolvedAt: currentDate,
      });

      if (!deniedProposal) {
        throw new Error("Unable to resolve competing transfer proposal as denied.");
      }

      deniedPendingProposals.push({
        proposalId: pendingProposal.id,
        actorPlayerId: pendingProposal.actorPlayerId,
        transferPassItemId: pendingProposal.transferPassItemId,
      });
    }

    console.log(
      `[player_transfer] use_transfer_pass_to_join_club playerId=${player.id} previousClubId=${playerClubMembership.clubId} destinationClubId=${destinationClubId} transferPassItemId=${transferPassItem.itemId} deniedPendingProposalsCount=${deniedPendingProposals.length}`
    );

    return {
      playerId: player.id,
      previousClubId: playerClubMembership.clubId,
      destinationClubId,
      deniedPendingProposals,
    };
  });

  await Promise.all(
    transactionResult.deniedPendingProposals.flatMap((deniedProposal) => [
      createAndDeliverNotification({
        playerId: deniedProposal.actorPlayerId,
        type: "transfer_pass_received",
        payload: {
          itemId: deniedProposal.transferPassItemId,
          quantity: 1,
          reason: "transfer_proposal_denied_target_self_transferred",
          proposalId: deniedProposal.proposalId,
          destinationClubId: transactionResult.destinationClubId,
        },
      }),
      createAndDeliverNotification({
        playerId: deniedProposal.actorPlayerId,
        type: "transfer_proposal_denied",
        payload: {
          proposalId: deniedProposal.proposalId,
          targetPlayerId: transactionResult.playerId,
          reason: "target_player_self_transferred",
          destinationClubId: transactionResult.destinationClubId,
        },
      }),
    ])
  );

  return {
    playerId: transactionResult.playerId,
    previousClubId: transactionResult.previousClubId,
    destinationClubId: transactionResult.destinationClubId,
  };
}
