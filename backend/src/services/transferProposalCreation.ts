import { getPlayerIdByUserId } from "@/repositories/playerRepository";
import { createTransferProposal } from "@/services/clubTransfer";
import { db } from "@/lib/drizzle";

export interface CreateTransferProposalForUserParams {
  userId: string;
  targetPlayerId: string;
  transferPassItemId: string;
}

export async function createTransferProposalForUser({
  userId,
  targetPlayerId,
  transferPassItemId,
}: CreateTransferProposalForUserParams) {
  const actorPlayer = await getPlayerIdByUserId({
    db,
    userId,
  });

  if (!actorPlayer) {
    throw new Error("Actor player not found.");
  }

  return createTransferProposal({
    actorPlayerId: actorPlayer.id,
    targetPlayerId,
    transferPassItemId,
  });
}
