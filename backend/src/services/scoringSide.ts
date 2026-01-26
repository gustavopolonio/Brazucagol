// TODO: didn't like one file only for it

export type MatchScoringSide = "home" | "away";

interface ResolveScoringSideProps {
  playerClubId: string;
  matchClubHomeId: string | null;
  matchClubAwayId: string | null;
}

export function resolveScoringSide({
  playerClubId,
  matchClubHomeId,
  matchClubAwayId,
}: ResolveScoringSideProps): MatchScoringSide | null {
  if (!matchClubHomeId || !matchClubAwayId) {
    return null;
  }

  if (playerClubId === matchClubHomeId) {
    return "home";
  }

  if (playerClubId === matchClubAwayId) {
    return "away";
  }

  return null;
}
