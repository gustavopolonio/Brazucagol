import { and, asc, eq } from "drizzle-orm";
import { competitions, leagueDivisions, matches } from "@/db/schema";
import { db } from "@/lib/drizzle";

export async function getLeagueById(leagueId: string) {
  const league = await db.query.competitions.findFirst({
    where: and(eq(competitions.id, leagueId), eq(competitions.type, "league")),
  });

  return league;
}

export async function getLeagueMatches(leagueId: string, divisionNumber: number) {
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
