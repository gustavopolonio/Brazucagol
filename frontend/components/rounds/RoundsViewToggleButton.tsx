import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function RoundsViewToggleButton({
  active,
  icon,
  label,
  onClick,
}: Readonly<{
  active?: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}>) {
  return (
    <button
      className={cn(
        "cursor-pointer inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-black uppercase tracking-[0.08em] transition",
        active
          ? "bg-[linear-gradient(135deg,var(--rounds-highlight-start)_0%,var(--rounds-highlight-end)_100%)] text-[var(--rounds-highlight-text)]"
          : "text-[var(--rounds-text-secondary)] hover:bg-[var(--rounds-surface-muted)]"
      )}
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}
