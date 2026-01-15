import { Transaction } from "@/lib/drizzle";
import {
  FinalizableMatch,
  aggregatePlayerTotalStatsForMatch,
  applyLeagueStandingsForMatch,
  ensureCupWinnerPropagation,
  lockRoundMatchesForFinalize,
  updateMatchWinner,
} from "@/repositories/matchFinalizationRepository";

type FinalizeMatchProps = {
  db: Transaction;
  match: FinalizableMatch;
};

export async function finalizeMatch({ db, match }: FinalizeMatchProps) {
  if (match.type === "cup") {
    if (!match.clubHomeId || !match.clubAwayId) {
      throw new Error(`Cup match ${match.id} is missing clubs to finalize.`);
    }
  }

  if (match.type === "league") {
    if (!match.competitionId || !match.divisionId || !match.clubHomeId || !match.clubAwayId) {
      throw new Error(`League match ${match.id} is missing required identifiers to finalize.`);
    }
  }

  const winnerClubId =
    match.homeGoals > match.awayGoals
      ? match.clubHomeId
      : match.awayGoals > match.homeGoals
        ? match.clubAwayId
        : null;

  if (match.type === "cup" && !winnerClubId) {
    // TODO: Implement cup tie-breakers (extra time / penalties) before finalizing.
    throw new Error(`Cup match ${match.id} ended in a draw without a tie-breaker.`);
  }

  await updateMatchWinner({
    db,
    matchId: match.id,
    winnerClubId: winnerClubId,
  });

  await aggregatePlayerTotalStatsForMatch({ db, matchId: match.id });

  if (match.type === "league") {
    await applyLeagueStandingsForMatch({ db, matchId: match.id });
  }

  if (match.type === "cup") {
    await ensureCupWinnerPropagation({
      db,
      matchId: match.id,
      winnerClubId: winnerClubId!,
    });
  }
}

type FinalizeRoundMatchesProps = {
  db: Transaction;
  roundDate: Date;
  lockedMatches?: FinalizableMatch[];
};

export async function finalizeRoundMatches({
  db,
  roundDate,
  lockedMatches,
}: FinalizeRoundMatchesProps) {
  const matchesToFinalize = lockedMatches ?? (await lockRoundMatchesForFinalize({ db, roundDate }));

  for (const match of matchesToFinalize) {
    await finalizeMatch({ db, match });
  }

  return matchesToFinalize.length;
}
