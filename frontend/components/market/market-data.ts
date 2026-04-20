export type MarketTransfer = {
  arrivedClubImageUrl?: string;
  arrivedClubName: string;
  arrivedClubShortName: string;
  movedAt: string;
  playerName: string;
  previousClubImageUrl?: string;
  previousClubName: string;
  previousClubShortName: string;
  totalGoals: number;
};

type MarketTransferSeed = Omit<MarketTransfer, "movedAt">;

const clubBadgeImageUrls = {
  atletico: "https://escudosfc.com.br/images/atletico.png",
  bahia: "https://escudosfc.com.br/images/bahia.png",
  botafogo: "https://escudosfc.com.br/images/botafogo.gif",
  bragantino: "https://escudosfc.com.br/images/bragantino.png",
  chapecoense: "https://escudosfc.com.br/images/chapeco.png",
  cruzeiro: "https://escudosfc.com.br/images/cruzeiro.png",
  fluminense: "https://escudosfc.com.br/images/fluminense.png",
  internacional: "https://escudosfc.com.br/images/interrs.png",
  palmeiras: "https://escudosfc.com.br/images/palmeiras.png",
  santos: "https://escudosfc.com.br/images/santos.png",
} as const;

const marketTransferSeeds: MarketTransferSeed[] = [
  {
    playerName: "Canhotinha10",
    totalGoals: 812,
    previousClubName: "Cruzeiro",
    previousClubShortName: "CRU",
    previousClubImageUrl: clubBadgeImageUrls.cruzeiro,
    arrivedClubName: "Palmeiras",
    arrivedClubShortName: "PAL",
    arrivedClubImageUrl: clubBadgeImageUrls.palmeiras,
  },
  {
    playerName: "ReiDoDrible",
    totalGoals: 789,
    previousClubName: "Atlético Mineiro",
    previousClubShortName: "CAM",
    previousClubImageUrl: clubBadgeImageUrls.atletico,
    arrivedClubName: "Fluminense",
    arrivedClubShortName: "FLU",
    arrivedClubImageUrl: clubBadgeImageUrls.fluminense,
  },
  {
    playerName: "FogueteDaArea",
    totalGoals: 761,
    previousClubName: "Bahia",
    previousClubShortName: "BAH",
    previousClubImageUrl: clubBadgeImageUrls.bahia,
    arrivedClubName: "Internacional",
    arrivedClubShortName: "INT",
    arrivedClubImageUrl: clubBadgeImageUrls.internacional,
  },
  {
    playerName: "ParedaoSul",
    totalGoals: 734,
    previousClubName: "Botafogo",
    previousClubShortName: "BOT",
    previousClubImageUrl: clubBadgeImageUrls.botafogo,
    arrivedClubName: "Santos",
    arrivedClubShortName: "SAN",
    arrivedClubImageUrl: clubBadgeImageUrls.santos,
  },
  {
    playerName: "BicoDaChuteira",
    totalGoals: 701,
    previousClubName: "Chapecoense",
    previousClubShortName: "CHA",
    previousClubImageUrl: clubBadgeImageUrls.chapecoense,
    arrivedClubName: "Bragantino",
    arrivedClubShortName: "RBB",
    arrivedClubImageUrl: clubBadgeImageUrls.bragantino,
  },
  {
    playerName: "CraqueDoAsfalto",
    totalGoals: 680,
    previousClubName: "Fluminense",
    previousClubShortName: "FLU",
    previousClubImageUrl: clubBadgeImageUrls.fluminense,
    arrivedClubName: "Cruzeiro",
    arrivedClubShortName: "CRU",
    arrivedClubImageUrl: clubBadgeImageUrls.cruzeiro,
  },
  {
    playerName: "MitoDaPelada",
    totalGoals: 654,
    previousClubName: "Bragantino",
    previousClubShortName: "RBB",
    previousClubImageUrl: clubBadgeImageUrls.bragantino,
    arrivedClubName: "Bahia",
    arrivedClubShortName: "BAH",
    arrivedClubImageUrl: clubBadgeImageUrls.bahia,
  },
  {
    playerName: "FintaPerfeita",
    totalGoals: 628,
    previousClubName: "Palmeiras",
    previousClubShortName: "PAL",
    previousClubImageUrl: clubBadgeImageUrls.palmeiras,
    arrivedClubName: "Botafogo",
    arrivedClubShortName: "BOT",
    arrivedClubImageUrl: clubBadgeImageUrls.botafogo,
  },
  {
    playerName: "CapitaoDaRede",
    totalGoals: 603,
    previousClubName: "Internacional",
    previousClubShortName: "INT",
    previousClubImageUrl: clubBadgeImageUrls.internacional,
    arrivedClubName: "Atlético Mineiro",
    arrivedClubShortName: "CAM",
    arrivedClubImageUrl: clubBadgeImageUrls.atletico,
  },
  {
    playerName: "Golaco89",
    totalGoals: 582,
    previousClubName: "Santos",
    previousClubShortName: "SAN",
    previousClubImageUrl: clubBadgeImageUrls.santos,
    arrivedClubName: "Chapecoense",
    arrivedClubShortName: "CHA",
    arrivedClubImageUrl: clubBadgeImageUrls.chapecoense,
  },
];

export const marketTransfers: MarketTransfer[] = Array.from({ length: 60 }, (_, index) => {
  const marketTransferSeed = marketTransferSeeds[index % marketTransferSeeds.length];
  const dayOffset = Math.floor(index / 6);
  const hourValue = 23 - (index % 6) * 2;
  const minuteValue = (42 + index * 7) % 60;
  const dayValue = 20 - dayOffset;

  return {
    ...marketTransferSeed,
    movedAt: `${String(dayValue).padStart(2, "0")}/04/2026 ${String(hourValue).padStart(2, "0")}:${String(minuteValue).padStart(2, "0")}`,
    playerName:
      index < marketTransferSeeds.length
        ? marketTransferSeed.playerName
        : `${marketTransferSeed.playerName}${Math.floor(index / marketTransferSeeds.length) + 1}`,
    totalGoals: Math.max(120, marketTransferSeed.totalGoals - index * 4),
  };
});
