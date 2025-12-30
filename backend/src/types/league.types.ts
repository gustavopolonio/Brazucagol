import { getLeagueMatches } from "@/repositories/leagueRepository";

export type LeagueMatch = Awaited<ReturnType<typeof getLeagueMatches>>[number];

export type ClubPreview = {
  id: string;
  name: string;
  logoUrl: string | null;
};

export type LeagueMatchWithClubs = LeagueMatch & {
  homeClub: ClubPreview;
  awayClub: ClubPreview;
};
