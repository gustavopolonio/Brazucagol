import type {
  RankingEntry,
  RankingRefreshData,
  RecordCardData,
} from "@/components/homepage/homepage-types";
import { RankingCard } from "@/components/homepage/RankingCard";
import { RankingRefreshIndicator } from "@/components/homepage/RankingRefreshIndicator";

type RankingBaseEntry = {
  playerName: string;
  clubShortName: string;
  clubImageUrl?: string;
};

const clubBadgeImageUrls = {
  cruzeiro: "https://escudosfc.com.br/images/cruzeiro.png",
  atletico: "https://escudosfc.com.br/images/atletico.png",
  bahia: "https://escudosfc.com.br/images/bahia.png",
  botafogo: "https://escudosfc.com.br/images/botafogo.gif",
  chapecoense: "https://escudosfc.com.br/images/chapeco.png",
  fluminense: "https://escudosfc.com.br/images/fluminense.png",
  bragantino: "https://escudosfc.com.br/images/bragantino.png",
  palmeiras: "https://escudosfc.com.br/images/palmeiras.png",
  internacional: "https://escudosfc.com.br/images/interrs.png",
  santos: "https://escudosfc.com.br/images/santos.png",
} as const;

const rankingPlayers: RankingBaseEntry[] = [
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
];

const hourRanking = createRanking(rankingPlayers, [34, 29, 26, 23, 21, 19, 17, 16, 15, 14]);
const roundRanking = createRanking(rankingPlayers, [118, 112, 106, 95, 91, 88, 82, 80, 77, 74]);
const seasonRanking = createRanking(rankingPlayers, [882, 850, 835, 811, 798, 781, 760, 748, 731, 715]);

const seasonRecords: RecordCardData[] = [
  {
    title: "Top Hora Temp atual",
    clubShortName: "CRU",
    clubImageUrl: clubBadgeImageUrls.cruzeiro,
    playerName: "Canhotinha10",
    goals: "48",
  },
  {
    title: "Top rodada temp atual",
    clubShortName: "CAM",
    clubImageUrl: clubBadgeImageUrls.atletico,
    playerName: "ReiDoDrible",
    goals: "152",
  },
];

const rankingRefreshData: RankingRefreshData = {
  refreshIntervalSeconds: 10,
};

export function HomePageRankings() {
  return (
    <>
      <div className="relative grid gap-5 xl:grid-cols-[1fr_1fr_1fr]">
        <RankingCard
          title="HORA"
          entries={hourRanking}
          record={seasonRecords[0]}
        />
        <RankingCard
          title="RODADA"
          entries={roundRanking}
          record={seasonRecords[1]}
        />
        <RankingCard title="TEMPORADA" entries={seasonRanking} />
      </div>

      <RankingRefreshIndicator refreshData={rankingRefreshData} />
    </>
  );
}

function createRanking(players: RankingBaseEntry[], scores: number[]): RankingEntry[] {
  return players.map((player, index) => ({
    ...player,
    position: index + 1,
    score: scores[index],
  }));
}
