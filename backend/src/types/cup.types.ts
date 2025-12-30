import { getCupMatches } from "@/repositories/cupRepository";

export type CupMatch = Awaited<ReturnType<typeof getCupMatches>>[number];

export type CupMatchByRound = {
  stage: number;
  name: string;
  slug: string;
  totalClubs: number;
  matches: CupMatch[];
};

export type ClubPreview = {
  id: string;
  name: string;
  logoUrl: string | null;
};

export type MatchMetadata = {
  bracketSide: "A" | "B";
  matchNumber: number;
  roundName: string;
  roundSlug: string;
};

export type MatchRef = {
  id: string;
  roundSlug: string;
  roundName: string;
  side: "A" | "B";
  matchNumber: number;
  homeClub: ClubPreview | null;
  awayClub: ClubPreview | null;
  winnerClub: ClubPreview | null;
};

export type Participant = {
  club: ClubPreview | null;
  fromMatch: MatchRef | null;
};

export type BracketContext = {
  clubsById: Map<string, ClubPreview>;
  matchesById: Map<string, CupMatch>;
  matchMetadataById: Map<string, MatchMetadata>;
};
