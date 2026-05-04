"use client";

import { Mail } from "lucide-react";

import { PanelCard } from "@/components/layout/PanelCard";
import { MessagePanel } from "@/components/messages/MessagePanel";
import { MessageSettingsMenu } from "@/components/messages/MessageSettingsMenu";
import {
  messageCategoryLabels,
  messageCategoryOrder,
  messageThreads,
  type MessageCategory,
} from "@/components/messages/messages-data";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { useMessageSettingsStore } from "@/stores/messageSettingsStore";

export function MessagesPage() {
  const isFloatingChatEnabled = useMessageSettingsStore(
    (state) => state.isFloatingChatEnabled,
  );
  const setIsFloatingChatEnabled = useMessageSettingsStore(
    (state) => state.setIsFloatingChatEnabled,
  );
  const setShowChatBackground = useMessageSettingsStore(
    (state) => state.setShowChatBackground,
  );
  const showChatBackground = useMessageSettingsStore((state) => state.showChatBackground);
  const tabs: TabItem<MessageCategory>[] = messageCategoryOrder.map((messageCategory) => ({
    content: (
      <MessagePanel
        showChatBackground={showChatBackground}
        threads={messageThreads.filter((messageThread) => messageThread.category === messageCategory)}
      />
    ),
    label: messageCategoryLabels[messageCategory],
    value: messageCategory,
  }));

  return (
    <PanelCard
      title={
        <span className="inline-flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Mensagens
        </span>
      }
    >
      <main className="rounded-b-[18px] border border-border bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-soft)_100%)] px-4 pb-4 pt-10 opacity-95">
        <section className="overflow-hidden rounded-[28px] border border-[var(--homepage-panel-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,245,245,0.98)_100%)] shadow-[0_20px_38px_rgba(73,54,20,0.12)]">
          <div className="border-b border-[var(--homepage-panel-divider)] bg-[linear-gradient(135deg,rgba(132,212,0,0.18)_0%,rgba(78,182,255,0.16)_100%)] px-5 py-5 md:px-7">
            <div className="flex flex-col gap-3">
              <div className="inline-flex w-fit items-center gap-3 rounded-full bg-white/80 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
                <Mail className="h-5 w-5 text-[var(--homepage-highlight-label)]" />
                <span className="text-sm font-black uppercase tracking-[0.16em] text-[var(--homepage-highlight-label)]">
                  Central de mensagens
                </span>
              </div>
              <p className="text-sm font-semibold text-[var(--homepage-panel-text)] md:text-base">
                Acompanhe avisos do sistema, conversas privadas e chats do clube.
              </p>
            </div>
          </div>

          <div className="px-3 py-3 md:px-5 md:py-5">
            <Tabs
              defaultValue="private"
              headerAction={
                <MessageSettingsMenu
                  isFloatingChatEnabled={isFloatingChatEnabled}
                  onFloatingChatEnabledChange={setIsFloatingChatEnabled}
                  onShowBackgroundChange={setShowChatBackground}
                  showBackground={showChatBackground}
                />
              }
              tabs={tabs}
            />
          </div>
        </section>
      </main>
    </PanelCard>
  );
}
