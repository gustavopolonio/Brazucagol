import type { RoundMatch } from "@/components/rounds/rounds-data";
import { ScoreDigit } from "@/components/rounds/ScoreDigit";

export function ScorePanel({ match }: Readonly<{ match: RoundMatch }>) {
  return (
    <div className="rounded-[24px] border border-(--homepage-counter-border) bg-[linear-gradient(180deg,var(--homepage-counter-start)_0%,var(--homepage-counter-end)_100%)] px-4 py-4 text-center shadow-[0_8px_18px_var(--homepage-counter-shadow)]">
      {match.status === "scheduled" ? (
        <div className="rounded-[18px] border border-(--homepage-counter-screen-border) bg-[linear-gradient(180deg,var(--homepage-counter-screen-start)_0%,var(--homepage-counter-screen-end)_100%)] px-5 py-4 shadow-[inset_0_1px_0_var(--homepage-counter-screen-inset)]">
          <p className="text-4xl font-black uppercase tracking-[0.12em] text-(--homepage-counter-up-text) [text-shadow:0_0_10px_var(--homepage-counter-up-glow)]">
            19:00
          </p>
          <p className="mt-2 text-[11px] font-black uppercase tracking-[0.16em] text-white/70">
            Inicio simultaneo
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <ScoreDigit value={match.homeScore} />
          <span className="w-3.5 text-2xl font-black uppercase tracking-[0.3em] text-(--homepage-timer-colon) [text-shadow:0_0_8px_var(--homepage-timer-colon-glow)]">
            x
          </span>
          <ScoreDigit value={match.awayScore} />
        </div>
      )}
    </div>
  );
}
