import { db } from "@/lib/drizzle";
import {
  createClubMembership,
  getPlayerActiveClubMembershipForUpdate,
  markPlayerLeftClub,
} from "@/repositories/clubMembersRepository";
import { getClubByIdForUpdate } from "@/repositories/clubRepository";
import {
  decrementPlayerItemQuantity,
  getPlayerItemQuantityForUpdate,
} from "@/repositories/playerItemsRepository";
import { getStoreItemById } from "@/repositories/storeItemsRepository";

const TRANSFER_PASS_ITEM_TYPE = "transfer_pass";

export interface UseTransferPassToJoinClubParams {
  playerId: string;
  destinationClubId: string;
  transferPassItemId: string;
}

type PlayerTransferResult = {
  playerId: string;
  previousClubId: string;
  destinationClubId: string;
};

export async function useTransferPassToJoinClub({
  playerId,
  destinationClubId,
  transferPassItemId,
}: UseTransferPassToJoinClubParams): Promise<PlayerTransferResult> {
  return db.transaction(async (transaction) => {
    const playerClubMembership = await getPlayerActiveClubMembershipForUpdate({
      db: transaction,
      playerId,
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

    const transferPassQuantity = await getPlayerItemQuantityForUpdate({
      db: transaction,
      playerId,
      itemId: transferPassItemId,
    });

    if (!transferPassQuantity || transferPassQuantity.quantity < 1) {
      throw new Error("Player does not have enough transfer pass items.");
    }

    const consumedTransferPass = await decrementPlayerItemQuantity({
      db: transaction,
      playerId,
      itemId: transferPassItemId,
      quantityToDecrease: 1,
    });

    if (!consumedTransferPass) {
      throw new Error("Unable to consume transfer pass item.");
    }

    const currentDate = new Date();
    const removedClubMembership = await markPlayerLeftClub({
      db: transaction,
      playerId,
      clubId: playerClubMembership.clubId,
      leftAt: currentDate,
    });

    if (!removedClubMembership) {
      throw new Error("Unable to leave current club.");
    }

    await createClubMembership({
      db: transaction,
      playerId,
      clubId: destinationClubId,
      role: "player",
    });

    console.log(
      `[player_transfer] use_transfer_pass_to_join_club playerId=${playerId} previousClubId=${playerClubMembership.clubId} destinationClubId=${destinationClubId} transferPassItemId=${transferPassItemId}`
    );

    return {
      playerId,
      previousClubId: playerClubMembership.clubId,
      destinationClubId,
    };
  });
}
