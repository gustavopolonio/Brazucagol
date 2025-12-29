import { db } from "@/lib/drizzle";
import { createCompetition } from "@/services/competition";
import {
  assignClubsToCompetition,
  buildLeagueMatches,
  createLeagueDivisions,
  persistLeagueMatches,
  randomlyBuildInitialLeagueDivisionAssignments,
} from "@/services/league";

const SEASON_ID = "c7923b56-212d-45fc-be30-68a85349bfc0";

async function bootstrapLeague(seasonId: string) {
  console.log("Bootstraping league ...");

  await db.transaction(async (tx) => {
    const league = await createCompetition({
      db: tx,
      seasonId,
      competitionName: "League test 01",
      competitionType: "league",
    });

    await createLeagueDivisions({
      db: tx,
      competitionId: league.id,
      divisions: 3,
    });

    const assignments = await randomlyBuildInitialLeagueDivisionAssignments({
      db: tx,
      competitionId: league.id,
    });

    await assignClubsToCompetition({
      db: tx,
      competitionId: league.id,
      assignments,
    });

    const allLeagueMatches = await buildLeagueMatches({
      db: tx,
      competitionId: league.id,
    });

    await persistLeagueMatches({
      db: tx,
      matchesToPersist: allLeagueMatches,
    });
  });
}

bootstrapLeague(SEASON_ID)
  .then(() => {
    console.log("League Bootstrapped.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Bootstraping league failed:", error);
    process.exit(1);
  });
