import { ClubBadge } from "@/components/layout/ClubBadge";
import { LevelIconBadge } from "@/components/layout/LevelIconBadge";
import type { RankingPlayer } from "@/components/ranking/ranking-data";
import { getLevelForGoals, levelIconByName } from "@/components/ranking/ranking-level-utils";

export function RankingPlayerCell({
  clubImageUrl,
  clubShortName,
  playerName,
  totalGoals,
}: Readonly<RankingPlayer>) {
  const playerLevel = getLevelForGoals(totalGoals);
  const PlayerLevelIcon = levelIconByName[playerLevel.iconName];

  return (
    <div className="flex min-w-0 items-center">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[16px] border border-[var(--homepage-panel-divider)] bg-white shadow-[0_10px_22px_rgba(73,54,20,0.08)]">
        <ClubBadge imageUrl={clubImageUrl} shortName={clubShortName} />
      </div>

      <LevelIconBadge
        icon={PlayerLevelIcon}
        iconClassName="h-5 w-5"
        className="ml-4 mr-1"
      />

      <p className="truncate text-base font-black text-[var(--homepage-panel-text-strong)]">
        {playerName}
      </p>
    </div>
  );
}
