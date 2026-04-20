"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";

import { PanelCard } from "@/components/layout/PanelCard";
import { RankingPlayerCell } from "@/components/ranking/RankingPlayerCell";
import { rankingPlayers } from "@/components/ranking/ranking-data";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

const PLAYERS_PER_PAGE = 20;
const MAX_PLAYERS_VISIBLE = 100;

export function RankingPage() {
  const [visiblePlayersCount, setVisiblePlayersCount] = useState(PLAYERS_PER_PAGE);

  const totalPlayersAvailable = Math.min(rankingPlayers.length, MAX_PLAYERS_VISIBLE);
  const visibleRankingPlayers = rankingPlayers.slice(0, visiblePlayersCount);
  const hasMorePlayersToShow = visiblePlayersCount < totalPlayersAvailable;

  function handleLoadMorePlayers() {
    setVisiblePlayersCount((currentVisiblePlayersCount) =>
      Math.min(currentVisiblePlayersCount + PLAYERS_PER_PAGE, totalPlayersAvailable),
    );
  }

  return (
    <PanelCard
      title={
        <span className="inline-flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          Ranking
        </span>
      }
    >
      <main className="rounded-b-[18px] border border-border bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-soft)_100%)] px-4 pt-10 pb-4 opacity-95">
        <section className="overflow-hidden rounded-[28px] border border-[var(--homepage-panel-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,245,245,0.98)_100%)] shadow-[0_20px_38px_rgba(73,54,20,0.12)]">
          <div className="border-b border-[var(--homepage-panel-divider)] bg-[linear-gradient(135deg,rgba(132,212,0,0.18)_0%,rgba(78,182,255,0.16)_100%)] px-5 py-5 md:px-7">
            <div className="flex flex-col gap-3">
              <div className="inline-flex w-fit items-center gap-3 rounded-full bg-white/80 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
                <Trophy className="h-5 w-5 text-[var(--homepage-highlight-label)]" />
                <span className="text-sm font-black uppercase tracking-[0.16em] text-[var(--homepage-highlight-label)]">
                  Artilharia geral
                </span>
              </div>
              <p className="text-sm font-semibold text-[var(--homepage-panel-text)] md:text-base">
                Classificação dos maiores artilheiros de todos os tempos.
              </p>
            </div>
          </div>

          <div className="px-3 py-3 md:px-5 md:py-5">
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-[linear-gradient(180deg,rgba(247,247,247,0.95)_0%,rgba(238,248,208,0.75)_100%)] text-[var(--homepage-panel-text-strong)]">
                    <TableHead>Posição</TableHead>
                    <TableHead>Jogador</TableHead>
                    <TableHead>Gols</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {visibleRankingPlayers.map((player, index) => (
                    <TableRow
                      className="border-t border-[var(--homepage-panel-divider-soft)] text-[var(--homepage-panel-text)] even:bg-[rgba(247,247,247,0.65)]"
                      key={`${player.clubShortName}-${player.playerName}`}
                    >
                      <TableCell>
                        <span className="inline-flex min-w-12 items-center justify-center rounded-full bg-[var(--homepage-highlight-start)] px-3 py-1 text-sm font-black text-[var(--homepage-highlight-value)]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </TableCell>

                      <TableCell>
                        <RankingPlayerCell
                          clubImageUrl={player.clubImageUrl}
                          clubShortName={player.clubShortName}
                          playerName={player.playerName}
                          totalGoals={player.totalGoals}
                        />
                      </TableCell>

                      <TableCell>
                        <span className="text-xl font-black text-[var(--homepage-record-value)]">
                          {player.totalGoals}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {hasMorePlayersToShow ? (
              <div className="mt-4 flex justify-center">
                <Button
                  className="rounded-full px-5 py-3 text-sm"
                  onClick={handleLoadMorePlayers}
                  radius="full"
                  variant="secondary"
                >
                  Carregar mais 20
                </Button>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </PanelCard>
  );
}
