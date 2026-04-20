import { Coins, Crown } from "lucide-react";

import type { AwardHighlight } from "@/components/awards/awards-data";

export function HighlightCard({
  coins,
  title,
  vipReward,
}: Readonly<AwardHighlight>) {
  return (
    <article className="rounded-[24px] border border-[var(--homepage-panel-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,244,214,0.94)_100%)] p-5 shadow-[0_16px_34px_rgba(73,54,20,0.1)]">
      <div className="flex items-start gap-4">
        <div>
          <p className="font-black text-[var(--homepage-highlight-label)]">{title}</p>
          <p className="mt-3 flex items-center gap-1.5 text-base font-black text-[var(--homepage-panel-text-strong)]">
            <Crown className="h-4 w-4 text-[var(--homepage-highlight-label)]" />
            {vipReward}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-base font-black text-[var(--homepage-panel-text-strong)]">
            <Coins className="h-4 w-4 text-[var(--homepage-highlight-label)]" />
            {coins}
          </p>
        </div>
      </div>
    </article>
  );
}
