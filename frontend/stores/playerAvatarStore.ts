import { create } from "zustand";

import {
  DEFAULT_PLAYER_AVATAR_CONFIG,
  normalizePlayerAvatarConfig,
  type PlayerAvatarConfig,
} from "@/components/avatar/avatarOptions";

type PlayerAvatarState = {
  avatarConfig: PlayerAvatarConfig;
  setAvatarConfig: (avatarConfig: PlayerAvatarConfig) => void;
};

export const usePlayerAvatarStore = create<PlayerAvatarState>((set) => ({
  avatarConfig: DEFAULT_PLAYER_AVATAR_CONFIG,
  setAvatarConfig: (avatarConfig) =>
    set({ avatarConfig: normalizePlayerAvatarConfig(avatarConfig) }),
}));
