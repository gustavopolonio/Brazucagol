"use client";

import { useState } from "react";
import { Award, Building2, Target } from "lucide-react";

import { AwardActionButton } from "@/components/awards/AwardActionButton";
import { AwardsSection } from "@/components/awards/AwardsSection";
import { AwardsTable } from "@/components/awards/AwardsTable";
import { HighlightCard } from "@/components/awards/HighlightCard";
import {
  type AwardModalKey,
  clubCupAwards,
  clubLeagueAwards,
  playerAwardCompetitions,
  playerRecordHighlights,
} from "@/components/awards/awards-data";
import { PanelCard } from "@/components/layout/PanelCard";
import { Modal } from "@/components/ui/Modal";

export function AwardsPage() {
  const [selectedAwardModal, setSelectedAwardModal] = useState<AwardModalKey | null>(null);

  function closeAwardModal() {
    setSelectedAwardModal(null);
  }

  return (
    <PanelCard
      title={
        <span className="inline-flex items-center gap-2">
          <Award className="h-4 w-4" />
          Premiações
        </span>
      }
    >
      <main className="rounded-b-[18px] border border-border bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-soft)_100%)] px-4 pt-10 pb-4 opacity-95">
        <div className="space-y-6">
          <AwardsSection
            description="Os prêmios abaixo vão direto para o jogador e recompensam os principais artilheiros do jogo."
            icon={Target}
            title="Premiações dos jogadores"
          >
            <div className="grid gap-4 lg:grid-cols-3">
              <AwardActionButton
                onClick={() => setSelectedAwardModal("hour")}
                title="Top da hora"
              />
              <AwardActionButton
                onClick={() => setSelectedAwardModal("round")}
                title="Top da rodada"
              />
              <AwardActionButton
                onClick={() => setSelectedAwardModal("season")}
                title="Top da temporada"
              />
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {playerRecordHighlights.map((highlight) => (
                <HighlightCard
                  coins={highlight.coins}
                  key={highlight.title}
                  title={highlight.title}
                  vipReward={highlight.vipReward}
                />
              ))}
            </div>
          </AwardsSection>

          <AwardsSection
            description="As premiações abaixo são destinadas ao caixa do clube e ajudam a sustentar a temporada inteira."
            icon={Building2}
            title="Premiações dos clubes"
          >
            <div className="grid grid-cols-[auto_1fr] items-start gap-6">
              <AwardActionButton
                onClick={() => setSelectedAwardModal("club")}
                title="Liga e Copas"
              />

              <HighlightCard
                coins="1.000 moedas"
                title="Bônus por vitória - cada vitória do clube rende uma premiação adicional"
                vipReward="1 VIP de 6h"
              />
            </div>
          </AwardsSection>
        </div>
      </main>

      <Modal
        description="Premiação individual para os top 10 artilheiros de cada hora."
        onClose={closeAwardModal}
        open={selectedAwardModal === "hour"}
        title="Top da hora"
      >
        <AwardsTable competitions={[playerAwardCompetitions[0]]} emptyVipLabel="-" />
      </Modal>

      <Modal
        description="Premiação individual para os top 10 artilheiros de cada rodada."
        onClose={closeAwardModal}
        open={selectedAwardModal === "round"}
        title="Top da rodada"
      >
        <AwardsTable competitions={[playerAwardCompetitions[1]]} emptyVipLabel="-" />
      </Modal>

      <Modal
        description="Premiação individual para os top 10 artilheiros de cada temporada."
        onClose={closeAwardModal}
        open={selectedAwardModal === "season"}
        title="Top da temporada"
      >
        <AwardsTable competitions={[playerAwardCompetitions[2]]} emptyVipLabel="-" />
      </Modal>

      <Modal
        description="Premiação para os melhores clubes de cada campeonato."
        onClose={closeAwardModal}
        open={selectedAwardModal === "club"}
        title="Liga e Copas"
      >
        <div className="space-y-6">
          <AwardsTable competitions={clubLeagueAwards} showCompetitionHeader />
          <AwardsTable competitions={clubCupAwards} showCompetitionHeader />
        </div>
      </Modal>
    </PanelCard>
  );
}
