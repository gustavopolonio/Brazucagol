import { cn } from "@/lib/cn";

import { MonthCompetitionCard } from "@/components/rounds/MonthCompetitionCard";
import { isSameMonth, type RoundSchedule } from "@/components/rounds/rounds-data";

export function RoundsMonthDayButton({
  calendarDate,
  currentRound,
  onRoundSelect,
  round,
  selectedMonth,
  selectedRound,
}: Readonly<{
  calendarDate: Date;
  currentRound: RoundSchedule;
  onRoundSelect: (round: RoundSchedule) => void;
  round?: RoundSchedule;
  selectedMonth: Date;
  selectedRound: RoundSchedule;
}>) {
  const isInsideSelectedMonth = isSameMonth(calendarDate, selectedMonth);
  const isSelectedRound = round ? round.roundKey === selectedRound.roundKey : false;
  const isCurrentRoundDay = round ? round.roundKey === currentRound.roundKey : false;

  return (
    <button
      className={cn(
        "space-y-3 cursor-pointer min-h-[160px] border-b border-r border-[var(--rounds-divider)] px-2 py-2 text-left transition hover:bg-[var(--rounds-surface-muted)] md:px-3 md:py-3",
        isInsideSelectedMonth ? "bg-transparent" : "bg-[rgba(0,0,0,0.03)] text-[var(--rounds-text-muted)]",
        isSelectedRound ? "bg-[linear-gradient(180deg,rgba(217,255,147,0.6)_0%,rgba(59,130,246,0.1)_100%)]" : ""
      )}
      onClick={() => {
        if (round) {
          onRoundSelect(round);
        }
      }}
      type="button"
    >
      <span
        className={cn(
          "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-black",
          isCurrentRoundDay
            ? "bg-[linear-gradient(135deg,var(--rounds-live-start)_0%,var(--rounds-live-end)_100%)] text-white shadow-[0_10px_20px_var(--rounds-live-shadow)]"
            : "bg-[var(--rounds-surface-muted)] text-[var(--rounds-text-primary)]"
        )}
      >
        {calendarDate.getDate()}
      </span>

      {round ? (
        <div className="space-y-2">
          {round.activeCompetitions.slice(0, 2).map((competition) => (
            <MonthCompetitionCard
              competition={competition}
              key={`${round.roundKey}-${competition.id}`}
            />
          ))}
        </div>
      ) : null}
    </button>
  );
}
