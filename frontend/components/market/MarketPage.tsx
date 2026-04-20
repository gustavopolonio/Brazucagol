"use client";

import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";

import { MarketClubCell } from "@/components/market/MarketClubCell";
import { marketTransfers } from "@/components/market/market-data";
import { MarketPlayerCell } from "@/components/market/MarketPlayerCell";
import { PanelCard } from "@/components/layout/PanelCard";
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

const TRANSFERS_PER_PAGE = 20;

export function MarketPage() {
  const [visibleTransfersCount, setVisibleTransfersCount] = useState(TRANSFERS_PER_PAGE);

  const visibleMarketTransfers = marketTransfers.slice(0, visibleTransfersCount);
  const hasMoreTransfersToShow = visibleTransfersCount < marketTransfers.length;

  function handleLoadMoreTransfers() {
    setVisibleTransfersCount((currentVisibleTransfersCount) =>
      Math.min(currentVisibleTransfersCount + TRANSFERS_PER_PAGE, marketTransfers.length),
    );
  }

  return (
    <PanelCard
      title={
        <span className="inline-flex items-center gap-2">
          <ArrowRightLeft className="h-4 w-4" />
          Central do Mercado
        </span>
      }
    >
      <main className="rounded-b-[18px] border border-border bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-soft)_100%)] px-4 pt-10 pb-4 opacity-95">
        <section className="overflow-hidden rounded-[28px] border border-[var(--homepage-panel-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,245,245,0.98)_100%)] shadow-[0_20px_38px_rgba(73,54,20,0.12)]">
          <div className="border-b border-[var(--homepage-panel-divider)] bg-[linear-gradient(135deg,rgba(132,212,0,0.18)_0%,rgba(78,182,255,0.16)_100%)] px-5 py-5 md:px-7">
            <div className="flex flex-col gap-3">
              <div className="inline-flex w-fit items-center gap-3 rounded-full bg-white/80 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
                <ArrowRightLeft className="h-5 w-5 text-[var(--homepage-highlight-label)]" />
                <span className="text-sm font-black uppercase tracking-[0.16em] text-[var(--homepage-highlight-label)]">
                  Últimas movimentações
                </span>
              </div>
              <p className="text-sm font-semibold text-[var(--homepage-panel-text)] md:text-base">
                Acompanhe as trocas de clube mais recentes e veja quem está saindo, chegando e
                movimentando o mercado do Brazucagol.
              </p>
            </div>
          </div>

          <div className="px-3 py-3 md:px-5 md:py-5">
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow className="bg-[linear-gradient(180deg,rgba(247,247,247,0.95)_0%,rgba(238,248,208,0.75)_100%)] text-[var(--homepage-panel-text-strong)]">
                    <TableHead>Data</TableHead>
                    <TableHead>Jogador</TableHead>
                    <TableHead>Saindo</TableHead>
                    <TableHead>Chegando</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {visibleMarketTransfers.map((marketTransfer) => (
                    <TableRow
                      className="border-t border-[var(--homepage-panel-divider-soft)] text-[var(--homepage-panel-text)] even:bg-[rgba(247,247,247,0.65)]"
                      key={`${marketTransfer.movedAt}-${marketTransfer.playerName}`}
                    >
                      <TableCell>
                        <span className="text-sm font-black text-[var(--homepage-panel-text-strong)]">
                          {marketTransfer.movedAt}
                        </span>
                      </TableCell>

                      <TableCell>
                        <MarketPlayerCell
                          playerName={marketTransfer.playerName}
                          totalGoals={marketTransfer.totalGoals}
                        />
                      </TableCell>

                      <TableCell>
                        <MarketClubCell
                          clubImageUrl={marketTransfer.previousClubImageUrl}
                          clubName={marketTransfer.previousClubName}
                          clubShortName={marketTransfer.previousClubShortName}
                          showDepartureIndicator
                        />
                      </TableCell>

                      <TableCell>
                        <MarketClubCell
                          clubImageUrl={marketTransfer.arrivedClubImageUrl}
                          clubName={marketTransfer.arrivedClubName}
                          clubShortName={marketTransfer.arrivedClubShortName}
                          showArrivalIndicator
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {hasMoreTransfersToShow ? (
              <div className="mt-4 flex justify-center">
                <Button
                  className="rounded-full px-5 py-3 text-sm font-black"
                  onClick={handleLoadMoreTransfers}
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
