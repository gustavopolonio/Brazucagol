import { db } from "@/lib/drizzle";
import { seasons } from "@/db/schema";

type CreateSeasonOptions = {
  startsAt?: Date;
  endsAt?: Date;
};

export async function createSeason(seasonName: string, options: CreateSeasonOptions = {}) {
  console.log("Creating season...");

  const [season] = await db
    .insert(seasons)
    .values({
      name: seasonName,
      startsAt: options.startsAt,
      endsAt: options.endsAt,
    })
    .returning();

  console.log(`
    Season created:
    id: ${season.id}
    name: ${season.name}
  `);

  return season;
}
