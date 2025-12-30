import { and, asc, desc, eq } from "drizzle-orm";
import { clubs, leagueDivisions, leagueStandings } from "@/db/schema";
import { db } from "@/lib/drizzle";

export async function getLeagueDivisionStandings(leagueId: string, divisionNumber: number) {
  const standings = await db
    .select({
      points: leagueStandings.points,
      matchesPlayed: leagueStandings.matchesPlayed,
      wins: leagueStandings.wins,
      draws: leagueStandings.draws,
      defeats: leagueStandings.defeats,
      goalsFor: leagueStandings.goalsFor,
      goalsAgainst: leagueStandings.goalsAgainst,
      clubId: clubs.id,
      clubName: clubs.name,
      clubLogoUrl: clubs.logoUrl,
    })
    .from(leagueStandings)
    .innerJoin(clubs, eq(leagueStandings.clubId, clubs.id))
    .innerJoin(leagueDivisions, eq(leagueStandings.divisionId, leagueDivisions.id))
    .where(
      and(
        eq(leagueStandings.competitionId, leagueId),
        eq(leagueDivisions.divisionNumber, divisionNumber)
      )
    )
    .orderBy(
      desc(leagueStandings.points),
      desc(leagueStandings.wins),
      desc(leagueStandings.goalsFor),
      asc(leagueStandings.goalsAgainst)
    );

  return standings;
}
