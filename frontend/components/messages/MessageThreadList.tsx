import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { MessageThreadAvatar } from "@/components/messages/MessageThreadAvatar";
import type { MessageThread } from "@/components/messages/messages-data";

export function MessageThreadList({
  activeThreadId,
  onThreadSelect,
  threads,
}: Readonly<{
  activeThreadId: string;
  onThreadSelect: (threadId: string) => void;
  threads: MessageThread[];
}>) {
  return (
    <aside className="overflow-hidden rounded-[22px] border border-[var(--homepage-panel-divider)] bg-white/88 shadow-[0_12px_28px_rgba(73,54,20,0.08)]">
      <div className="border-b border-[var(--homepage-panel-divider)] px-4 py-3">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--homepage-panel-text-muted)]">
          Conversas
        </p>
      </div>

      <div className="max-h-[620px] space-y-1 overflow-y-auto p-2">
        {threads.map((thread) => {
          const isActive = thread.id === activeThreadId;

          return (
            <Button
              className={cn(
                "w-full gap-3 rounded-[18px] px-3 py-3 text-left",
                isActive
                  ? "border border-[var(--homepage-vip-border)] bg-[linear-gradient(180deg,var(--homepage-vip-start)_0%,var(--homepage-vip-end)_100%)] shadow-[0_6px_14px_var(--homepage-vip-shadow)]"
                  : "",
              )}
              key={thread.id}
              onClick={() => onThreadSelect(thread.id)}
              variant="menu"
            >
              <MessageThreadAvatar thread={thread} />

              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-black text-[var(--homepage-panel-text-strong)]">
                    {thread.title}
                  </span>
                  <span className="shrink-0 text-[11px] font-black text-[var(--homepage-panel-text-muted)]">
                    {thread.lastMessageAt}
                  </span>
                </span>
                <span className="mt-1 flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-bold text-[var(--homepage-panel-text-muted)]">
                    {thread.subtitle}
                  </span>
                  {thread.unreadCount ? (
                    <span className="flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--homepage-notification-start)_0%,var(--homepage-notification-end)_100%)] px-1.5 text-[10px] font-black text-white">
                      {thread.unreadCount}
                    </span>
                  ) : null}
                </span>
              </span>
            </Button>
          );
        })}
      </div>
    </aside>
  );
}
