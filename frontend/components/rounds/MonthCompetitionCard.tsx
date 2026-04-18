import type { CompetitionSchedule } from "@/components/rounds/rounds-data";

export function MonthCompetitionCard({
  competition,
}: Readonly<{
  competition: CompetitionSchedule;
}>) {
  return (
    <div
      className="overflow-x-auto rounded-[14px] px-2 py-2 text-[12px] font-black uppercase tracking-[0.08em]"
      style={{
        backgroundImage: `linear-gradient(135deg, ${competition.accentStart} 0%, ${competition.accentEnd} 100%)`,
        color: competition.textColor,
      }}
    >
      <div>{competition.name}</div>
      <div className="mt-1 opacity-80">{competition.stageLabel}</div>
    </div>
  );
}
