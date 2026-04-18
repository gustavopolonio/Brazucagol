import { ChevronLeft, ChevronRight } from "lucide-react";

import { RoundsIconButton } from "@/components/rounds/RoundsIconButton";
import { RoundsMonthCalendar } from "@/components/rounds/RoundsMonthCalendar";
import { formatMonthTitle } from "@/components/rounds/rounds-formatters";
import type { RoundSchedule } from "@/components/rounds/rounds-data";
import { RoundsSecondaryButton } from "@/components/rounds/RoundsSecondaryButton";
import { RoundsViewModeToggle } from "@/components/rounds/RoundsViewModeToggle";
import type { ViewMode } from "@/components/rounds/rounds-view-mode";

export function RoundsMonthView({
  currentRound,
  onChangeMonth,
  onRoundSelect,
  onSelectCurrentMonth,
  onViewModeChange,
  roundsByKey,
  selectedMonth,
  selectedRound,
  viewMode,
}: Readonly<{
  currentRound: RoundSchedule;
  onChangeMonth: (direction: -1 | 1) => void;
  onRoundSelect: (round: RoundSchedule) => void;
  onSelectCurrentMonth: () => void;
  onViewModeChange: (viewMode: ViewMode) => void;
  roundsByKey: Map<string, RoundSchedule>;
  selectedMonth: Date;
  selectedRound: RoundSchedule;
  viewMode: ViewMode;
}>) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[var(--rounds-divider)] bg-[linear-gradient(180deg,var(--rounds-surface-strong)_0%,var(--rounds-surface-soft)_100%)] text-[var(--rounds-text-primary)] shadow-[0_16px_32px_var(--rounds-shell-shadow)]">
      <div className="flex flex-col gap-4 px-4 pt-4 pb-7 md:px-5">
        <div className="flex items-center gap-4">
          <RoundsSecondaryButton className="uppercase" onClick={onSelectCurrentMonth}>
            Hoje
          </RoundsSecondaryButton>

          <div className="flex items-center gap-2">
            <RoundsIconButton
              ariaLabel="Mês anterior"
              icon={<ChevronLeft />}
              onClick={() => onChangeMonth(-1)}
            />
            <RoundsIconButton
              ariaLabel="Próximo mês"
              icon={<ChevronRight />}
              onClick={() => onChangeMonth(1)}
            />
          </div>

          <h2 className="text-2xl font-black tracking-[0.08em]">
            {formatMonthTitle(selectedMonth)}
          </h2>

          <div className="ml-auto">
            <RoundsViewModeToggle onViewModeChange={onViewModeChange} viewMode={viewMode} />
          </div>
        </div>

        <p className="text-center text-sm leading-6 text-[var(--rounds-text-secondary)]">
          Cada bloco representa a rodada que abre naquele dia às 19:00. Clique em qualquer data
          para abrir a agenda detalhada.
        </p>
      </div>

      <RoundsMonthCalendar
        currentRound={currentRound}
        onRoundSelect={onRoundSelect}
        roundsByKey={roundsByKey}
        selectedMonth={selectedMonth}
        selectedRound={selectedRound}
      />
    </section>
  );
}
