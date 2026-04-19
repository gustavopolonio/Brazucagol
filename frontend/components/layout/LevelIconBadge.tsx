import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";

export function LevelIconBadge({
  icon: Icon,
  className,
  iconClassName,
}: Readonly<{
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
}>) {
  return (
    <div
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-md border border-white bg-white/10",
        className,
      )}
    >
      <Icon
        className={cn("h-5 w-5 text-(--homepage-level-icon)", iconClassName)}
        strokeWidth={2.5}
      />
    </div>
  );
}
