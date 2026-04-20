export type RankingPlayer = {
  clubImageUrl?: string;
  clubShortName: string;
  playerName: string;
  totalGoals: number;
};

type RankingPlayerSeed = Omit<RankingPlayer, "totalGoals">;

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

const rankingPlayerSeeds: RankingPlayerSeed[] = [
  { playerName: "Canhotinha10", clubShortName: "CRU", clubImageUrl: clubBadgeImageUrls.cruzeiro },
  { playerName: "ReiDoDrible", clubShortName: "CAM", clubImageUrl: clubBadgeImageUrls.atletico },
  { playerName: "FogueteDaArea", clubShortName: "BAH", clubImageUrl: clubBadgeImageUrls.bahia },
  { playerName: "ParedaoSul", clubShortName: "BOT", clubImageUrl: clubBadgeImageUrls.botafogo },
  { playerName: "BicoDaChuteira", clubShortName: "CHA", clubImageUrl: clubBadgeImageUrls.chapecoense },
  { playerName: "CraqueDoAsfalto", clubShortName: "FLU", clubImageUrl: clubBadgeImageUrls.fluminense },
  { playerName: "MitoDaPelada", clubShortName: "RBB", clubImageUrl: clubBadgeImageUrls.bragantino },
  { playerName: "FintaPerfeita", clubShortName: "PAL", clubImageUrl: clubBadgeImageUrls.palmeiras },
  { playerName: "CapitaoDaRede", clubShortName: "INT", clubImageUrl: clubBadgeImageUrls.internacional },
  { playerName: "Golaco89", clubShortName: "SAN", clubImageUrl: clubBadgeImageUrls.santos },
  { playerName: "PiveteDoGol", clubShortName: "CRU", clubImageUrl: clubBadgeImageUrls.cruzeiro },
  { playerName: "XerifeDaArea", clubShortName: "CAM", clubImageUrl: clubBadgeImageUrls.atletico },
  { playerName: "LanceGenial", clubShortName: "PAL", clubImageUrl: clubBadgeImageUrls.palmeiras },
  { playerName: "ChuteSeco", clubShortName: "FLU", clubImageUrl: clubBadgeImageUrls.fluminense },
  { playerName: "MonstroDaRede", clubShortName: "BOT", clubImageUrl: clubBadgeImageUrls.botafogo },
  { playerName: "CamisaOnze", clubShortName: "INT", clubImageUrl: clubBadgeImageUrls.internacional },
  { playerName: "RasteiraFatal", clubShortName: "BAH", clubImageUrl: clubBadgeImageUrls.bahia },
  { playerName: "ArcoDaVelha", clubShortName: "SAN", clubImageUrl: clubBadgeImageUrls.santos },
  { playerName: "RaioDoAtaque", clubShortName: "RBB", clubImageUrl: clubBadgeImageUrls.bragantino },
  { playerName: "GingaSuprema", clubShortName: "CHA", clubImageUrl: clubBadgeImageUrls.chapecoense },
];

export const rankingPlayers: RankingPlayer[] = Array.from({ length: 100 }, (_, index) => {
  const rankingPlayerSeed = rankingPlayerSeeds[index % rankingPlayerSeeds.length];
  const seedCycle = Math.floor(index / rankingPlayerSeeds.length);

  return {
    ...rankingPlayerSeed,
    playerName:
      seedCycle === 0 ? rankingPlayerSeed.playerName : `${rankingPlayerSeed.playerName}${seedCycle + 1}`,
    totalGoals: 812 - index * 7,
  };
});
