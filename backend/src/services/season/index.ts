import { db } from "@/lib/drizzle";
import { seasons } from "@/db/schema";

export async function createSeason(seasonName: string) {
  console.log("Creating season...");

  const [season] = await db
    .insert(seasons)
    .values({
      name: seasonName,
    })
    .returning();

  console.log(`
    Season created:
    id: ${season.id}
    name: ${season.name}
  `);

  return season;
}
