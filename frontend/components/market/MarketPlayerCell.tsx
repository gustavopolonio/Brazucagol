import { LevelIconBadge } from "@/components/layout/LevelIconBadge";
import { getLevelForGoals, levelIconByName } from "@/components/ranking/ranking-level-utils";

type MarketPlayerCellProps = {
  playerName: string;
  totalGoals: number;
};

export function MarketPlayerCell({
  playerName,
  totalGoals,
}: Readonly<MarketPlayerCellProps>) {
  const playerLevel = getLevelForGoals(totalGoals);
  const PlayerLevelIcon = levelIconByName[playerLevel.iconName];

  return (
    <div className="flex min-w-0 items-center gap-1">
      <LevelIconBadge
        icon={PlayerLevelIcon}
        iconClassName="h-5 w-5"
      />

      <p className="truncate text-base font-black text-[var(--homepage-panel-text-strong)]">
        {playerName}
      </p>
    </div>
  );
}
