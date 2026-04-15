import { HomePageRankings } from "@/components/homepage/HomePageRankings";
import { GameLayout } from "@/components/layout/GameLayout";

export default function HomePage() {
  return (
    <GameLayout>
      <HomePageRankings />
    </GameLayout>
  );
}
