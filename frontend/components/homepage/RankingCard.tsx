import { ClubBadge } from "@/components/layout/ClubBadge";
import { PanelCard } from "@/components/layout/PanelCard";
import type { RankingEntry, RecordCardData } from "@/components/homepage/homepage-types";
import { cn } from "@/lib/cn";

export function RankingCard({
  title,
  entries,
  record,
}: Readonly<{
  title: string;
  entries: RankingEntry[];
  record?: RecordCardData;
}>) {
  return (
    <PanelCard title={title}>
      <div className="rounded-b-[18px] border border-border bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-soft)_100%)] py-2 opacity-95">
        <div className="divide-y divide-(--homepage-panel-divider-soft)">
          {entries.map((entry, i) => (
            <div
              className={cn(
                "grid grid-cols-[30px_34px_minmax(0,1fr)_52px] items-center px-4 py-1.5 transition hover:bg-(--homepage-panel-hover)",
                i === 0 && "pt-4",
              )}
              key={`${title}-${entry.position}-${entry.playerName}`}
            >
              <span className="text-[13px] font-black text-muted-foreground">{entry.position}</span>
              <ClubBadge
                shortName={entry.clubShortName}
                imageUrl={entry.clubImageUrl}
                size="small"
              />
              <span className="ml-1 truncate px-1 text-[13px] font-black text-(--homepage-row-name)">{entry.playerName}</span>
              <span className="text-right text-[13px] font-black text-(--homepage-panel-text-soft)">{entry.score}</span>
            </div>
          ))}
        </div>

        {record ? (
          <div className="mx-2 mt-3 rounded-2xl border border-(--homepage-highlight-border) bg-[linear-gradient(180deg,var(--homepage-highlight-start)_0%,var(--homepage-highlight-end)_100%)] px-2 py-2 shadow-[0_1px_0_var(--homepage-highlight-inset)_inset]">
            <p className="px-1 pb-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-(--homepage-highlight-label)">
              {record.title}
            </p>
            <div className="grid grid-cols-[34px_minmax(0,1fr)_52px] items-center gap-0.5">
              <ClubBadge
                shortName={record.clubShortName}
                imageUrl={record.clubImageUrl}
                size="small"
              />
              <span className="truncate px-1 text-[13px] font-black text-(--homepage-row-name)">{record.playerName}</span>
              <span className="text-right text-[13px] font-black text-(--homepage-highlight-value)">{record.goals}</span>
            </div>
          </div>
        ) : null}
      </div>
    </PanelCard>
  );
}
