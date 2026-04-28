import { Flame } from "lucide-react";

import type { PlayerProfileData } from "@/components/profile/profileTypes";
import { dateFormatter, numberFormatter } from "@/components/profile/profileUtils";

export const demoPlayerProfileData: PlayerProfileData = {
  playerName: "Boexatinha",
  clubName: "Palmeiras",
  clubShortName: "PAL",
  clubImageUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/SE_Palmeiras_2025_crest.png/250px-SE_Palmeiras_2025_crest.png",
  clubRoleLabel: "diretor",
  isClubRepresentative: true,
  bio: "Camisa 10, cobrador oficial e colecionador de golaços no velho estilo brazuca.",
  avatarUrl: "/images/profile/player-avatar-placeholder-v3.png",
  level: {
    icon: Flame,
    name: "Special Dark",
    number: 39,
  },
  overallTopRank: 1,
  currentGoals: 1981,
  nextLevelGoalsRequired: 2389,
  kickSummaryStats: [
    { label: "Gols", value: numberFormatter.format(1284) },
    { label: "Temporada", value: numberFormatter.format(182) },
    { label: "Rodada", value: numberFormatter.format(26) },
    { label: "Hora", value: numberFormatter.format(7) },
    { label: "Estreia", value: dateFormatter.format(new Date("2025-08-18T12:00:00Z")) },
  ],
  conversionMetrics: [
    { label: "Pênalti", convertedGoals: 34, totalTries: 41 },
    { label: "Falta", convertedGoals: 22, totalTries: 31 },
    { label: "Tiki-taka", convertedGoals: 58, totalTries: 74 },
  ],
  individualSeasonTopFinishes: [
    { placement: 2, seasonNumber: 3 },
    { placement: 10, seasonNumber: 1 },
  ],
  clubAchievementCounts: {
    leagueTitles: 2,
    copaBrasilTitles: 1,
    copaBrazucagolTitles: 3,
  },
  rankingHistory: {
    topHora: [
      { placement: 1, totalTimes: 12 },
      { placement: 2, totalTimes: 9 },
      { placement: 3, totalTimes: 7 },
      { placement: 4, totalTimes: 6 },
      { placement: 5, totalTimes: 5 },
      { placement: 6, totalTimes: 4 },
      { placement: 7, totalTimes: 4 },
      { placement: 8, totalTimes: 3 },
      { placement: 9, totalTimes: 2 },
      { placement: 10, totalTimes: 2 },
    ],
    topRodada: [
      { placement: 1, totalTimes: 5 },
      { placement: 2, totalTimes: 4 },
      { placement: 3, totalTimes: 4 },
      { placement: 4, totalTimes: 3 },
      { placement: 5, totalTimes: 3 },
      { placement: 6, totalTimes: 2 },
      { placement: 7, totalTimes: 2 },
      { placement: 8, totalTimes: 2 },
      { placement: 9, totalTimes: 1 },
      { placement: 10, totalTimes: 1 },
    ],
    topTemporada: [
      { placement: 1, totalTimes: 1 },
      { placement: 2, totalTimes: 1 },
      { placement: 3, totalTimes: 0 },
      { placement: 4, totalTimes: 0 },
      { placement: 5, totalTimes: 0 },
      { placement: 6, totalTimes: 0 },
      { placement: 7, totalTimes: 0 },
      { placement: 8, totalTimes: 0 },
      { placement: 9, totalTimes: 0 },
      { placement: 10, totalTimes: 1 },
    ],
  },
  transferHistory: [
    {
      movedAt: "18/04/2026 21:40",
      previousClubName: "Cruzeiro",
      previousClubShortName: "CRU",
      previousClubImageUrl: "https://escudosfc.com.br/images/cruzeiro.png",
      arrivedClubName: "Palmeiras",
      arrivedClubShortName: "PAL",
      arrivedClubImageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/SE_Palmeiras_2025_crest.png/250px-SE_Palmeiras_2025_crest.png",
    },
    {
      movedAt: "09/03/2026 18:15",
      previousClubName: "Fluminense",
      previousClubShortName: "FLU",
      previousClubImageUrl: "https://escudosfc.com.br/images/fluminense.png",
      arrivedClubName: "Cruzeiro",
      arrivedClubShortName: "CRU",
      arrivedClubImageUrl: "https://escudosfc.com.br/images/cruzeiro.png",
    },
    {
      movedAt: "27/01/2026 22:05",
      previousClubName: "Bahia",
      previousClubShortName: "BAH",
      previousClubImageUrl: "https://escudosfc.com.br/images/bahia.png",
      arrivedClubName: "Fluminense",
      arrivedClubShortName: "FLU",
      arrivedClubImageUrl: "https://escudosfc.com.br/images/fluminense.png",
    },
  ],
};
