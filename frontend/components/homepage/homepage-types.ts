export type {
  AccountOption,
  ActionButtonData,
  ClubBadgeData,
  HeaderPanelData,
  MenuItem,
  TopBarData,
} from "@/components/layout/layoutTypes";

export type RankingEntry = {
  position: number;
  playerName: string;
  clubShortName: string;
  clubImageUrl?: string;
  score: number;
};

export type StatusPillData = {
  label: string;
  value: string;
};

export type RecordCardData = {
  title: string;
  clubShortName: string;
  clubImageUrl?: string;
  playerName: string;
  goals: string;
};

export type RankingRefreshData = {
  refreshIntervalSeconds: number;
};
