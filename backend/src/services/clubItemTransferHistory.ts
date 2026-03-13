import { listClubToPlayerItemTransferHistory } from "@/repositories/itemTransferLogsRepository";
import { assertClubMembershipAccess } from "@/services/clubAccess";
import { db } from "@/lib/drizzle";

export interface GetClubItemTransferHistoryParams {
  userId: string;
  clubId: string;
}

export async function getClubItemTransferHistory({
  userId,
  clubId,
}: GetClubItemTransferHistoryParams) {
  await assertClubMembershipAccess({
    userId,
    clubId,
  });

  const transfers = await listClubToPlayerItemTransferHistory({
    db,
    clubId,
  });

  return {
    transfers,
  };
}
