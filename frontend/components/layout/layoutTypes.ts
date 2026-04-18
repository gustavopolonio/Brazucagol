export type ClubBadgeData = {
  id: number;
  name: string;
  shortName: string;
  imageUrl?: string;
};

export type MenuItem = {
  label: string;
  href?: string;
};

export type AccountOption = {
  label: string;
  iconName: "mail" | "user" | "arrow-left-right" | "star" | "settings";
  primaryColor: string;
  secondaryColor: string;
  unreadCount?: number;
};

export type ActionButtonData = {
  label: string;
  primaryColor: string;
  secondaryColor: string;
  cooldownRemainingSeconds: number;
  cooldownTotalSeconds: number;
};

export type HeaderPanelData = {
  teamName: string;
  teamLeague: string;
  levelLabel: string;
  currentGoals: number;
  nextLevelGoalsRequired: number;
  teamBadge: {
    shortName: string;
    imageUrl?: string;
  };
  profileStats: string[];
};

export type TopBarData = {
  searchPlaceholder: string;
  currentRoundLabel: string;
  onlineCount: string;
  countdown: string;
  currentSeasonLabel: string;
  playerName: string;
  playerAvatarUrl?: string;
  clubPrimaryColor: string;
  clubSecondaryColor: string;
  logoutLabel: string;
};
