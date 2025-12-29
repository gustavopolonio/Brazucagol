import { clubs } from "@/db/schema";
import { db } from "@/lib/drizzle";
import { createCompetition } from "@/services/competition";
import { buildFixedCupBracket, persistCupMatches } from "@/services/cup";
import { isNull } from "drizzle-orm";

const SEASON_ID = "c7923b56-212d-45fc-be30-68a85349bfc0";

async function bootstrapCup(seasonId: string) {
  await db.transaction(async (tx) => {
    const cup = await createCompetition({
      db: tx,
      seasonId,
      competitionName: "National Cup - test",
      competitionType: "cup",
    });

    // Get all non deleted clubs
    const clubsList = await tx.select({ id: clubs.id }).from(clubs).where(isNull(clubs.deletedAt));

    const clubIds = clubsList.map((club) => club.id);

    const bracket = buildFixedCupBracket({
      clubIds,
    });

    await persistCupMatches({
      db: tx,
      competitionId: cup.id,
      bracket,
    });
  });
}

bootstrapCup(SEASON_ID)
  .then(() => {
    console.log("Cup Bootstrapped.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Bootstraping cup failed:", error);
    process.exit(1);
  });
