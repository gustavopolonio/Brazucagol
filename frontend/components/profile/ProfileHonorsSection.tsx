import { ArrowRightLeft, Medal, Shield, Trophy } from "lucide-react";

import { MarketClubCell } from "@/components/market/MarketClubCell";
import type { PlayerProfileData } from "@/components/profile/profileTypes";
import {
  formatPlacementLabel,
  formatSeasonLabel,
  numberFormatter,
  renderPlacementIcon,
} from "@/components/profile/profileUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

export function ProfileHonorsSection({
  profileData,
}: Readonly<{
  profileData: PlayerProfileData;
}>) {
  const seasonTopFinishes = [...profileData.individualSeasonTopFinishes].sort(
    (firstSeasonTopFinish, secondSeasonTopFinish) =>
      secondSeasonTopFinish.seasonNumber - firstSeasonTopFinish.seasonNumber,
  );
  const rankingHistoryTables = [
    {
      title: "Top Hora",
      entries: profileData.rankingHistory.topHora,
      totalTopAppearances: profileData.rankingHistory.topHora.reduce(
        (totalTopAppearances, rankingHistoryEntry) =>
          totalTopAppearances + rankingHistoryEntry.totalTimes,
        0,
      ),
    },
    {
      title: "Top Rodada",
      entries: profileData.rankingHistory.topRodada,
      totalTopAppearances: profileData.rankingHistory.topRodada.reduce(
        (totalTopAppearances, rankingHistoryEntry) =>
          totalTopAppearances + rankingHistoryEntry.totalTimes,
        0,
      ),
    },
    {
      title: "Top Temporada",
      entries: profileData.rankingHistory.topTemporada,
      totalTopAppearances: profileData.rankingHistory.topTemporada.reduce(
        (totalTopAppearances, rankingHistoryEntry) =>
          totalTopAppearances + rankingHistoryEntry.totalTimes,
        0,
      ),
    },
  ];

  return (
    <section className="mt-6 space-y-4 rounded-[18px] border border-(--homepage-panel-divider) bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-soft)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
      <div className="flex items-center justify-center gap-3 text-(--homepage-panel-text)">
        <Trophy className="h-5 w-5 text-[var(--homepage-highlight-label)]" strokeWidth={2.4} />
        <p className="text-[14px] font-black uppercase tracking-[0.16em] text-(--homepage-record-label)">
          Sala de troféus
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-[18px] border border-(--homepage-panel-divider-soft) bg-white/85 p-4">
          <div className="flex items-center gap-2">
            <Medal className="h-5 w-5 text-[var(--homepage-highlight-label)]" strokeWidth={2.4} />
            <p className="text-[12px] font-black uppercase tracking-[0.16em] text-(--homepage-record-label)">
                Individual
            </p>
          </div>

          {seasonTopFinishes.length > 0 ? (
            <div className="space-y-2">
              {seasonTopFinishes.map((seasonTopFinish) => (
                <div
                  className="flex items-center justify-between rounded-2xl border border-(--homepage-panel-divider-soft) bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(238,248,208,0.7)_100%)] px-3 py-2"
                  key={`${seasonTopFinish.seasonNumber}-${seasonTopFinish.placement}`}
                >
                  <span className="text-[13px] font-black uppercase tracking-[0.08em] text-(--homepage-panel-text)">
                    Top {seasonTopFinish.placement}
                  </span>
                  <span className="text-[13px] font-black uppercase tracking-[0.08em] text-(--homepage-highlight-label)">
                    {formatSeasonLabel(seasonTopFinish.seasonNumber)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-semibold text-(--homepage-panel-text-soft)">
              Ainda sem presença no top 10 das temporadas.
            </p>
          )}
        </div>

        <div className="space-y-3 rounded-[18px] border border-(--homepage-panel-divider-soft) bg-white/85 p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[var(--homepage-highlight-label)]" strokeWidth={2.4} />
            <p className="text-[12px] font-black uppercase tracking-[0.16em] text-(--homepage-record-label)">
                Coletivo
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-2xl border border-(--homepage-panel-divider-soft) bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(238,248,208,0.7)_100%)] px-3 py-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-[#d4a017]" strokeWidth={2.4} />
                <span className="text-[13px] font-black uppercase tracking-[0.08em] text-(--homepage-panel-text)">
                  Liga Brazucagol
                </span>
              </div>
              <span className="text-[16px] font-black uppercase tracking-[0.03em] text-(--homepage-record-value)">
                {numberFormatter.format(profileData.clubAchievementCounts.leagueTitles)}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-(--homepage-panel-divider-soft) bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(238,248,208,0.7)_100%)] px-3 py-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-[#1f9d55]" strokeWidth={2.4} />
                <span className="text-[13px] font-black uppercase tracking-[0.08em] text-(--homepage-panel-text)">
                  Copa Brasil
                </span>
              </div>
              <span className="text-[16px] font-black uppercase tracking-[0.03em] text-(--homepage-record-value)">
                {numberFormatter.format(profileData.clubAchievementCounts.copaBrasilTitles)}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-(--homepage-panel-divider-soft) bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(238,248,208,0.7)_100%)] px-3 py-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-[#2563eb]" strokeWidth={2.4} />
                <span className="text-[13px] font-black uppercase tracking-[0.08em] text-(--homepage-panel-text)">
                  Copa Brazucagol
                </span>
              </div>
              <span className="text-[16px] font-black uppercase tracking-[0.03em] text-(--homepage-record-value)">
                {numberFormatter.format(profileData.clubAchievementCounts.copaBrazucagolTitles)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center gap-3 text-(--homepage-panel-text)">
        <Trophy className="h-5 w-5 text-[var(--homepage-highlight-label)]" strokeWidth={2.4} />
        <p className="text-[14px] font-black uppercase tracking-[0.16em] text-(--homepage-record-label)">
          Histórico de artilharias
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {rankingHistoryTables.map((rankingHistoryTable) => (
          <article
            className="overflow-hidden rounded-[24px] border border-[var(--homepage-panel-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,247,247,0.96)_100%)] shadow-[0_18px_36px_rgba(73,54,20,0.09)]"
            key={rankingHistoryTable.title}
          >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--homepage-panel-divider)] bg-[linear-gradient(135deg,rgba(132,212,0,0.16)_0%,rgba(255,214,102,0.18)_100%)] px-5 py-4 pr-2">
              <h3 className="text-xl font-black text-[var(--homepage-panel-text-strong)]">
                {rankingHistoryTable.title}
              </h3>
              <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-[var(--homepage-highlight-start)] px-3 py-1 font-black text-[var(--homepage-highlight-value)]">
                {numberFormatter.format(rankingHistoryTable.totalTopAppearances)}
              </span>
            </div>

            <TableContainer className="rounded-none border-0">
              <Table>
                <TableBody>
                  {rankingHistoryTable.entries.map((rankingHistoryEntry) => (
                    <TableRow
                      className="border-t border-[var(--homepage-panel-divider-soft)] text-[var(--homepage-panel-text)] even:bg-[rgba(247,247,247,0.65)]"
                      key={`${rankingHistoryTable.title}-${rankingHistoryEntry.placement}`}
                    >
                      <TableCell>
                        <span className="inline-flex min-w-20 items-center justify-center gap-1.5 rounded-full bg-[var(--homepage-highlight-start)] px-3 py-1 text-sm font-black text-[var(--homepage-highlight-value)]">
                          {renderPlacementIcon(rankingHistoryEntry.placement)}
                          {formatPlacementLabel(rankingHistoryEntry.placement)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-lg font-black text-[var(--homepage-record-value)]">
                          {numberFormatter.format(rankingHistoryEntry.totalTimes)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </article>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-center gap-3 text-(--homepage-panel-text)">
        <ArrowRightLeft className="h-5 w-5 text-[var(--homepage-highlight-label)]" strokeWidth={2.4} />
        <p className="text-[14px] font-black uppercase tracking-[0.16em] text-(--homepage-record-label)">
          Histórico de transferências
        </p>
      </div>

      <section className="overflow-hidden rounded-[24px] border border-[var(--homepage-panel-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,245,245,0.98)_100%)] shadow-[0_20px_38px_rgba(73,54,20,0.12)]">
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow className="bg-[linear-gradient(180deg,rgba(247,247,247,0.95)_0%,rgba(238,248,208,0.75)_100%)] text-[var(--homepage-panel-text-strong)]">
                <TableHead>Data</TableHead>
                <TableHead>Saindo</TableHead>
                <TableHead>Chegando</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {profileData.transferHistory.map((transferHistoryEntry) => (
                <TableRow
                  className="border-t border-[var(--homepage-panel-divider-soft)] text-[var(--homepage-panel-text)] even:bg-[rgba(247,247,247,0.65)]"
                  key={`${transferHistoryEntry.movedAt}-${transferHistoryEntry.previousClubShortName}-${transferHistoryEntry.arrivedClubShortName}`}
                >
                  <TableCell>
                    <span className="text-sm font-black text-[var(--homepage-panel-text-strong)]">
                      {transferHistoryEntry.movedAt}
                    </span>
                  </TableCell>

                  <TableCell>
                    <MarketClubCell
                      clubImageUrl={transferHistoryEntry.previousClubImageUrl}
                      clubName={transferHistoryEntry.previousClubName}
                      clubShortName={transferHistoryEntry.previousClubShortName}
                      showDepartureIndicator
                    />
                  </TableCell>

                  <TableCell>
                    <MarketClubCell
                      clubImageUrl={transferHistoryEntry.arrivedClubImageUrl}
                      clubName={transferHistoryEntry.arrivedClubName}
                      clubShortName={transferHistoryEntry.arrivedClubShortName}
                      showArrivalIndicator
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>
    </section>
  );
}
