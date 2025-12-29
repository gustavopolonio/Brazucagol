import { eq } from "drizzle-orm";
import { Transaction } from "@/lib/drizzle";
import { matches, cupRounds } from "@/db/schema";
import { nearestPowerOfTwoCeil } from "@/utils";

type BracketMatch = {
  clubHomeId?: string; // club id (uuid)
  clubAwayId?: string; // club id (uuid)
  homeFromMatchIndex?: number; // match index (it insn't the value to be persisted on DB yet)
  awayFromMatchIndex?: number; // match index (it insn't the value to be persisted on DB yet)
};

type BracketRound = {
  totalClubs: number;
  matches: BracketMatch[];
};

type CupBracket = {
  rounds: BracketRound[];
};

interface BuildFixedCupBracketProps {
  clubIds: string[];
}

export function buildFixedCupBracket({ clubIds }: BuildFixedCupBracketProps): CupBracket {
  console.log("Building fixed cup bracket...");

  const totalClubs = clubIds.length;

  if (totalClubs < 2) throw new Error("At least 2 clubs are required to build a cup bracket");

  // Cup needs power of two clubs total
  const totalClubsTargetSize = nearestPowerOfTwoCeil(totalClubs);
  // byes: clubs that won't play first round
  const byes = totalClubsTargetSize - totalClubs;

  const rounds: BracketRound[] = [];

  // --------------------
  // FIRST ROUND (may include byes)
  // --------------------

  const byeClubs = clubIds.slice(0, byes);
  const clubsToPlayFirstRound = clubIds.slice(byes);
  const firstRoundMatches: BracketMatch[] = [];

  // Matches with known clubs
  for (let clubIndex = 0; clubIndex < clubsToPlayFirstRound.length; clubIndex += 2) {
    firstRoundMatches.push({
      clubHomeId: clubsToPlayFirstRound[clubIndex],
      clubAwayId: clubsToPlayFirstRound[clubIndex + 1],
    });
  }

  rounds.push({
    totalClubs: totalClubsTargetSize,
    matches: firstRoundMatches,
  });

  // --------------------
  // NEXT ROUNDS (matches with unknown clubs yet)
  // --------------------

  let previousRoundMatchesCount = firstRoundMatches.length;
  let currentParticipantsCount = previousRoundMatchesCount + byes;
  let previousRoundIndex = 0;

  while (currentParticipantsCount > 1) {
    const roundMatches: BracketMatch[] = [];

    let matchIndex = 0; // Used to map: index → matchId → winnerClubId

    // Inject bye clubs (only once)
    if (byeClubs.length && previousRoundIndex === 0) {
      for (const byeClub of byeClubs) {
        roundMatches.push({
          clubHomeId: byeClub,
          awayFromMatchIndex: matchIndex++,
        });
      }

      previousRoundIndex++;
    }

    // Inject not known clubs
    while (matchIndex < previousRoundMatchesCount) {
      roundMatches.push({
        homeFromMatchIndex: matchIndex++,
        awayFromMatchIndex: matchIndex++,
      });
    }

    rounds.push({
      totalClubs: currentParticipantsCount,
      matches: roundMatches,
    });

    previousRoundMatchesCount = roundMatches.length;
    currentParticipantsCount = roundMatches.length;
  }

  console.log("Builded fixed cup bracket...");

  return { rounds };
}

interface PersistCupMatchesProps {
  db: Transaction;
  competitionId: string;
  bracket: CupBracket;
}

export async function persistCupMatches({ db, competitionId, bracket }: PersistCupMatchesProps) {
  console.log("Persisting cup matches...");

  // Check if competition already has matches
  const alreadyHasMatches = await db
    .select()
    .from(matches)
    .where(eq(matches.competitionId, competitionId));

  if (alreadyHasMatches.length > 0)
    throw new Error(`Competition already has matches, competition id: ${competitionId}`);

  // Get cup rounds from DB
  const cupRoundsFromDB = await db
    .select({
      id: cupRounds.id,
      totalClubs: cupRounds.totalClubs,
    })
    .from(cupRounds);

  const cupRoundIdByTotalClubs = new Map(
    cupRoundsFromDB.map((round) => [round.totalClubs, round.id])
  );

  // This will store inserted match IDs by round index
  const insertedMatchIdsByRound: string[][] = [];

  // Iterate cup rounds in order
  for (let roundIndex = 0; roundIndex < bracket.rounds.length; roundIndex++) {
    const round = bracket.rounds[roundIndex];
    const cupRoundId = cupRoundIdByTotalClubs.get(round.totalClubs);

    if (!cupRoundId) throw new Error(`Cup round not found for totalClubs = ${round.totalClubs}`);

    const insertedMatchIds: string[] = [];

    // Persist matches of current round
    for (const match of round.matches) {
      const [createdMatch] = await db
        .insert(matches)
        .values({
          competitionId,
          cupRoundId,
          type: "cup",

          // Known clubs (first cup round or bye injection)
          clubHomeId: match.clubHomeId ?? null,
          clubAwayId: match.clubAwayId ?? null,

          // Not known clubs (dependencies from previous round)
          homeFromMatchId:
            match.homeFromMatchIndex !== undefined
              ? insertedMatchIdsByRound[roundIndex - 1][match.homeFromMatchIndex]
              : null,

          awayFromMatchId:
            match.awayFromMatchIndex !== undefined
              ? insertedMatchIdsByRound[roundIndex - 1][match.awayFromMatchIndex]
              : null,
        })
        .returning({ id: matches.id });

      insertedMatchIds.push(createdMatch.id);
    }

    // Save IDs for dependency resolution in next round
    insertedMatchIdsByRound.push(insertedMatchIds);
  }

  console.log("Cup matches persisted successfully");
}
