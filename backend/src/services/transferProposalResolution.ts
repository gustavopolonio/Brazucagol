import { db } from "@/lib/drizzle";
import { getPlayerIdByUserId } from "@/repositories/playerRepository";
import { acceptTransferProposal } from "@/services/clubTransfer";

export interface AcceptTransferProposalForUserParams {
  userId: string;
  proposalId: string;
}

export async function acceptTransferProposalForUser({
  userId,
  proposalId,
}: AcceptTransferProposalForUserParams) {
  const player = await getPlayerIdByUserId({
    db,
    userId,
  });

  if (!player) {
    throw new Error("Player not found.");
  }

  return acceptTransferProposal({
    proposalId,
    targetPlayerId: player.id,
  });
}
