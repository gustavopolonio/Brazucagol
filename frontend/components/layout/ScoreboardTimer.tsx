export function ScoreboardTimer({
  countdown,
}: Readonly<{
  countdown: string;
}>) {
  return (
    <div className="inline-flex items-center gap-1 rounded-md border border-(--homepage-timer-border) bg-[linear-gradient(180deg,var(--homepage-timer-start)_0%,var(--homepage-timer-end)_100%)] px-2 py-1.5 shadow-[inset_0_1px_0_var(--homepage-timer-inset),0_2px_6px_var(--homepage-timer-shadow)]">
      {countdown.split("").map((character, index) => {
        if (character === ":") {
          return (
            <span
              className="px-px text-[15px] font-black leading-none text-(--homepage-timer-colon) [text-shadow:0_0_8px_var(--homepage-timer-colon-glow)]"
              key={`colon-${index}`}
            >
              :
            </span>
          );
        }

        return (
          <span
            className="flex h-7 min-w-5 items-center justify-center rounded-sm border border-(--homepage-timer-digit-border) bg-[linear-gradient(180deg,var(--homepage-timer-digit-start)_0%,var(--homepage-timer-digit-end)_100%)] px-1 text-[16px] font-black leading-none text-(--homepage-timer-colon) [text-shadow:0_0_8px_var(--homepage-timer-digit-glow)]"
            key={`digit-${index}`}
          >
            {character}
          </span>
        );
      })}
    </div>
  );
}
