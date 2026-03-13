import { getClubCoinsById } from "@/repositories/clubRepository";
import { assertClubManagementAccess } from "@/services/clubAccess";

export interface GetClubCoinsParams {
  userId: string;
  clubId: string;
}

export async function getClubCoins({ userId, clubId }: GetClubCoinsParams) {
  await assertClubManagementAccess({
    userId,
    clubId,
  });

  const club = await getClubCoinsById(clubId);

  if (!club) {
    throw new Error("Club not found.");
  }

  return {
    coins: club.coins,
  };
}
