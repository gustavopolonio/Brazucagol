"use client";

import { PlayerAvatarRenderer } from "@/components/avatar/PlayerAvatarRenderer";
import { usePlayerAvatarStore } from "@/stores/playerAvatarStore";

export function PlayerAvatar({
  playerName,
}: Readonly<{
  playerName: string;
}>) {
  const avatarConfig = usePlayerAvatarStore((state) => state.avatarConfig);

  return (
    <div className="h-[42px] w-[42px] overflow-hidden rounded-full border border-white/90 bg-[linear-gradient(180deg,var(--homepage-avatar-skin-start)_0%,var(--homepage-avatar-skin-end)_100%)] shadow-[0_2px_4px_var(--homepage-avatar-shadow)]">
      <PlayerAvatarRenderer
        className="h-full w-full"
        config={avatarConfig}
        playerName={playerName}
        variant="face"
      />
    </div>
  );
}
