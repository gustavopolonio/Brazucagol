import { Trophy } from "lucide-react";

export function CompetitionChip({
  accentEnd,
  accentStart,
  competitionName,
  stageLabel,
  textColor,
}: Readonly<{
  accentEnd: string;
  accentStart: string;
  competitionName: string;
  stageLabel: string;
  textColor: string;
}>) {
  return (
    <span
      className="inline-flex flex-wrap items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.1em]"
      style={{
        backgroundImage: `linear-gradient(135deg, ${accentStart} 0%, ${accentEnd} 100%)`,
        color: textColor,
      }}
    >
      <Trophy className="h-4 w-4" />
      <span>{competitionName}</span>
      <span className="opacity-70">·</span>
      <span>{stageLabel}</span>
    </span>
  );
}
