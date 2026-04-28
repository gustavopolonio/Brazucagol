import Image from "next/image";
import { ChartColumn, History } from "lucide-react";

import { LevelIconBadge } from "@/components/layout/LevelIconBadge";
import { ProgressBar } from "@/components/layout/ProgressBar";
import type { PlayerProfileData } from "@/components/profile/profileTypes";
import {
  calculateConversionPercent,
  getTopRankBallImage,
  numberFormatter,
} from "@/components/profile/profileUtils";

export function ProfileStatsSection({
  profileData,
}: Readonly<{
  profileData: PlayerProfileData;
}>) {
  const topRankBallImage = getTopRankBallImage(profileData.overallTopRank);

  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <div className="flex min-w-0 items-center gap-3 rounded-[22px] border border-(--homepage-panel-divider) bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,245,245,0.94)_100%)] py-2.5 pl-2 pr-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_12px_24px_rgba(73,54,20,0.05)]">
            <LevelIconBadge
              icon={profileData.level.icon}
              variant="softAccent"
              className="h-11 w-11 shrink-0 rounded-[16px]"
              iconClassName="h-6 w-6"
            />

            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-(--homepage-panel-text-muted)">
                Nível Atual
              </p>
              <span className="truncate font-black uppercase tracking-[0.08em] text-(--homepage-panel-text-strong)">
                {profileData.level.name}
                {" "}-{" "}
                {profileData.level.number}
              </span>
            </div>
          </div>

          {profileData.overallTopRank ? (
            <p className="inline-flex w-fit whitespace-nowrap rounded-full border border-(--homepage-highlight-border) bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(238,248,208,0.94)_100%)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--rounds-highlight-text)] shadow-[0_1px_0_var(--homepage-highlight-inset)_inset,0_8px_18px_rgba(0,0,0,0.12)]">
              Top geral: {numberFormatter.format(profileData.overallTopRank)}
            </p>
          ) : null}
        </div>
        {topRankBallImage && profileData.overallTopRank ? (
          <div className="group/top-rank relative flex flex-col items-center justify-center pb-2 mt-4">
            <div className="z-10 pointer-events-none absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-(--homepage-highlight-border) bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(238,248,208,0.94)_100%)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--rounds-highlight-text)] opacity-0 shadow-[0_1px_0_var(--homepage-highlight-inset)_inset,0_8px_18px_rgba(0,0,0,0.12)] transition-all duration-200 ease-out group-hover/top-rank:translate-y-1 group-hover/top-rank:opacity-100 group-focus-within/top-rank:translate-y-1 group-focus-within/top-rank:opacity-100">
              Top {numberFormatter.format(profileData.overallTopRank)} geral
            </div>
            <div className="relative flex items-center justify-center">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-[calc(100%_+_4px)] left-1/2 h-2.5 w-8 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(20,36,18,0.34)_0%,rgba(20,36,18,0.14)_52%,rgba(20,36,18,0)_78%)] blur-[1px] opacity-75 animate-[pulse_2.6s_ease-in-out_infinite]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-[calc(100%_+_6px)] left-1/2 h-2 w-6 -translate-x-1/2 rounded-full bg-white/30 blur-[6px] opacity-45"
              />
              <Image
                alt={`Bola de premiação do top ${profileData.overallTopRank}`}
                className="relative z-10 h-auto w-10 animate-[spin_7.4s_linear_infinite]"
                src={topRankBallImage}
                height={52}
                width={52}
              />
            </div>
          </div>
        ) : null}
      </section>

      <section className="space-y-8">
        <div className="space-y-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
          <div className="flex items-center justify-center gap-2 text-(--homepage-record-label)">
            <History className="h-4 w-4" strokeWidth={2.4} />
            <p className="text-center text-[14px] font-black uppercase tracking-[0.16em]">
              Histórico
            </p>
          </div>

          <dl className="space-y-1">
            {profileData.kickSummaryStats.map((kickSummaryStat) => (
              <div
                className="flex items-center justify-between gap-4 rounded-2xl border border-(--homepage-panel-divider-soft) px-3 py-2"
                key={kickSummaryStat.label}
              >
                <dt className="text-[13px] font-black uppercase tracking-[0.1em] text-(--homepage-panel-text-muted)">
                  {kickSummaryStat.label}
                </dt>
                <dd className="text-[16px] font-black uppercase tracking-[0.03em] text-(--homepage-record-value)">
                  {kickSummaryStat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-(--homepage-record-label)">
            <ChartColumn className="h-4 w-4" strokeWidth={2.4} />
            <p className="text-sm text-center font-black uppercase tracking-[0.16em]">
              Aproveitamento
            </p>
          </div>

          <div className="space-y-3">
            {profileData.conversionMetrics.map((conversionMetric) => {
              const conversionPercent = calculateConversionPercent(
                conversionMetric.convertedGoals,
                conversionMetric.totalTries,
              );

              return (
                <div
                  className="rounded-2xl border border-(--homepage-panel-divider-soft) px-3 py-2"
                  key={conversionMetric.label}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[13px] font-black uppercase tracking-[0.1em] text-(--homepage-panel-text-muted)">
                      {conversionMetric.label}
                    </p>
                    <p className="text-[14px] font-black uppercase tracking-[0.03em] text-(--homepage-record-value)">
                      {numberFormatter.format(conversionMetric.convertedGoals)}/
                      {numberFormatter.format(conversionMetric.totalTries)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <ProgressBar className="h-2.5 flex-1" progressPercent={conversionPercent} />
                    <span className="w-14 text-right text-[15px] font-black uppercase tracking-[0.03em] text-[var(--homepage-highlight-label)]">
                      {conversionPercent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
