import { PanelCard } from "@/components/layout/PanelCard";
import { ProfileAvatarCard } from "@/components/profile/ProfileAvatarCard";
import { ProfileHonorsSection } from "@/components/profile/ProfileHonorsSection";
import { ProfileStatsSection } from "@/components/profile/ProfileStatsSection";
import type { PlayerProfileData } from "@/components/profile/profileTypes";

export function PlayerProfile({
  profileData,
  isViewingOwnProfile = false,
}: Readonly<{
  profileData: PlayerProfileData;
  isViewingOwnProfile?: boolean;
}>) {
  return (
    <PanelCard title="Perfil do jogador">
      <div className="rounded-b-[18px] border border-border bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-muted)_100%)] px-4 pb-4 pt-8 opacity-95 md:px-5 md:pb-5">
        <div className="grid gap-5 xl:grid-cols-[2fr_3fr]">
          <ProfileStatsSection profileData={profileData} />
          <ProfileAvatarCard
            isViewingOwnProfile={isViewingOwnProfile}
            profileData={profileData}
          />
        </div>

        <ProfileHonorsSection profileData={profileData} />
      </div>
    </PanelCard>
  );
}
