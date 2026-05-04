import { create } from "zustand";

type MessageSettingsState = {
  isFloatingChatEnabled: boolean;
  setIsFloatingChatEnabled: (isFloatingChatEnabled: boolean) => void;
  setShowChatBackground: (showChatBackground: boolean) => void;
  showChatBackground: boolean;
};

export const useMessageSettingsStore = create<MessageSettingsState>((set) => ({
  isFloatingChatEnabled: true,
  setIsFloatingChatEnabled: (isFloatingChatEnabled) => set({ isFloatingChatEnabled }),
  setShowChatBackground: (showChatBackground) => set({ showChatBackground }),
  showChatBackground: true,
}));
