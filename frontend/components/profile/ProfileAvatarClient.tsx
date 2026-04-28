"use client";

import { useState } from "react";

import {
  DEFAULT_PLAYER_AVATAR_CONFIG,
  normalizePlayerAvatarConfig,
  type PlayerAvatarConfig,
} from "@/components/avatar/avatarOptions";
import { PlayerAvatarBackgroundEditor } from "@/components/avatar/PlayerAvatarBackgroundEditor";
import { PlayerAvatarEditor } from "@/components/avatar/PlayerAvatarEditor";
import { PlayerAvatarRenderer } from "@/components/avatar/PlayerAvatarRenderer";
import { ProfileAvatarActionMenu } from "@/components/profile/ProfileAvatarActionMenu";
import { usePlayerAvatarStore } from "@/stores/playerAvatarStore";

type ProfileAvatarClientProps = {
  avatarClassName?: string;
  isViewingOwnProfile: boolean;
  playerName: string;
};

export function ProfileAvatarClient({
  avatarClassName,
  isViewingOwnProfile,
  playerName,
}: Readonly<ProfileAvatarClientProps>) {
  const [isBackgroundEditorOpen, setIsBackgroundEditorOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const currentPlayerAvatarConfig = usePlayerAvatarStore(
    (state) => state.avatarConfig,
  );
  const setAvatarConfig = usePlayerAvatarStore((state) => state.setAvatarConfig);
  const avatarConfig = isViewingOwnProfile
    ? currentPlayerAvatarConfig
    : DEFAULT_PLAYER_AVATAR_CONFIG;

  function handleSaveAvatarConfig(nextConfig: PlayerAvatarConfig) {
    setAvatarConfig(normalizePlayerAvatarConfig(nextConfig));
  }

  return (
    <>
      <ProfileAvatarActionMenu
        isViewingOwnProfile={isViewingOwnProfile}
        onEditBackground={() => setIsBackgroundEditorOpen(true)}
        onEditPlayer={() => setIsEditorOpen(true)}
        playerName={playerName}
      />

      <PlayerAvatarRenderer
        className={avatarClassName}
        config={avatarConfig}
        imagePriority
        playerName={playerName}
      />

      {isViewingOwnProfile && isEditorOpen ? (
        <PlayerAvatarEditor
          currentConfig={avatarConfig}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveAvatarConfig}
          open
          playerName={playerName}
        />
      ) : null}

      {isViewingOwnProfile && isBackgroundEditorOpen ? (
        <PlayerAvatarBackgroundEditor
          currentConfig={avatarConfig}
          onClose={() => setIsBackgroundEditorOpen(false)}
          onSave={handleSaveAvatarConfig}
          open
        />
      ) : null}
    </>
  );
}
