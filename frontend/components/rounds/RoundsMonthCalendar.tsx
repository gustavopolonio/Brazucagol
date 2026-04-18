import {
  buildMonthGrid,
  getRoundKeyFromDate,
  isSameMonth,
  weekdayLabels,
  type RoundSchedule,
} from "@/components/rounds/rounds-data";
import { RoundsMonthDayButton } from "@/components/rounds/RoundsMonthDayButton";

export function RoundsMonthCalendar({
  currentRound,
  onRoundSelect,
  roundsByKey,
  selectedMonth,
  selectedRound,
}: Readonly<{
  currentRound: RoundSchedule;
  onRoundSelect: (round: RoundSchedule) => void;
  roundsByKey: Map<string, RoundSchedule>;
  selectedMonth: Date;
  selectedRound: RoundSchedule;
}>) {
  const monthDays = buildMonthGrid(selectedMonth)
    .reduce<Date[][]>((calendarWeeks, calendarDate, calendarDateIndex) => {
      const weekIndex = Math.floor(calendarDateIndex / 7);

      if (!calendarWeeks[weekIndex]) {
        calendarWeeks[weekIndex] = [];
      }

      calendarWeeks[weekIndex].push(calendarDate);
      return calendarWeeks;
    }, [])
    .filter((calendarWeek) => calendarWeek.some((calendarDate) => isSameMonth(calendarDate, selectedMonth)))
    .flat();

  return (
    <>
      <div className="grid grid-cols-7 border-t border-b border-[var(--rounds-divider)] bg-[var(--rounds-surface-muted)]">
        {weekdayLabels.map((weekdayLabel) => (
          <div
            className="px-2 py-3 text-center text-[11px] font-black uppercase tracking-[0.16em] text-[var(--rounds-text-muted)] md:px-3"
            key={weekdayLabel}
          >
            {weekdayLabel}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {monthDays.map((calendarDate) => {
          const roundKey = getRoundKeyFromDate(calendarDate);
          const round = roundsByKey.get(roundKey);

          return (
            <RoundsMonthDayButton
              calendarDate={calendarDate}
              currentRound={currentRound}
              key={roundKey}
              onRoundSelect={onRoundSelect}
              round={round}
              selectedMonth={selectedMonth}
              selectedRound={selectedRound}
            />
          );
        })}
      </div>
    </>
  );
}
