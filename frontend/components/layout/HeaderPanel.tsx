import { ActionBar } from "@/components/layout/ActionBar";
import { ClubBadge } from "@/components/layout/ClubBadge";
import { LevelIconBadge } from "@/components/layout/LevelIconBadge";
import { ProgressBar } from "@/components/layout/ProgressBar";
import { OldScoreboardLogo } from "@/components/layout/OldScoreboardLogo";
import { ProfileStat } from "@/components/layout/ProfileStat";
import type { HeaderPanelData } from "@/components/layout/layoutTypes";
import { Flame } from "lucide-react";

const fixedProfileStatLabels = [
  "Gols",
  "Temporada",
  "Rodada",
  "Hora",
  "Moedas",
];

const headerPanelData: HeaderPanelData = {
  teamName: "Auriverde FC",
  teamLeague: "Liga Ouro - Série A",
  levelLabel: "Nível 24",
  currentGoals: 1981,
  nextLevelGoalsRequired: 2389,
  teamBadge: {
    shortName: "AV",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/SE_Palmeiras_2025_crest.png/250px-SE_Palmeiras_2025_crest.png",
  },
  profileStats: [
    "1.284",
    "882",
    "118",
    "34",
    "42.800",
  ],
};

export function HeaderPanel() {
  const levelProgressPercent = Math.min(
    100,
    Math.max(0, (headerPanelData.currentGoals / headerPanelData.nextLevelGoalsRequired) * 100),
  );

  return (
    <section
      className="h-112.5 flex flex-col justify-between relative overflow-hidden rounded-b-[18px] px-6 py-2"
    >
      <div className="flex justify-between relative gap-6 xl:items-start">
        <OldScoreboardLogo />

        <div className="flex gap-6 p-4 rounded-[18px] border border-white/70 bg-[linear-gradient(180deg,var(--homepage-header-overlay-start)_0%,var(--homepage-header-overlay-mid)_48%,var(--homepage-header-overlay-end)_100%)]">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.12em] text-white">
              <LevelIconBadge icon={Flame} />
              <div className="flex flex-col">
                <span>Special Dark - 39</span>
                <div className="text-[13px] font-black uppercase tracking-[0.04em] text-white/95">
                  {headerPanelData.currentGoals}/{headerPanelData.nextLevelGoalsRequired}
                </div>
              </div>
            </div>

            <ProgressBar className="mb-3" progressPercent={levelProgressPercent} />

            <div className="flex gap-6">
              {headerPanelData.profileStats.map((profileStatValue, index) => (
                <ProfileStat
                  key={fixedProfileStatLabels[index]}
                  label={fixedProfileStatLabels[index] ?? ""}
                  value={profileStatValue}
                />
              ))}
            </div>
          </div>

          <ClubBadge
            shortName={headerPanelData.teamBadge.shortName}
            imageUrl={headerPanelData.teamBadge.imageUrl}
          />
        </div>
      </div>

      <ActionBar />
    </section>
  );
}
