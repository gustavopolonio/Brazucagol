export function ScoreDigit({ value }: Readonly<{ value: number }>) {
  return (
    <span className="flex h-20 min-w-18 items-center justify-center rounded-[16px] border border-(--homepage-counter-digit-border) bg-[linear-gradient(180deg,var(--homepage-counter-digit-start)_0%,var(--homepage-counter-digit-end)_100%)] px-3 text-5xl font-black leading-none text-(--homepage-counter-up-text) shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] [text-shadow:0_0_12px_var(--homepage-counter-up-glow)]">
      {value}
    </span>
  );
}
