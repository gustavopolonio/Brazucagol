"use client";

import { Circle } from "lucide-react";

import { PlayerAvatarRenderer } from "@/components/avatar/PlayerAvatarRenderer";
import type { MessageThread } from "@/components/messages/messages-data";
import { cn } from "@/lib/cn";

export function MessageThreadAvatar({
  className,
  thread,
}: Readonly<{
  className?: string;
  thread: MessageThread;
}>) {
  return (
    <span
      className={cn(
        "relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white text-sm font-black text-white shadow-[0_8px_18px_rgba(73,54,20,0.16)]",
        thread.avatarConfig
          ? "bg-[linear-gradient(180deg,var(--homepage-avatar-skin-start)_0%,var(--homepage-avatar-skin-end)_100%)]"
          : "",
        className,
      )}
      style={thread.avatarConfig ? undefined : { backgroundColor: thread.accentColor }}
    >
      {thread.avatarConfig ? (
        <PlayerAvatarRenderer
          className="h-full w-full"
          config={thread.avatarConfig}
          playerName={thread.title}
          variant="face"
        />
      ) : (
        thread.avatarLabel
      )}

      {thread.isOnline ? (
        <Circle className="absolute bottom-0 right-0 h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
      ) : null}
    </span>
  );
}
