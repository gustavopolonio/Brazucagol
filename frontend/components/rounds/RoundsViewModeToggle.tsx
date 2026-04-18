import { CalendarDays, Clock3 } from "lucide-react";

import { RoundsViewToggleButton } from "@/components/rounds/RoundsViewToggleButton";
import type { ViewMode } from "@/components/rounds/rounds-view-mode";

export function RoundsViewModeToggle({
  onViewModeChange,
  viewMode,
}: Readonly<{
  onViewModeChange: (viewMode: ViewMode) => void;
  viewMode: ViewMode;
}>) {
  return (
    <div className="inline-flex w-fit rounded-full border border-[var(--rounds-divider)] bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-account-item-end)_100%)] p-1">
      <RoundsViewToggleButton
        active={viewMode === "day"}
        icon={<Clock3 className="h-4 w-4" />}
        label="Dia"
        onClick={() => onViewModeChange("day")}
      />
      <RoundsViewToggleButton
        active={viewMode === "month"}
        icon={<CalendarDays className="h-4 w-4" />}
        label="Mês"
        onClick={() => onViewModeChange("month")}
      />
    </div>
  );
}
