"use client";

import { usePathname, useRouter } from "next/navigation";

import { PanelCard } from "@/components/layout/PanelCard";
import type { MenuItem } from "@/components/layout/layoutTypes";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { ChevronRight } from "lucide-react";

const menuItems: MenuItem[] = [
  { label: "Início", href: "/" },
  { label: "Rodadas", href: "/rodadas" },
  { label: "Notícias", href: "/noticias" },
  { label: "Níveis" },
  { label: "Premiações" },
  { label: "Ranking" },
  { label: "Regras" },
  { label: "Transferências" },
  { label: "Ajuda" },
];

export function NavigationCard() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <PanelCard title="MENU">
      <div className="flex flex-col overflow-hidden rounded-b-[18px] border border-border bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-muted)_100%)]">
        {menuItems.map((item, index) => {
          const itemHref = item.href;

          return (
            <Button
              className={cn(
                "px-5 py-3",
                itemHref && pathname === itemHref
                  ? "bg-[linear-gradient(180deg,var(--rounds-highlight-start)_0%,var(--rounds-highlight-end)_100%)] text-[var(--rounds-highlight-text)]"
                  : "",
                index !== menuItems.length - 1 ? "border-b border-(--homepage-panel-divider)" : "",
                index === 0 ? "pt-7" : ""
              )}
              disabled={!itemHref}
              key={item.label}
              onClick={itemHref ? () => router.push(itemHref) : undefined}
              variant="menu"
            >
              <span>{item.label}</span>
              <ChevronRight
                className={cn(
                  "h-6 w-6",
                  itemHref && pathname === itemHref
                    ? "text-[var(--rounds-highlight-text)]"
                    : "text-(--homepage-panel-chevron)"
                )}
                strokeWidth={3}
              />
            </Button>
          );
        })}
      </div>
    </PanelCard>
  );
}
