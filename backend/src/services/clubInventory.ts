import { listClubInventoryItemsByClubId } from "@/repositories/clubItemsRepository";
import { assertClubManagementAccess } from "@/services/clubAccess";
import { db } from "@/lib/drizzle";

export interface GetClubInventoryParams {
  userId: string;
  clubId: string;
}

export async function getClubInventory({ userId, clubId }: GetClubInventoryParams) {
  await assertClubManagementAccess({
    userId,
    clubId,
  });

  const items = await listClubInventoryItemsByClubId({
    db,
    clubId,
  });

  return {
    items,
  };
}
