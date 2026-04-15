import { ArrowDown, ArrowUp } from "lucide-react";

const onlineCount = "584";

export function OnlinePlayersCounter() {
  return (
    <div className="inline-flex flex-col items-center gap-1 rounded-[10px] border border-(--homepage-counter-border) bg-[linear-gradient(180deg,var(--homepage-counter-start)_0%,var(--homepage-counter-end)_100%)] p-2 shadow-[0_3px_10px_var(--homepage-counter-shadow)]">
      <div className="flex items-center gap-2 rounded-md border border-(--homepage-counter-screen-border) bg-[linear-gradient(180deg,var(--homepage-counter-screen-start)_0%,var(--homepage-counter-screen-end)_100%)] px-2 py-1.5 shadow-[inset_0_1px_0_var(--homepage-counter-screen-inset)]">
        <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-[linear-gradient(180deg,var(--homepage-counter-up-start)_0%,var(--homepage-counter-up-end)_100%)]">
          <ArrowUp className="h-4 w-4 text-(--homepage-counter-up-text)" strokeWidth={3} />
        </span>

        <div className="flex items-center gap-0.5">
          {onlineCount.split("").map((character, index) => (
            <span
              className="flex h-8 min-w-5.5 items-center justify-center rounded-sm border border-(--homepage-counter-digit-border) bg-[linear-gradient(180deg,var(--homepage-counter-digit-start)_0%,var(--homepage-counter-digit-end)_100%)] px-1 text-[18px] font-black leading-none text-(--homepage-counter-up-text) [text-shadow:0_0_8px_var(--homepage-counter-up-glow)]"
              key={`${character}-${index}`}
            >
              {character}
            </span>
          ))}
        </div>

        <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-[linear-gradient(180deg,var(--homepage-counter-down-start)_0%,var(--homepage-counter-down-end)_100%)]">
          <ArrowDown className="h-4 w-4 text-(--homepage-counter-down-text)" strokeWidth={3} />
        </span>
      </div>

      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/85">
        Jogadores em campo
      </p>
    </div>
  );
}
