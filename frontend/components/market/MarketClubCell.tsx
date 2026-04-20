import { ArrowDown, ArrowUp } from "lucide-react";

import { ClubBadge } from "@/components/layout/ClubBadge";

type MarketClubCellProps = {
  clubImageUrl?: string;
  clubName: string;
  clubShortName: string;
  showArrivalIndicator?: boolean;
  showDepartureIndicator?: boolean;
};

export function MarketClubCell({
  clubImageUrl,
  clubName,
  clubShortName,
  showArrivalIndicator = false,
  showDepartureIndicator = false,
}: Readonly<MarketClubCellProps>) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {showDepartureIndicator ? (
        <ArrowDown className="h-5 w-5 text-[var(--destructive)]" />
      ) : null}

      {showArrivalIndicator ? (
        <ArrowUp className="h-5 w-5 text-[var(--homepage-highlight-label)]" />
      ) : null}

      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[16px] border border-[var(--homepage-panel-divider)] bg-white shadow-[0_10px_22px_rgba(73,54,20,0.08)]">
        <ClubBadge imageUrl={clubImageUrl} shortName={clubShortName} />
      </div>

      <p className="truncate text-base font-black text-[var(--homepage-panel-text-strong)]">
        {clubName}
      </p>
    </div>
  );
}
