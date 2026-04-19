import { cn } from "@/lib/cn";

export function LevelProgressBar({
  progressPercent,
  className,
}: Readonly<{
  progressPercent: number;
  className?: string;
}>) {
  const clampedProgressPercent = Math.min(100, Math.max(0, progressPercent));

  return (
    <div
      className={cn(
        "h-3 overflow-hidden rounded-full border border-(--homepage-progress-border) bg-(--homepage-progress-track)",
        className,
      )}
    >
      <div
        className="h-full bg-[linear-gradient(90deg,var(--homepage-progress-start)_0%,var(--homepage-progress-end)_100%)]"
        style={{ width: `${clampedProgressPercent}%` }}
      />
    </div>
  );
}
