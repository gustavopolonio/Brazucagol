import { listClubPurchaseHistory } from "@/repositories/itemPurchaseLogsRepository";
import { assertClubMembershipAccess } from "@/services/clubAccess";
import { db } from "@/lib/drizzle";

export interface GetClubPurchaseHistoryParams {
  userId: string;
  clubId: string;
}

export async function getClubPurchaseHistory({ userId, clubId }: GetClubPurchaseHistoryParams) {
  await assertClubMembershipAccess({
    userId,
    clubId,
  });

  const purchases = await listClubPurchaseHistory({
    db,
    clubId,
  });

  return {
    purchases,
  };
}
