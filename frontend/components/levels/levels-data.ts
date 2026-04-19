export type LevelIconName =
  | "circle-dot"
  | "flag"
  | "shield"
  | "target"
  | "zap"
  | "flame"
  | "medal"
  | "star"
  | "award"
  | "crown"
  | "gem"
  | "trophy"
  | "rocket";

export type LevelData = {
  levelNumber: number;
  name: string;
  goalsRequired: number;
  iconName: LevelIconName;
};

export const levels: LevelData[] = [
  { levelNumber: 1, name: "Peneira", goalsRequired: 0, iconName: "circle-dot" },
  { levelNumber: 2, name: "Sub-8", goalsRequired: 5, iconName: "flag" },
  { levelNumber: 3, name: "Sub-10", goalsRequired: 12, iconName: "shield" },
  { levelNumber: 4, name: "Sub-12", goalsRequired: 25, iconName: "target" },
  { levelNumber: 5, name: "Sub-14", goalsRequired: 40, iconName: "zap" },
  { levelNumber: 6, name: "Sub-16", goalsRequired: 60, iconName: "flame" },
  { levelNumber: 7, name: "Sub-18", goalsRequired: 85, iconName: "medal" },
  { levelNumber: 8, name: "Profissional", goalsRequired: 120, iconName: "star" },
  { levelNumber: 9, name: "Titular", goalsRequired: 170, iconName: "award" },
  { levelNumber: 10, name: "Craque", goalsRequired: 235, iconName: "crown" },
  { levelNumber: 11, name: "Camisa 10", goalsRequired: 320, iconName: "gem" },
  { levelNumber: 12, name: "Artilheiro", goalsRequired: 430, iconName: "trophy" },
  { levelNumber: 13, name: "Lenda", goalsRequired: 600, iconName: "rocket" },
];
