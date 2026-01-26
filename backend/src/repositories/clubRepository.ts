import { inArray } from "drizzle-orm";
import { clubs, type Club } from "@/db/schema";
import { db } from "@/lib/drizzle";

export type ClubPreviewRow = Pick<Club, "id" | "name" | "logoUrl">;

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
