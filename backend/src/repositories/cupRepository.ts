import { and, asc, desc, eq } from "drizzle-orm";
import { cupRounds, matches, type CupRound, type Match } from "@/db/schema";
import { db } from "@/lib/drizzle";

export type CupMatchRow = Pick<
  Match,
  | "id"
  | "cupRoundId"
  | "homeFromMatchId"
  | "awayFromMatchId"
  | "winnerClubId"
  | "status"
  | "date"
  | "homeGoals"
  | "awayGoals"
> & {
  homeClubId: Match["clubHomeId"];
  awayClubId: Match["clubAwayId"];
  roundName: CupRound["name"];
  roundSlug: CupRound["slug"];
  roundStage: CupRound["stage"];
  roundTotalClubs: CupRound["totalClubs"];
};

export async function getCupMatches(cupId: string): Promise<CupMatchRow[]> {
  const cupMatches = await db
    .select({
      id: matches.id,
      cupRoundId: matches.cupRoundId,
      homeClubId: matches.clubHomeId,
      awayClubId: matches.clubAwayId,
      homeFromMatchId: matches.homeFromMatchId,
      awayFromMatchId: matches.awayFromMatchId,
      winnerClubId: matches.winnerClubId,
      status: matches.status,
      date: matches.date,
      homeGoals: matches.homeGoals,
      awayGoals: matches.awayGoals,
      roundName: cupRounds.name,
      roundSlug: cupRounds.slug,
      roundStage: cupRounds.stage,
      roundTotalClubs: cupRounds.totalClubs,
    })
    .from(matches)
    .innerJoin(cupRounds, eq(matches.cupRoundId, cupRounds.id))
    .where(and(eq(matches.competitionId, cupId), eq(matches.type, "cup")))
    .orderBy(desc(cupRounds.stage), asc(matches.createdAt));

  return cupMatches;
}
