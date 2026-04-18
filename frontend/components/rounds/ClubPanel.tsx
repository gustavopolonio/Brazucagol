import { ClubBadge } from "@/components/layout/ClubBadge";
import { cn } from "@/lib/cn";

import type { ClubDefinition } from "@/components/rounds/rounds-data";

export function ClubPanel({
  align,
  club,
}: Readonly<{
  align: "left" | "right";
  club: ClubDefinition;
}>) {
  return (
    <div
      className={cn(
        "flex h-full flex-col justify-between gap-4",
        align === "right" ? "items-end text-right" : "items-start text-left"
      )}
    >
      <div className="flex flex-col items-center gap-3 rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <ClubBadge imageUrl={club.imageUrl} shortName={club.shortName} />
        <p className="truncate text-sm font-black uppercase tracking-[0.08em] text-white [text-shadow:0_1px_2px_var(--homepage-nameplate-text-shadow)]">
          {club.name}
        </p>
      </div>
    </div>
  );
}
