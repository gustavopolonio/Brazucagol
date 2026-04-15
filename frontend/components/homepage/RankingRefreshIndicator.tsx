"use client";

import { useEffect, useState } from "react";

import type { RankingRefreshData } from "@/components/homepage/homepage-types";

export function RankingRefreshIndicator({
  refreshData,
}: Readonly<{
  refreshData: RankingRefreshData;
}>) {
  const [currentTimestamp, setCurrentTimestamp] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTimestamp(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const refreshIntervalMilliseconds = refreshData.refreshIntervalSeconds * 1000;
  const millisecondsIntoCycle = currentTimestamp % refreshIntervalMilliseconds;
  const millisecondsUntilNextRefresh = refreshIntervalMilliseconds - millisecondsIntoCycle;
  const refreshProgressPercent = (millisecondsIntoCycle / refreshIntervalMilliseconds) * 100;
  const secondsUntilNextRefresh = Math.max(0, Math.ceil(millisecondsUntilNextRefresh / 1000));

  return (
    <div className="mt-4 rounded-[16px] border border-[var(--homepage-refresh-border)] bg-[linear-gradient(180deg,var(--homepage-refresh-start)_0%,var(--homepage-refresh-end)_100%)] px-4 py-3 shadow-[0_1px_0_var(--homepage-refresh-inset)_inset]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] font-black tracking-[0.08em] text-[var(--homepage-highlight-label)]">
          Artilharia da hora, rodada e temporada
        </p>
        <p className="text-[12px] font-black tracking-[0.08em] text-[var(--homepage-highlight-label)]">
          Atualiza em {secondsUntilNextRefresh}s
        </p>
      </div>

      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full border border-[var(--homepage-refresh-track-border)] bg-[var(--homepage-refresh-track)]">
        <div
          className="h-full bg-[linear-gradient(90deg,var(--homepage-refresh-progress-start)_0%,var(--homepage-refresh-progress-end)_100%)] transition-[width] duration-1000 ease-linear"
          style={{ width: `${refreshProgressPercent}%` }}
        />
      </div>
    </div>
  );
}
