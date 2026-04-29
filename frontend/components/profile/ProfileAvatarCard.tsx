import Image from "next/image";

import { ProfileAvatarClient } from "@/components/profile/ProfileAvatarClient";
import { ProfileHoverRevealTag } from "@/components/profile/ProfileHoverRevealTag";
import { ProfileInventoryTag } from "@/components/profile/ProfileInventoryTag";
import type { PlayerProfileData } from "@/components/profile/profileTypes";
import { getRolePresentation } from "@/components/profile/profileUtils";

export function ProfileAvatarCard({
  profileData,
  isViewingOwnProfile,
}: Readonly<{
  profileData: PlayerProfileData;
  isViewingOwnProfile: boolean;
}>) {
  const clubRolePresentation = profileData.clubRoleLabel
    ? getRolePresentation(profileData.clubRoleLabel)
    : null;

  return (
    <section className="h-full space-y-5">
      <div className="relative h-full overflow-hidden rounded-[16px] border border-white/80 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-[linear-gradient(180deg,rgba(7,18,30,0.84)_0%,rgba(7,18,30,0.12)_78%,rgba(7,18,30,0)_100%)] px-4 pb-10 pt-3">
          <div className="mx-auto flex max-w-[calc(100%-1rem)] flex-col items-center">
            <div className="grid max-w-full grid-cols-[2.75rem_minmax(0,auto)_2.75rem] items-center gap-2">
              <div className="h-10 w-10" />
              <div className="group/name pointer-events-auto relative min-w-0">
                <p
                  className="truncate whitespace-nowrap text-[clamp(1.08rem,3vw,1.58rem)] font-black tracking-[0.12em] text-[#ffe08a] [text-shadow:0_-2px_12px_rgba(0,0,0,0.58)]"
                  title={profileData.playerName}
                >
                  {profileData.playerName}
                </p>
                <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 max-w-[min(22rem,calc(100vw-3rem))] -translate-x-1/2 break-words rounded-full border border-(--homepage-highlight-border) bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(238,248,208,0.94)_100%)] px-3 py-1 text-center text-[11px] font-black uppercase tracking-[0.12em] text-[var(--rounds-highlight-text)] opacity-0 shadow-[0_1px_0_var(--homepage-highlight-inset)_inset,0_8px_18px_rgba(0,0,0,0.18)] transition-all duration-200 ease-out group-hover/name:translate-y-1 group-hover/name:opacity-100 group-focus-within/name:translate-y-1 group-focus-within/name:opacity-100">
                  {profileData.playerName}
                </div>
              </div>
            </div>
            <div className="mt-2 h-[3px] w-28 rounded-full bg-[linear-gradient(90deg,rgba(255,213,79,0)_0%,rgba(255,213,79,0.95)_18%,rgba(255,233,146,1)_50%,rgba(255,213,79,0.95)_82%,rgba(255,213,79,0)_100%)] shadow-[0_0_12px_rgba(255,211,92,0.38)]" />
          </div>
        </div>

        <ProfileAvatarClient
          avatarClassName="xl:h-full xl:aspect-auto"
          isViewingOwnProfile={isViewingOwnProfile}
          playerName={profileData.playerName}
        />

        <div className="absolute left-3 top-3 z-10 max-w-[calc(100%-1.5rem)]">
          <div className="flex flex-col gap-2">
            <div
              className="group/club inline-flex h-10 w-fit items-center overflow-hidden rounded-[16px] border border-(--homepage-highlight-border) bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(238,248,208,0.94)_100%)] shadow-[0_1px_0_var(--homepage-highlight-inset)_inset,0_8px_18px_rgba(0,0,0,0.12)]"
              title={profileData.clubName}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                {profileData.clubImageUrl ? (
                  <Image
                    alt={`Escudo ${profileData.clubName}`}
                    className="shrink-0"
                    src={profileData.clubImageUrl}
                    height={24}
                    width={24}
                  />
                ) : (
                  <span className="shrink-0 text-[11px] font-black uppercase tracking-[0.08em] text-(--homepage-panel-text-strong)">
                    {profileData.clubShortName}
                  </span>
                )}
              </div>

              <p className="max-w-0 overflow-hidden whitespace-nowrap pr-0 text-[13px] font-black uppercase tracking-[0.08em] text-(--homepage-panel-text-strong) opacity-0 transition-all duration-200 ease-out group-hover/club:max-w-44 group-hover/club:pr-3 group-hover/club:opacity-100 group-focus-within/club:max-w-44 group-focus-within/club:pr-3 group-focus-within/club:opacity-100">
                {profileData.clubName}
              </p>
            </div>

            {clubRolePresentation ? (
              <ProfileHoverRevealTag
                className={clubRolePresentation.colorClassName}
                compactLabel={clubRolePresentation.compactLabel}
                fullLabel={clubRolePresentation.fullLabel}
              />
            ) : null}

            {profileData.isClubRepresentative ? (
              <ProfileHoverRevealTag
                className="border-orange-800 bg-orange-500 text-white"
                compactLabel="R"
                fullLabel="Representante"
              />
            ) : null}
          </div>
        </div>

        {isViewingOwnProfile ? (
          <div className="absolute bottom-3 right-3 z-10">
            <ProfileInventoryTag />
          </div>
        ) : null}
      </div>
    </section>
  );
}
