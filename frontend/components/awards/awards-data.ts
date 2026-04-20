export type AwardPlacement = {
  coins: string;
  placement: string;
  vipReward: string;
};

export type AwardCompetition = {
  rows: AwardPlacement[];
  subtitle: string;
  title: string;
};

export type AwardHighlight = {
  coins: string;
  title: string;
  vipReward: string;
};

export type AwardModalKey = "club" | "hour" | "round" | "season";

export const playerAwardCompetitions: AwardCompetition[] = [
  {
    title: "Top da hora",
    subtitle: "Premiação individual para os goleadores de cada hora.",
    rows: [
      { placement: "1º", vipReward: "VIP 1h", coins: "150 moedas" },
      { placement: "2º", vipReward: "VIP 30min", coins: "90 moedas" },
      { placement: "3º", vipReward: "VIP 15min", coins: "60 moedas" },
      { placement: "4º", vipReward: "-", coins: "1.000 moedas" },
      { placement: "5º", vipReward: "-", coins: "800 moedas" },
      { placement: "6º", vipReward: "-", coins: "600 moedas" },
      { placement: "7º", vipReward: "-", coins: "500 moedas" },
      { placement: "8º", vipReward: "-", coins: "400 moedas" },
      { placement: "9º", vipReward: "-", coins: "300 moedas" },
      { placement: "10º", vipReward: "-", coins: "200 moedas" },
    ],
  },
  {
    title: "Top da rodada",
    subtitle: "Premiação para os maiores goleadores do confronto do dia.",
    rows: [
      { placement: "1º", vipReward: "VIP 1 dia", coins: "2.500 moedas" },
      { placement: "2º", vipReward: "VIP 12h", coins: "1.700 moedas" },
      { placement: "3º", vipReward: "VIP 8h", coins: "1.200 moedas" },
      { placement: "4º", vipReward: "VIP 4h", coins: "1.000 moedas" },
      { placement: "5º", vipReward: "VIP 4h", coins: "800 moedas" },
      { placement: "6º", vipReward: "VIP 4h", coins: "600 moedas" },
      { placement: "7º", vipReward: "VIP 4h", coins: "500 moedas" },
      { placement: "8º", vipReward: "VIP 4h", coins: "400 moedas" },
      { placement: "9º", vipReward: "VIP 4h", coins: "300 moedas" },
      { placement: "10º", vipReward: "VIP 4h", coins: "200 moedas" },
    ],
  },
  {
    title: "Top da temporada",
    subtitle: "Premiação acumulada para os melhores jogadores da temporada.",
    rows: [
      { placement: "1º", vipReward: "3 VIPs de 1 dia", coins: "2.500 moedas" },
      { placement: "2º", vipReward: "2 VIPs de 12h", coins: "1.700 moedas" },
      { placement: "3º", vipReward: "1 VIP de 8h", coins: "1.200 moedas" },
      { placement: "4º", vipReward: "VIP 4h", coins: "1.000 moedas" },
      { placement: "5º", vipReward: "VIP 4h", coins: "800 moedas" },
      { placement: "6º", vipReward: "VIP 4h", coins: "600 moedas" },
      { placement: "7º", vipReward: "VIP 4h", coins: "500 moedas" },
      { placement: "8º", vipReward: "VIP 4h", coins: "400 moedas" },
      { placement: "9º", vipReward: "VIP 4h", coins: "300 moedas" },
      { placement: "10º", vipReward: "VIP 4h", coins: "200 moedas" },
    ],
  },
];

export const playerRecordHighlights: AwardHighlight[] = [
  {
    title: "Recorde da hora na temporada atual",
    vipReward: "1 VIP de 1 dia",
    coins: "10.000 moedas",
  },
  {
    title: "Recorde da rodada na temporada atual",
    vipReward: "3 VIPs de 1 dia",
    coins: "20.000 moedas",
  },
];

export const clubLeagueAwards: AwardCompetition[] = [
  {
    title: "1ª divisão",
    subtitle: "Liga Brazucagol",
    rows: [
      { placement: "1º", vipReward: "35 VIPs de 24h", coins: "120.000 moedas" },
      { placement: "2º", vipReward: "25 VIPs de 24h", coins: "90.000 moedas" },
      { placement: "3º", vipReward: "20 VIPs de 24h", coins: "60.000 moedas" },
      { placement: "4º", vipReward: "15 VIPs de 24h", coins: "40.000 moedas" },
    ],
  },
  {
    title: "2ª divisão",
    subtitle: "Liga Brazucagol",
    rows: [
      { placement: "1º", vipReward: "20 VIPs de 24h", coins: "120.000 moedas" },
      { placement: "2º", vipReward: "20 VIPs de 24h", coins: "90.000 moedas" },
      { placement: "3º", vipReward: "15 VIPs de 24h", coins: "60.000 moedas" },
      { placement: "4º", vipReward: "10 VIPs de 24h", coins: "40.000 moedas" },
    ],
  },
  {
    title: "3ª divisão",
    subtitle: "Liga Brazucagol",
    rows: [
      { placement: "1º", vipReward: "15 VIPs de 24h", coins: "120.000 moedas" },
      { placement: "2º", vipReward: "10 VIPs de 24h", coins: "90.000 moedas" },
      { placement: "3º", vipReward: "8 VIPs de 24h", coins: "60.000 moedas" },
      { placement: "4º", vipReward: "7 VIPs de 24h", coins: "40.000 moedas" },
    ],
  },
  {
    title: "4ª divisão",
    subtitle: "Liga Brazucagol",
    rows: [
      { placement: "1º", vipReward: "5 VIPs de 24h", coins: "120.000 moedas" },
      { placement: "2º", vipReward: "4 VIPs de 24h", coins: "90.000 moedas" },
      { placement: "3º", vipReward: "3 VIPs de 24h", coins: "60.000 moedas" },
      { placement: "4º", vipReward: "2 VIPs de 24h", coins: "40.000 moedas" },
    ],
  },
];

export const clubCupAwards: AwardCompetition[] = [
  {
    title: "Copa Brasil",
    subtitle: "Copa",
    rows: [
      { placement: "1º", vipReward: "35 VIPs de 24h", coins: "120.000 moedas" },
      { placement: "2º", vipReward: "25 VIPs de 24h", coins: "90.000 moedas" },
      { placement: "3º", vipReward: "20 VIPs de 24h", coins: "60.000 moedas" },
    ],
  },
  {
    title: "Copa Brazucagol",
    subtitle: "Copa",
    rows: [
      { placement: "1º", vipReward: "35 VIPs de 24h", coins: "120.000 moedas" },
      { placement: "2º", vipReward: "25 VIPs de 24h", coins: "90.000 moedas" },
      { placement: "3º", vipReward: "20 VIPs de 24h", coins: "60.000 moedas" },
    ],
  },
];
