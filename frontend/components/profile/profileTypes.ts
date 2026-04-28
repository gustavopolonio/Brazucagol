import type { LucideIcon } from "lucide-react";

export type LevelData = {
  icon: LucideIcon;
  name: string;
  number: number;
};

export type KickSummaryStat = {
  label: string;
  value: string;
};

export type ConversionMetric = {
  label: string;
  convertedGoals: number;
  totalTries: number;
};

export type SeasonalTopFinish = {
  placement: number;
  seasonNumber: number;
};

export type ClubAchievementCounts = {
  leagueTitles: number;
  copaBrasilTitles: number;
  copaBrazucagolTitles: number;
};

export type RankingHistoryEntry = {
  placement: number;
  totalTimes: number;
};

export type PlayerRankingHistory = {
  topHora: RankingHistoryEntry[];
  topRodada: RankingHistoryEntry[];
  topTemporada: RankingHistoryEntry[];
};

export type PlayerTransferHistoryEntry = {
  arrivedClubImageUrl?: string;
  arrivedClubName: string;
  arrivedClubShortName: string;
  movedAt: string;
  previousClubImageUrl?: string;
  previousClubName: string;
  previousClubShortName: string;
};

export type RolePresentation = {
  compactLabel: string;
  fullLabel: string;
  colorClassName: string;
};

export type PlayerProfileData = {
  playerName: string;
  clubName: string;
  clubShortName: string;
  clubImageUrl?: string;
  clubRoleLabel?: string;
  isClubRepresentative?: boolean;
  bio?: string;
  avatarUrl: string;
  level: LevelData;
  overallTopRank?: number;
  currentGoals: number;
  nextLevelGoalsRequired: number;
  kickSummaryStats: KickSummaryStat[];
  conversionMetrics: ConversionMetric[];
  individualSeasonTopFinishes: SeasonalTopFinish[];
  clubAchievementCounts: ClubAchievementCounts;
  rankingHistory: PlayerRankingHistory;
  transferHistory: PlayerTransferHistoryEntry[];
};
