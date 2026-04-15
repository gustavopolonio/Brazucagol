import { PanelCard } from "@/components/layout/PanelCard";
import type { MenuItem } from "@/components/layout/layoutTypes";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { ChevronRight } from "lucide-react";

const menuItems: MenuItem[] = [
  { label: "Início" },
  { label: "Rodadas" },
  { label: "Níveis" },
  { label: "Recompensas" },
  { label: "Ranking" },
  { label: "Regras" },
  { label: "Transferências" },
  { label: "Ajuda" },
];

export function NavigationCard() {
  return (
    <PanelCard title="MENU">
      <div className="flex flex-col overflow-hidden rounded-b-[18px] border border-border bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-muted)_100%)]">
        {menuItems.map((item, index) => (
          <Button
            className={cn(
              "px-5 py-3",
              index !== menuItems.length - 1 ? "border-b border-(--homepage-panel-divider)" : "",
              index === 0 ? "pt-7" : ""
            )}
            key={item.label}
            variant="menu"
          >
            <span>{item.label}</span>
            <ChevronRight className="h-6 w-6 text-(--homepage-panel-chevron)" strokeWidth={3} />
          </Button>
        ))}
      </div>
    </PanelCard>
  );
}
