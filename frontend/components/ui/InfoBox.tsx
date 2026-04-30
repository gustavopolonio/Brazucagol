import type { ReactNode } from "react";
import { Info } from "lucide-react";

import { cn } from "@/lib/cn";

export function InfoBox({
  children,
  className,
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={cn(
        "flex flex-1 items-center gap-6 rounded-[18px] border border-[var(--homepage-highlight-border)] bg-[linear-gradient(180deg,var(--homepage-highlight-start)_0%,var(--homepage-highlight-end)_100%)] p-4 text-sm font-semibold leading-relaxed text-[var(--homepage-panel-text)]",
        className,
      )}
    >
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-[var(--homepage-highlight-label)]" />
      <p className="text-base">{children}</p>
    </div>
  );
}
