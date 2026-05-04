"use client";

import { useMemo, useState, type FormEvent } from "react";

import { MessageConversation } from "@/components/messages/MessageConversation";
import { MessageThreadList } from "@/components/messages/MessageThreadList";
import type { MessageItem, MessageThread } from "@/components/messages/messages-data";
import { cn } from "@/lib/cn";

export function MessagePanel({
  layout = "page",
  showChatBackground,
  threads,
}: Readonly<{
  layout?: "floating" | "page";
  showChatBackground: boolean;
  threads: MessageThread[];
}>) {
  const [activeThreadId, setActiveThreadId] = useState(threads[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const [localMessagesByThreadId, setLocalMessagesByThreadId] = useState<Record<string, MessageItem[]>>({});
  const activeThread = threads.find((thread) => thread.id === activeThreadId) ?? threads[0];
  const messages = useMemo(
    () => [...(activeThread?.messages ?? []), ...(localMessagesByThreadId[activeThread?.id ?? ""] ?? [])],
    [activeThread, localMessagesByThreadId],
  );

  function handleThreadSelect(threadId: string) {
    setActiveThreadId(threadId);
    setDraft("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeThread || draft.trim().length === 0 || activeThread.category === "system") {
      return;
    }

    const nextMessage: MessageItem = {
      authorName: "Você",
      body: draft.trim(),
      id: `${activeThread.id}-local-${Date.now()}`,
      isOwn: true,
      sentAt: "Agora",
      sentAtDate: getLocalDateValue(new Date()),
    };

    setLocalMessagesByThreadId((currentMessagesByThreadId) => ({
      ...currentMessagesByThreadId,
      [activeThread.id]: [
        ...(currentMessagesByThreadId[activeThread.id] ?? []),
        nextMessage,
      ],
    }));
    setDraft("");
  }

  if (!activeThread) {
    return null;
  }

  if (activeThread.category !== "private") {
    return (
      <MessageConversation
        draft={draft}
        messages={messages}
        onDraftChange={setDraft}
        onSubmit={handleSubmit}
        layout={layout}
        showChatBackground={showChatBackground}
        thread={activeThread}
      />
    );
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        layout === "floating" ? "h-full grid-cols-[132px_1fr] gap-2" : "lg:grid-cols-[240px_1fr]",
      )}
    >
      <MessageThreadList
        activeThreadId={activeThread.id}
        layout={layout}
        onThreadSelect={handleThreadSelect}
        threads={threads}
      />
      <MessageConversation
        draft={draft}
        messages={messages}
        onDraftChange={setDraft}
        onSubmit={handleSubmit}
        layout={layout}
        showChatBackground={showChatBackground}
        thread={activeThread}
      />
    </div>
  );
}

function getLocalDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
