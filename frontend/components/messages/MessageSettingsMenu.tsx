"use client";

import { useEffect, useRef, useState } from "react";
import { EllipsisVertical } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { Switch } from "@/components/ui/Switch";

export function MessageSettingsMenu({
  onShowBackgroundChange,
  showBackground,
}: Readonly<{
  onShowBackgroundChange: (showBackground: boolean) => void;
  showBackground: boolean;
}>) {
  const [isPinnedOpen, setIsPinnedOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isOpen = isHovered || isPinnedOpen;

  useEffect(() => {
    if (!isPinnedOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (menuRef.current?.contains(event.target as Node)) {
        return;
      }

      setIsPinnedOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isPinnedOpen]);

  return (
    <div
      className="relative flex h-full shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={menuRef}
    >
      <Button
        aria-expanded={isOpen}
        aria-label="Abrir menu das mensagens"
        className="flex h-full min-h-12 w-12 items-center justify-center rounded-[16px] border border-[var(--homepage-panel-divider)] bg-white/80 shadow-[0_1px_0_var(--homepage-highlight-inset)_inset,0_8px_18px_rgba(73,54,20,0.1)] hover:brightness-105"
        onClick={() => setIsPinnedOpen((currentIsPinnedOpen) => !currentIsPinnedOpen)}
        variant="unstyled"
      >
        <EllipsisVertical className="h-5 w-5" strokeWidth={2.5} />
      </Button>

      <div
        className={cn(
          "absolute right-0 top-full z-30 w-72 pt-2 opacity-0 transition-all duration-200 ease-out",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none",
        )}
      >
        <div className="overflow-hidden rounded-[18px] border border-[var(--homepage-panel-divider)] bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-soft)_100%)] shadow-[0_1px_0_rgba(255,255,255,0.92)_inset,0_12px_28px_rgba(0,0,0,0.18)]">
          <div className="border-b border-[var(--homepage-panel-divider-soft)] px-4 py-2">
            <p className="text-center font-black text-[var(--homepage-record-label)]">
              Configurações dos chats
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div className="min-w-0">
              <p className="text-sm font-black text-[var(--homepage-panel-text-strong)]">
                Fundo do chat
              </p>
              <p className="mt-1 text-xs font-semibold text-[var(--homepage-panel-text-muted)]">
                Mostrar imagem no fundo das conversas.
              </p>
            </div>

            <Switch
              checked={showBackground}
              onClick={() => onShowBackgroundChange(!showBackground)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
