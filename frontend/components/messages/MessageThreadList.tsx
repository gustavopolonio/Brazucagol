import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { MessageThreadAvatar } from "@/components/messages/MessageThreadAvatar";
import type { MessageThread } from "@/components/messages/messages-data";

export function MessageThreadList({
  activeThreadId,
  layout = "page",
  onThreadSelect,
  threads,
}: Readonly<{
  activeThreadId: string;
  layout?: "floating" | "page";
  onThreadSelect: (threadId: string) => void;
  threads: MessageThread[];
}>) {
  return (
    <aside className={cn(
      "overflow-hidden border border-[var(--homepage-panel-divider)] bg-white/88 shadow-[0_12px_28px_rgba(73,54,20,0.08)]",
      layout === "floating" ? "h-full rounded-[18px]" : "rounded-[22px]",
    )}>
      <div className={cn(
        "border-b border-[var(--homepage-panel-divider)]",
        layout === "floating" ? "px-3 py-2" : "px-4 py-3",
      )}>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--homepage-panel-text-muted)]">
          Conversas
        </p>
      </div>

      <div className={cn(
        "space-y-1 overflow-y-auto p-2",
        layout === "floating" ? "h-[calc(100%-37px)]" : "max-h-[620px]",
      )}>
        {threads.map((thread) => {
          const isActive = thread.id === activeThreadId;

          return (
            <Button
              className={cn(
                "w-full gap-3 rounded-[18px] px-3 py-3 text-left",
                layout === "floating" ? "px-2 py-2" : "",
                isActive
                  ? "border border-[var(--homepage-vip-border)] bg-[linear-gradient(180deg,var(--homepage-vip-start)_0%,var(--homepage-vip-end)_100%)] shadow-[0_6px_14px_var(--homepage-vip-shadow)]"
                  : "",
              )}
              key={thread.id}
              onClick={() => onThreadSelect(thread.id)}
              variant="menu"
            >
              <MessageThreadAvatar
                className={layout === "floating" ? "h-9 w-9" : undefined}
                thread={thread}
              />

              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className={cn(
                    "truncate font-black text-[var(--homepage-panel-text-strong)]",
                    layout === "floating" ? "text-xs" : "text-sm",
                  )}>
                    {thread.title}
                  </span>
                  <span className={cn(
                    "shrink-0 text-[11px] font-black text-[var(--homepage-panel-text-muted)]",
                    layout === "floating" ? "hidden" : "",
                  )}>
                    {thread.lastMessageAt}
                  </span>
                </span>
                <span className={cn(
                  "mt-1 items-center justify-between gap-2",
                  layout === "floating" ? "hidden" : "flex",
                )}>
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
