import { ClubPanel } from "@/components/rounds/ClubPanel";
import { CompetitionChip } from "@/components/rounds/CompetitionChip";
import { MatchStatusBadge } from "@/components/rounds/MatchStatusBadge";
import type { RoundMatch } from "@/components/rounds/rounds-data";
import { ScorePanel } from "@/components/rounds/ScorePanel";

export function RoundMatchCard({
  match,
}: Readonly<{
  match: RoundMatch;
}>) {
  return (
    <article className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,var(--homepage-logo-frame-top)_0%,var(--homepage-logo-frame-upper-mid)_20%,var(--homepage-logo-frame-mid)_48%,var(--homepage-logo-frame-lower-mid)_78%,var(--homepage-logo-frame-bottom)_100%)] p-[4px] shadow-[0_20px_34px_var(--homepage-logo-frame-shadow)]">
      <div className="pointer-events-none absolute inset-[4px] rounded-[24px] bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,transparent_26%,transparent_72%,rgba(255,255,255,0.08)_100%)]" />
      <div className="relative flex flex-col items-center overflow-hidden rounded-[24px] border border-[var(--homepage-logo-screen-border)] bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12)_0%,transparent_28%),repeating-linear-gradient(135deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_8px,transparent_8px,transparent_16px),linear-gradient(180deg,var(--homepage-counter-screen-start)_0%,var(--homepage-logo-screen-background)_100%)] px-4 py-4 shadow-[inset_0_1px_0_var(--homepage-logo-screen-inset-top),inset_0_-8px_18px_var(--homepage-logo-screen-inset-bottom)] md:px-5 md:py-5">
        <CompetitionChip
          accentEnd={match.competition.accentEnd}
          accentStart={match.competition.accentStart}
          competitionName={match.competition.name}
          stageLabel={match.competition.stageLabel}
          textColor={match.competition.textColor}
        />

        <div className="mt-2">
          <MatchStatusBadge status={match.status} />
        </div>

        <div className="grid w-full items-center gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <ClubPanel align="left" club={match.homeClub} />
          <ScorePanel match={match} />
          <ClubPanel align="right" club={match.awayClub} />
        </div>
      </div>
    </article>
  );
}
