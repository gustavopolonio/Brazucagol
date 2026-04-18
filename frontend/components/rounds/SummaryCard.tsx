import type { ReactNode } from "react";

export function SummaryCard({
  children,
  icon,
  title,
}: Readonly<{
  children: ReactNode;
  icon: ReactNode;
  title: string;
}>) {
  return (
    <div className="rounded-[16px] border border-white/10 bg-white/6 px-4 py-3 shadow-[0_2px_15px_rgba(0,0,0,0.18)] border-[var(--homepage-account-item-hover-border)] bg-[linear-gradient(180deg,var(--homepage-account-item-hover-start)_0%,var(--homepage-account-item-hover-end)_100%)]">
      <div className="flex items-center gap-2 text-[var(--rounds-text-muted)]">
        <span>{icon}</span>
        <p className="text-sm font-black tracking-[0.16em]">
          {title}
        </p>
      </div>
      <p className="text-sm mt-1 leading-6 text-[var(--rounds-text-secondary)]">{children}</p>
    </div>
  );
}
