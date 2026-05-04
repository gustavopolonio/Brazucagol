"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

import { MessagePanel } from "@/components/messages/MessagePanel";
import {
  messageCategoryLabels,
  messageCategoryOrder,
  messageThreads,
  type MessageCategory,
} from "@/components/messages/messages-data";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useMessageSettingsStore } from "@/stores/messageSettingsStore";

const floatingChatTransitionMs = 240;

export function FloatingMessages() {
  const [isPanelMounted, setIsPanelMounted] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MessageCategory>("private");
  const isFloatingChatEnabled = useMessageSettingsStore(
    (state) => state.isFloatingChatEnabled,
  );
  const showChatBackground = useMessageSettingsStore((state) => state.showChatBackground);
  const selectedThreads = messageThreads.filter(
    (messageThread) => messageThread.category === selectedCategory,
  );
  const unreadCount = messageThreads.reduce(
    (currentUnreadCount, messageThread) =>
      currentUnreadCount + (messageThread.unreadCount ?? 0),
    0,
  );

  function openFloatingChat() {
    setIsPanelMounted(true);
    window.requestAnimationFrame(() => setIsPanelVisible(true));
  }

  function closeFloatingChat() {
    setIsPanelVisible(false);
    window.setTimeout(() => setIsPanelMounted(false), floatingChatTransitionMs);
  }

  if (!isFloatingChatEnabled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
      {isPanelMounted ? (
        <section
          className={cn(
            "flex h-[min(620px,calc(100vh-32px))] w-[calc(100vw-32px)] max-w-[560px] origin-bottom flex-col overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.28)] transition duration-200 ease-out will-change-transform",
            isPanelVisible
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-8 scale-95 opacity-0",
          )}
          style={{ transitionDuration: `${floatingChatTransitionMs}ms` }}
        >
          <header className="flex items-center justify-between gap-3 border-b border-[var(--homepage-panel-divider)] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#22c55e_0%,#16a34a_100%)] text-white shadow-[0_8px_18px_rgba(22,163,74,0.28)]">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-black text-[var(--homepage-panel-text-strong)]">
                  Mensagens
                </h2>
                <p className="truncate text-xs font-bold text-[var(--homepage-panel-text-muted)]">
                  Conversas rápidas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                aria-label="Fechar mensagens"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--homepage-panel-surface-subtle)]"
                onClick={closeFloatingChat}
                variant="unstyled"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <div className="flex gap-2 overflow-x-auto border-b border-[var(--homepage-panel-divider)] bg-white px-3 py-2">
            {messageCategoryOrder.map((messageCategory) => {
              const isSelected = messageCategory === selectedCategory;

              return (
                <Button
                  className={cn(
                    "shrink-0 rounded-full px-3 py-2 text-xs font-black transition",
                    isSelected
                      ? "bg-neutral-950 text-white shadow-[0_8px_18px_rgba(15,23,42,0.22)]"
                      : "bg-[var(--homepage-panel-surface-subtle)] text-[var(--homepage-panel-text-muted)] hover:bg-white hover:text-[var(--homepage-panel-text-strong)]",
                  )}
                  key={messageCategory}
                  onClick={() => setSelectedCategory(messageCategory)}
                  type="button"
                  variant="unstyled"
                >
                  {messageCategoryLabels[messageCategory]}
                </Button>
              );
            })}
          </div>

          <div className="min-h-0 flex-1 bg-[linear-gradient(180deg,#f8fafc_0%,#eef6f2_100%)] p-2">
            <MessagePanel
              layout="floating"
              showChatBackground={showChatBackground}
              threads={selectedThreads}
            />
          </div>
        </section>
      ) : (
        <Button
          aria-label="Abrir mensagens"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(180deg,#25d366_0%,#0ea5e9_100%)] text-white shadow-[0_16px_34px_rgba(14,165,233,0.32)] hover:brightness-105"
          onClick={openFloatingChat}
          variant="unstyled"
        >
          <MessageCircle className="h-7 w-7" strokeWidth={2.5} />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex min-h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-rose-500 px-1.5 text-[11px] font-black text-white">
              {unreadCount}
            </span>
          ) : null}
        </Button>
      )}
    </div>
  );
}
