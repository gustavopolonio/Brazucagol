import type { CompetitionSchedule, RoundSchedule } from "@/components/rounds/rounds-data";
import { formatDateAndTime } from "@/components/rounds/rounds-formatters";
import { SummaryCard } from "@/components/rounds/SummaryCard";
import { Clock3, Trophy } from "lucide-react";

export function SelectedRoundSummary({
  selectedCompetition,
  selectedRound,
}: Readonly<{
  selectedCompetition?: CompetitionSchedule;
  selectedRound: RoundSchedule;
}>) {
  const now = new Date();
  const startLabel = now.getTime() >= selectedRound.roundStart.getTime() ? "Começou em" : "Começa em";
  const endLabel = now.getTime() >= selectedRound.roundEnd.getTime() ? "terminou em" : "termina em";

  return (
    <div className="grid grid-cols-[auto_1fr] gap-3">
      <SummaryCard icon={<Clock3 className="h-4 w-4" />} title="Data">
        {startLabel}{" "}
        <strong className="text-[var(--rounds-text-primary)] text-base">
          {formatDateAndTime(selectedRound.roundStart)}
        </strong>{" "}
          e {endLabel}{" "}
        <strong className="text-[var(--rounds-text-primary)] text-base">
          {formatDateAndTime(selectedRound.roundEnd)}
        </strong>
      </SummaryCard>

      {selectedCompetition ? (
        <SummaryCard icon={<Trophy className="h-4 w-4" />} title="Campeonato">
          <strong className="text-[var(--rounds-text-primary)]">{selectedCompetition.name} - {selectedCompetition.stageLabel}</strong>
        </SummaryCard>
      ) : null}
    </div>
  );
}
