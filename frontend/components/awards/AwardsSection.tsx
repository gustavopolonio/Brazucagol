import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type AwardsSectionProps = {
  children: ReactNode;
  description: string;
  icon: LucideIcon;
  title: string;
};

export function AwardsSection({
  children,
  description,
  icon: Icon,
  title,
}: Readonly<AwardsSectionProps>) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[var(--homepage-panel-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(245,245,245,0.98)_100%)] shadow-[0_20px_38px_rgba(73,54,20,0.12)]">
      <div className="border-b border-[var(--homepage-panel-divider)] bg-[linear-gradient(135deg,rgba(132,212,0,0.18)_0%,rgba(78,182,255,0.16)_100%)] px-5 py-5 md:px-7">
        <div className="flex flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-3 rounded-full bg-white/80 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
            <Icon className="h-5 w-5 text-[var(--homepage-highlight-label)]" />
            <span className="text-sm font-black uppercase tracking-[0.16em] text-[var(--homepage-highlight-label)]">
              {title}
            </span>
          </div>
          <p className="text-sm font-semibold text-[var(--homepage-panel-text)] md:text-base">
            {description}
          </p>
        </div>
      </div>

      <div className="px-4 py-4 md:px-5 md:py-5">{children}</div>
    </section>
  );
}
