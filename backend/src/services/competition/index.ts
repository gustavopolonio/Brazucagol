import { eq } from "drizzle-orm";
import { Transaction } from "@/lib/drizzle";
import { competitions, seasons } from "@/db/schema";

interface CreateCompetitionProps {
  db: Transaction,
  seasonId: string,
  competitionName: string,
  competitionType: typeof competitions.$inferInsert["type"],
}

export async function createCompetition({
  db,
  seasonId,
  competitionName,
  competitionType,
}: CreateCompetitionProps) {
  console.log(`Creating ${competitionType} competition...`);

  const [season] = await db
    .select()
    .from(seasons)
    .where(eq(seasons.id, seasonId));

  if (!season) throw new Error(`Season not found. Season id: ${seasonId}`);

  const [competition] = await db
    .insert(competitions)
    .values({
      seasonId,
      name: competitionName,
      type: competitionType,
    })
    .returning();

  console.log(`
    ${competitionType} competition created
    id: ${competition.id}
    name: ${competition.name}  
  `);

  return competition;
}
