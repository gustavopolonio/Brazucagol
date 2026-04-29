"use client";

import { useRouter } from "next/navigation";
import { Backpack } from "lucide-react";

import { ProfileHoverRevealTag } from "@/components/profile/ProfileHoverRevealTag";

export function ProfileInventoryTag() {
  const router = useRouter();

  return (
    <ProfileHoverRevealTag
      className="capitalize border-[var(--homepage-vip-border)] bg-[linear-gradient(180deg,var(--homepage-vip-start)_0%,var(--homepage-vip-end)_100%)] text-[var(--homepage-vip-text)] shadow-[0_1px_0_var(--homepage-highlight-inset)_inset,0_8px_18px_rgba(0,0,0,0.12)]"
      compactLabel={<Backpack className="h-5 w-5" strokeWidth={2.5} />}
      fullLabel="Inventário"
      onClick={() => router.push("/inventario", { scroll: false })}
    />
  );
}
