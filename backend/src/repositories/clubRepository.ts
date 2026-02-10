import { inArray, sql } from "drizzle-orm";
import { clubs, type Club } from "@/db/schema";
import { db } from "@/lib/drizzle";
import { Transaction } from "@/lib/drizzle";

export type ClubPreviewRow = Pick<Club, "id" | "name" | "logoUrl">;
export type ClubCoinsRow = Pick<Club, "id" | "coins">;

export async function getClubsByIds(clubIds: string[]): Promise<ClubPreviewRow[]> {
  const clubsQuery = await db
    .select({
      id: clubs.id,
      name: clubs.name,
      logoUrl: clubs.logoUrl,
    })
    .from(clubs)
    .where(inArray(clubs.id, clubIds));

  return clubsQuery;
}

interface GetClubCoinsForUpdateProps {
  db: Transaction;
  clubId: string;
}

export async function getClubCoinsForUpdate({
  db,
  clubId,
}: GetClubCoinsForUpdateProps): Promise<ClubCoinsRow | null> {
  const result = await db.execute(sql`
    select
      ${clubs.id} as "id",
      ${clubs.coins} as "coins"
    from ${clubs}
    where ${clubs.id} = ${clubId}
      and ${clubs.deletedAt} is null
    limit 1
    for update
  `);

  return (result.rows[0] as ClubCoinsRow | undefined) ?? null;
}

interface DecrementClubCoinsProps {
  db: Transaction;
  clubId: string;
  amount: number;
}

export async function decrementClubCoins({
  db,
  clubId,
  amount,
}: DecrementClubCoinsProps): Promise<ClubCoinsRow | null> {
  const result = await db.execute(sql`
    update ${clubs}
    set ${clubs.coins} = ${clubs.coins} - ${amount}
    where ${clubs.id} = ${clubId}
      and ${clubs.deletedAt} is null
      and ${clubs.coins} >= ${amount}
    returning
      ${clubs.id} as "id",
      ${clubs.coins} as "coins"
  `);

  return (result.rows[0] as ClubCoinsRow | undefined) ?? null;
}
