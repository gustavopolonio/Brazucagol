"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { MessageBubble } from "@/components/messages/MessageBubble";
import { MessageComposer } from "@/components/messages/MessageComposer";
import { MessageThreadAvatar } from "@/components/messages/MessageThreadAvatar";
import type { MessageItem, MessageThread } from "@/components/messages/messages-data";
import { cn } from "@/lib/cn";

export function MessageConversation({
  draft,
  messages,
  onDraftChange,
  onSubmit,
  showChatBackground,
  thread,
}: Readonly<{
  draft: string;
  messages: MessageItem[];
  onDraftChange: (draft: string) => void;
  onSubmit: Parameters<typeof MessageComposer>[0]["onSubmit"];
  showChatBackground: boolean;
  thread: MessageThread;
}>) {
  const messageListRef = useRef<HTMLDivElement>(null);
  const [activeMessageDate, setActiveMessageDate] = useState(
    messages[messages.length - 1]?.sentAtDate ?? getLocalDateValue(new Date()),
  );
  const isReadOnly = thread.category === "system";
  const colorAuthorNames = thread.category === "club" || thread.category === "global";
  const activeMessageDateLabel = formatMessageDateLabel(activeMessageDate);

  const updateActiveMessageDate = useCallback(() => {
    const messageList = messageListRef.current;

    if (!messageList) {
      return;
    }

    const messageElements = Array.from(
      messageList.querySelectorAll<HTMLElement>("[data-message-date]"),
    );
    const messageListTop = messageList.getBoundingClientRect().top;
    const referenceTop = messageListTop + 64;
    let nextActiveMessageDate = messageElements[0]?.dataset.messageDate;

    for (const messageElement of messageElements) {
      const messageElementTop = messageElement.getBoundingClientRect().top;

      if (messageElementTop <= referenceTop) {
        nextActiveMessageDate =
          messageElement.dataset.messageDate ?? nextActiveMessageDate;
      } else {
        break;
      }
    }

    if (nextActiveMessageDate) {
      setActiveMessageDate(nextActiveMessageDate);
    }
  }, []);

  useEffect(() => {
    const messageList = messageListRef.current;

    if (!messageList) {
      return;
    }

    messageList.scrollTop = messageList.scrollHeight;
    window.requestAnimationFrame(updateActiveMessageDate);
  }, [messages, thread.id, updateActiveMessageDate]);

  return (
    <section className="flex h-[700px] max-h-[700px] flex-col overflow-hidden rounded-[22px] border border-[var(--homepage-panel-divider)] bg-[linear-gradient(180deg,#ffffff_0%,var(--homepage-panel-surface-subtle)_100%)] shadow-[0_12px_28px_rgba(73,54,20,0.09)]">
      <header className="flex items-center justify-between gap-4 border-b border-[var(--homepage-panel-divider)] bg-white/90 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <MessageThreadAvatar thread={thread} />
          <div className="min-w-0">
            <h2 className="truncate text-base font-black text-[var(--homepage-panel-text-strong)]">
              {thread.title}
            </h2>
            <p className="flex items-center gap-2 truncate text-xs font-bold text-[var(--homepage-panel-text-muted)]">
              {thread.subtitle}
            </p>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "flex-1 overflow-y-auto p-4",
          showChatBackground
            ? "bg-[linear-gradient(180deg,rgba(238,248,208,0.56)_0%,rgba(255,255,255,0.68)_100%),url('/images/chat/background.png')] bg-cover bg-center"
            : "bg-[linear-gradient(180deg,rgba(238,248,208,0.42)_0%,rgba(255,255,255,0.6)_100%)]",
        )}
        onScroll={updateActiveMessageDate}
        ref={messageListRef}
      >
        <div className="sticky top-0 z-20 mb-3 flex justify-center pointer-events-none">
          <span className="rounded-full border border-[var(--homepage-panel-divider)] bg-white px-4 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[var(--homepage-panel-text-muted)] shadow-[0_8px_18px_rgba(73,54,20,0.12)]">
            {activeMessageDateLabel}
          </span>
        </div>
        {messages.map((message, messageIndex) => {
          const previousMessage = messages[messageIndex - 1];
          const messageDate = message.sentAtDate ?? getLocalDateValue(new Date());
          const previousMessageDate = previousMessage?.sentAtDate;
          const shouldShowDateSeparator = messageDate !== previousMessageDate;
          const isGroupedWithPrevious =
            thread.category !== "system" &&
            !shouldShowDateSeparator &&
            previousMessage?.authorName === message.authorName;

          return (
            <div
              className={cn(
                "space-y-3",
                messageIndex === 0
                  ? "mt-0"
                  : isGroupedWithPrevious
                    ? "mt-0.5"
                    : "mt-3",
              )}
              data-message-date={messageDate}
              key={message.id}
            >
              {shouldShowDateSeparator ? (
                <div className="flex justify-center">
                  <span className="rounded-full border border-[var(--homepage-panel-divider)] bg-white/86 px-4 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[var(--homepage-panel-text-muted)] shadow-[0_8px_18px_rgba(73,54,20,0.1)]">
                    {formatMessageDateLabel(messageDate)}
                  </span>
                </div>
              ) : null}
              <MessageBubble
                colorAuthorName={colorAuthorNames}
                isGroupedWithPrevious={isGroupedWithPrevious}
                message={message}
                messageCategory={thread.category}
              />
            </div>
          );
        })}
      </div>

      <MessageComposer
        disabled={isReadOnly}
        draft={draft}
        onDraftChange={onDraftChange}
        onSubmit={onSubmit}
      />
    </section>
  );
}

function formatMessageDateLabel(dateValue: string) {
  const messageDate = createLocalDate(dateValue);
  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.floor(
    (todayDate.getTime() - messageDate.getTime()) / 86_400_000,
  );

  if (diffDays === 0) {
    return "Hoje";
  }

  if (diffDays === 1) {
    return "Ontem";
  }

  if (diffDays > 1 && diffDays <= 7) {
    return formatWeekdayName(messageDate);
  }

  return formatExactDate(messageDate);
}

function formatWeekdayName(date: Date) {
  const weekdayName = new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(date);

  return weekdayName.charAt(0).toUpperCase() + weekdayName.slice(1);
}

function formatExactDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function createLocalDate(dateValue: string) {
  const [year = "0", month = "1", day = "1"] = dateValue.split("-");

  return new Date(Number(year), Number(month) - 1, Number(day));
}

function getLocalDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
