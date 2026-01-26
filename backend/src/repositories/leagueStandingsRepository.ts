import { and, asc, desc, eq } from "drizzle-orm";
import {
  clubs,
  leagueDivisions,
  leagueStandings,
  type Club,
  type LeagueStanding,
} from "@/db/schema";
import { db } from "@/lib/drizzle";

export type LeagueDivisionStandingRow = Pick<
  LeagueStanding,
  "points" | "matchesPlayed" | "wins" | "draws" | "defeats" | "goalsFor" | "goalsAgainst" | "clubId"
> & {
  clubName: Club["name"];
  clubLogoUrl: Club["logoUrl"];
};

export async function getLeagueDivisionStandings(
  leagueId: string,
  divisionNumber: number
): Promise<LeagueDivisionStandingRow[]> {
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
