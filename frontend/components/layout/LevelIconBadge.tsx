import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";

export function LevelIconBadge({
  icon: Icon,
  variant = "default",
  className,
  iconClassName,
}: Readonly<{
  icon: LucideIcon;
  variant?: "default" | "softAccent";
  className?: string;
  iconClassName?: string;
}>) {
  return (
    <div
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-md border bg-white/10",
        variant === "default" && "border-white",
        variant === "softAccent" &&
          "border-[rgba(132,212,0,0.22)] shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]",
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
