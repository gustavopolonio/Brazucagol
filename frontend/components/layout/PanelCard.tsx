import type { ReactNode } from "react";

export function PanelCard({
  title,
  children,
}: Readonly<{
  title: string;
  children: ReactNode;
}>) {
  return (
    <section className="relative pt-6">
      <div className="absolute left-1/2 top-0 z-10 flex w-full -translate-x-1/2 items-center justify-center rounded-[18px] border-[3px] border-(--homepage-panel-title-border) bg-[linear-gradient(180deg,var(--homepage-panel-title-start)_0%,var(--homepage-panel-title-end)_100%)] px-7 py-1 text-md font-black uppercase tracking-[0.12em] text-white shadow-[0_5px_0_var(--homepage-panel-title-shadow)]">
        {title}
      </div>
      {children}
    </section>
  );
}
