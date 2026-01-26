import { and, asc, eq } from "drizzle-orm";
import { competitions, leagueDivisions, matches, type Competition, type Match } from "@/db/schema";
import { db } from "@/lib/drizzle";

export type LeagueMatchRow = Pick<
  Match,
  | "id"
  | "competitionId"
  | "divisionId"
  | "leagueRound"
  | "status"
  | "date"
  | "homeGoals"
  | "awayGoals"
> & {
  homeClubId: Match["clubHomeId"];
  awayClubId: Match["clubAwayId"];
};

export async function getLeagueById(leagueId: string): Promise<Competition | undefined> {
  const league = await db.query.competitions.findFirst({
    where: and(eq(competitions.id, leagueId), eq(competitions.type, "league")),
  });

  return league;
}

export async function getLeagueMatches(
  leagueId: string,
  divisionNumber: number
): Promise<LeagueMatchRow[]> {
  const division = await db.query.leagueDivisions.findFirst({
    where: and(
      eq(leagueDivisions.competitionId, leagueId),
      eq(leagueDivisions.divisionNumber, divisionNumber)
    ),
  });

  if (!division) return [];

  const leagueMatches = await db
    .select({
      id: matches.id,
      competitionId: matches.competitionId,
      divisionId: matches.divisionId,
      leagueRound: matches.leagueRound,
      homeClubId: matches.clubHomeId,
      awayClubId: matches.clubAwayId,
      status: matches.status,
      date: matches.date,
      homeGoals: matches.homeGoals,
      awayGoals: matches.awayGoals,
    })
    .from(matches)
    .where(
      and(
        eq(matches.competitionId, leagueId),
        eq(matches.divisionId, division.id),
        eq(matches.type, "league")
      )
    )
    .orderBy(asc(matches.leagueRound), asc(matches.createdAt));

  return leagueMatches;
}
