"use client";

import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export type TabItem<TabValue extends string> = {
  content: ReactNode;
  label: string;
  value: TabValue;
};

export function Tabs<TabValue extends string>({
  className,
  defaultValue,
  tabs,
}: Readonly<{
  className?: string;
  defaultValue: TabValue;
  tabs: TabItem<TabValue>[];
}>) {
  const [selectedTabValue, setSelectedTabValue] = useState<TabValue>(defaultValue);
  const selectedTab = tabs.find((tab) => tab.value === selectedTabValue) ?? tabs[0];

  return (
    <div className={cn("space-y-4", className)}>
      <div
        aria-label="Selecionar aba"
        className="flex flex-wrap gap-2 rounded-[20px] border border-[var(--homepage-panel-divider)] bg-white/80 p-2 shadow-[0_8px_20px_rgba(73,54,20,0.08)]"
        role="tablist"
      >
        {tabs.map((tab) => {
          const isSelected = tab.value === selectedTab.value;

          return (
            <Button
              aria-selected={isSelected}
              className={cn(
                "min-h-10 flex-1 rounded-[14px] px-4 py-2 text-sm font-black tracking-[0.12em]",
                isSelected
                  ? "border border-[var(--homepage-vip-border)] bg-[linear-gradient(180deg,var(--homepage-vip-start)_0%,var(--homepage-vip-end)_100%)] text-[var(--homepage-vip-text)] shadow-[0_4px_10px_var(--homepage-vip-shadow)]"
                  : "",
              )}
              key={tab.value}
              onClick={() => setSelectedTabValue(tab.value)}
              role="tab"
              variant={isSelected ? "unstyled" : "secondary"}
            >
              {tab.label}
            </Button>
          );
        })}
      </div>

      <div role="tabpanel">{selectedTab.content}</div>
    </div>
  );
}
