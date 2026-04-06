import { listPendingIncomingClubTransferProposalsByTargetPlayerId } from "@/repositories/clubTransferProposalsRepository";
import { getPlayerIdByUserId } from "@/repositories/playerRepository";
import { db } from "@/lib/drizzle";

export interface GetLoggedPlayerPendingIncomingTransferProposalsParams {
  userId: string;
}

export async function getLoggedPlayerPendingIncomingTransferProposals({
  userId,
}: GetLoggedPlayerPendingIncomingTransferProposalsParams) {
  const player = await getPlayerIdByUserId({
    db,
    userId,
  });

  if (!player) {
    throw new Error("Player not found.");
  }

  const proposals = await listPendingIncomingClubTransferProposalsByTargetPlayerId({
    db,
    targetPlayerId: player.id,
    currentDate: new Date(),
  });

  return {
    proposals,
  };
}
