import type { AwardCompetition } from "@/components/awards/awards-data";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { cn } from "@/lib/cn";

type AwardsTableProps = {
  competitions: AwardCompetition[];
  emptyVipLabel?: string;
  showCompetitionHeader?: boolean;
};

export function AwardsTable({
  competitions,
  emptyVipLabel = "-",
  showCompetitionHeader = false,
}: Readonly<AwardsTableProps>) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5",
        competitions.length > 1 && "xl:grid-cols-2",
      )}
    >
      {competitions.map((competition) => (
        <article
          key={competition.title}
          className="overflow-hidden rounded-[24px] border border-[var(--homepage-panel-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,247,247,0.96)_100%)] shadow-[0_18px_36px_rgba(73,54,20,0.09)]"
        >
          {showCompetitionHeader ? (
            <div className="border-b border-[var(--homepage-panel-divider)] bg-[linear-gradient(135deg,rgba(132,212,0,0.16)_0%,rgba(255,214,102,0.18)_100%)] px-5 py-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--homepage-highlight-label)]">
                {competition.subtitle}
              </p>
              <h3 className="mt-1 text-xl font-black text-[var(--homepage-panel-text-strong)]">
                {competition.title}
              </h3>
            </div>
          ) : null}

          <TableContainer className="rounded-none border-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-[linear-gradient(180deg,rgba(247,247,247,0.95)_0%,rgba(238,248,208,0.72)_100%)] text-[var(--homepage-panel-text-strong)]">
                  <TableHead>Colocação</TableHead>
                  <TableHead>VIP</TableHead>
                  <TableHead>Moedas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competition.rows.map((row) => (
                  <TableRow
                    className="border-t border-[var(--homepage-panel-divider-soft)] text-[var(--homepage-panel-text)] even:bg-[rgba(247,247,247,0.65)]"
                    key={`${competition.title}-${row.placement}`}
                  >
                    <TableCell>
                      <span className="inline-flex min-w-16 items-center justify-center rounded-full bg-[var(--homepage-highlight-start)] px-3 py-1 text-sm font-black text-[var(--homepage-highlight-value)]">
                        {row.placement}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-black text-[var(--homepage-panel-text-strong)]">
                      {row.vipReward === "-" ? emptyVipLabel : row.vipReward}
                    </TableCell>
                    <TableCell>
                      <span className="text-lg font-black text-[var(--homepage-record-value)]">
                        {row.coins}
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
  );
}
