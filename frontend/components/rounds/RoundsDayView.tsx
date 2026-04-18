import { ChevronLeft, ChevronRight } from "lucide-react";

import { RoundMatchCard } from "@/components/rounds/RoundMatchCard";
import { RoundsControlButton } from "@/components/rounds/RoundsControlButton";
import { RoundsSecondaryButton } from "@/components/rounds/RoundsSecondaryButton";
import { RoundsViewModeToggle } from "@/components/rounds/RoundsViewModeToggle";
import type { RoundSchedule } from "@/components/rounds/rounds-data";
import type { ViewMode } from "@/components/rounds/rounds-view-mode";
import { SelectedRoundSummary } from "@/components/rounds/SelectedRoundSummary";

export function RoundsDayView({
  onChangeRound,
  onSelectCurrentRound,
  onViewModeChange,
  selectedCompetition,
  selectedRound,
  viewMode,
}: Readonly<{
  onChangeRound: (direction: -1 | 1) => void;
  onSelectCurrentRound: () => void;
  onViewModeChange: (viewMode: ViewMode) => void;
  selectedCompetition?: RoundSchedule["activeCompetitions"][number];
  selectedRound: RoundSchedule;
  viewMode: ViewMode;
}>) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-5 rounded-[28px] border border-[var(--rounds-divider)] bg-[linear-gradient(180deg,var(--rounds-surface-strong)_0%,var(--rounds-surface-soft)_100%)] px-4 py-4 text-[var(--rounds-text-primary)] shadow-[0_16px_32px_var(--rounds-shell-shadow)] md:px-5">
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <RoundsControlButton
              icon={<ChevronLeft className="h-4 w-4" />}
              label="Rodada anterior"
              onClick={() => onChangeRound(-1)}
            />
            <RoundsSecondaryButton active={selectedRound.isCurrentRound} onClick={onSelectCurrentRound}>
              Rodada atual
            </RoundsSecondaryButton>
            <RoundsControlButton
              icon={<ChevronRight className="h-4 w-4" />}
              iconPosition="end"
              label="Próxima rodada"
              onClick={() => onChangeRound(1)}
            />
          </div>

          <RoundsViewModeToggle onViewModeChange={onViewModeChange} viewMode={viewMode} />
        </div>

        <SelectedRoundSummary
          selectedCompetition={selectedCompetition}
          selectedRound={selectedRound}
        />
      </div>

      {selectedRound.matches.map((match) => (
        <RoundMatchCard key={match.id} match={match} />
      ))}
    </section>
  );
}
