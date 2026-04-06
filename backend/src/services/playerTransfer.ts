import { db } from "@/lib/drizzle";
import {
  createClubMembership,
  getPlayerActiveClubMembershipForUpdate,
  markPlayerLeftClub,
} from "@/repositories/clubMembersRepository";
import { getClubByIdForUpdate } from "@/repositories/clubRepository";
import {
  decrementPlayerItemQuantity,
  getPlayerOwnedItemByTypeForUpdate,
} from "@/repositories/playerItemsRepository";
import { getPlayerIdByUserId } from "@/repositories/playerRepository";

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
  return db.transaction(async (transaction) => {
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

    console.log(
      `[player_transfer] use_transfer_pass_to_join_club playerId=${player.id} previousClubId=${playerClubMembership.clubId} destinationClubId=${destinationClubId} transferPassItemId=${transferPassItem.itemId}`
    );

    return {
      playerId: player.id,
      previousClubId: playerClubMembership.clubId,
      destinationClubId,
    };
  });
}
