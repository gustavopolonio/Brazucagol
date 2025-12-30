import type {
  BracketContext,
  CupMatch,
  CupMatchByRound,
  MatchMetadata,
  MatchRef,
  Participant,
} from "@/types/cup.types";
import { ceilHalf } from ".";

export function extractUniqueClubIdsFromCupMatches(cupMatches: CupMatch[]) {
  // Get all club ids (without repeating)
  const allIds = cupMatches.flatMap((match) =>
    [match.homeClubId, match.awayClubId, match.winnerClubId].filter(Boolean)
  );

  const clubsIds = Array.from(new Set(allIds));

  return clubsIds;
}

export function groupCupMatchesByRound(cupMatches: CupMatch[]) {
  const roundsMap = new Map<number, CupMatchByRound>();

  for (const match of cupMatches) {
    if (!roundsMap.has(match.roundStage)) {
      roundsMap.set(match.roundStage, {
        stage: match.roundStage,
        name: match.roundName,
        slug: match.roundSlug,
        totalClubs: match.roundTotalClubs,
        matches: [],
      });
    }

    roundsMap.get(match.roundStage).matches.push(match);
  }

  const cupMatchesByRound = Array.from(roundsMap.values()).sort((a, b) => b.stage - a.stage);

  return cupMatchesByRound;
}

export function buildCupMatchesMetadata(cupMatchesByRound: CupMatchByRound[]) {
  const matchMetadataById = new Map<string, MatchMetadata>();

  for (const round of cupMatchesByRound) {
    const bracketSideSize = ceilHalf(round.matches.length);

    round.matches.forEach((match, index) => {
      matchMetadataById.set(match.id, {
        bracketSide: index < bracketSideSize ? "A" : "B",
        matchNumber: index < bracketSideSize ? index + 1 : index - bracketSideSize + 1,
        roundName: round.name,
        roundSlug: match.roundSlug,
      });
    });
  }

  return matchMetadataById;
}

interface BuildParticipantProps {
  ctx: BracketContext;
  knownClubId?: string | null;
  fromMatchId?: string | null;
}

export function buildParticipant({
  ctx,
  knownClubId,
  fromMatchId,
}: BuildParticipantProps): Participant {
  if (knownClubId) {
    return {
      club: ctx.clubsById.get(knownClubId) ?? null,
      fromMatch: null,
    };
  }

  if (!fromMatchId) {
    return { club: null, fromMatch: null };
  }

  const fromMatch = ctx.matchesById.get(fromMatchId);
  const metadata = ctx.matchMetadataById.get(fromMatchId);
  if (!fromMatch || !metadata) {
    return { club: null, fromMatch: null };
  }

  const winnerClub =
    fromMatch.winnerClubId !== null ? (ctx.clubsById.get(fromMatch.winnerClubId) ?? null) : null;

  const matchRef: MatchRef = {
    id: fromMatch.id,
    roundSlug: metadata.roundSlug,
    roundName: metadata.roundName,
    side: metadata.bracketSide,
    matchNumber: metadata.matchNumber,
    homeClub: fromMatch.homeClubId ? (ctx.clubsById.get(fromMatch.homeClubId) ?? null) : null,
    awayClub: fromMatch.awayClubId ? (ctx.clubsById.get(fromMatch.awayClubId) ?? null) : null,
    winnerClub,
  };

  return { club: winnerClub, fromMatch: matchRef };
}

interface BuildMatchPayloadProps {
  ctx: BracketContext;
  match: CupMatch;
}

export function buildMatchPayload({ ctx, match }: BuildMatchPayloadProps) {
  const home = buildParticipant({
    ctx,
    knownClubId: match.homeClubId,
    fromMatchId: match.homeFromMatchId,
  });
  const away = buildParticipant({
    ctx,
    knownClubId: match.awayClubId,
    fromMatchId: match.awayFromMatchId,
  });
  const meta = ctx.matchMetadataById.get(match.id);

  return {
    id: match.id,
    status: match.status,
    date: match.date,
    homeGoals: match.homeGoals,
    awayGoals: match.awayGoals,
    side: meta?.bracketSide ?? null,
    matchNumber: meta?.matchNumber ?? null,
    home,
    away,
    winnerClub:
      match.winnerClubId !== null ? (ctx.clubsById.get(match.winnerClubId) ?? null) : null,
  };
}
