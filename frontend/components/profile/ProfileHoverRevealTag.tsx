import { cn } from "@/lib/cn";

export function ProfileHoverRevealTag({
  compactLabel,
  fullLabel,
  className,
}: Readonly<{
  compactLabel: string;
  fullLabel: string;
  className: string;
}>) {
  return (
    <div
      className={cn(
        "group/tag inline-flex h-10 w-fit items-center overflow-hidden rounded-[16px] border text-sm font-black uppercase tracking-[0.12em]",
        className,
      )}
      title={fullLabel}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center leading-none">
        {compactLabel}
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap pr-0 opacity-0 transition-all duration-200 ease-out group-hover/tag:max-w-40 group-hover/tag:pr-3 group-hover/tag:opacity-100 group-focus-within/tag:max-w-40 group-focus-within/tag:pr-3 group-focus-within/tag:opacity-100">
        {fullLabel}
      </span>
    </div>
  );
}
