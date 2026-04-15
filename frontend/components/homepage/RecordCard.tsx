import { PanelCard } from "@/components/layout/PanelCard";
import type { RecordCardData } from "@/components/homepage/homepage-types";

export function RecordCard({ record }: Readonly<{ record: RecordCardData }>) {
  return (
    <PanelCard title={record.title}>
      <div className="rounded-[18px] border border-border bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-muted)_100%)] p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--homepage-record-label)]">Destaque da temporada</p>
        <div className="mt-3 rounded-[16px] border border-[var(--homepage-surface-inner-border)] bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-subtle)_100%)] p-4">
          <p className="text-[14px] font-black uppercase tracking-[0.08em] text-[var(--homepage-panel-text-strong)]">{record.playerName}</p>
          <p className="mt-2 text-3xl font-black uppercase tracking-[0.04em] text-[var(--homepage-record-value)]">{record.goals}</p>
          <p className="mt-2 text-[11px] font-black uppercase tracking-[0.12em] text-muted-foreground">
            Clube: <span className="text-[var(--homepage-record-supporting)]">{record.clubShortName}</span>
          </p>
        </div>
      </div>
    </PanelCard>
  );
}
