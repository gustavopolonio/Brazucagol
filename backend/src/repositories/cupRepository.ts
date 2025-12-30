import { and, asc, desc, eq } from "drizzle-orm";
import { cupRounds, matches } from "@/db/schema";
import { db } from "@/lib/drizzle";

export async function getCupMatches(cupId: string) {
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
