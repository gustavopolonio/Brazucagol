import { inArray } from "drizzle-orm";
import { clubs } from "@/db/schema";
import { db } from "@/lib/drizzle";

export async function getClubsByIds(clubIds: string[]) {
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
