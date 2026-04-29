"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Backpack, Clock3, Crown, Minus, Plus, Ticket } from "lucide-react";

import { PanelCard } from "@/components/layout/PanelCard";
import {
  loggedInPlayerInventoryItems,
  type InventoryItem,
  type InventoryItemType,
} from "@/components/inventory/inventory-data";
import { Button } from "@/components/ui/Button";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

const inventoryTypeDetails: Record<
  InventoryItemType,
  {
    actionLabel: string;
    description: string;
    emptyMessage: string;
    icon: typeof Crown;
    title: string;
  }
> = {
  vip: {
    actionLabel: "Usar VIP",
    description: "Reduz pela metade o tempo dos chutes.",
    emptyMessage: "Você ainda não possui VIPs guardados.",
    icon: Crown,
    title: "VIPs",
  },
  transfer_pass: {
    actionLabel: "Trocar de time",
    description: "Use para trocar de time.",
    emptyMessage: "Você ainda não possui passes de transferência.",
    icon: Ticket,
    title: "Passes de transferência",
  },
};

const inventoryTypeOrder: InventoryItemType[] = ["vip", "transfer_pass"];

export function InventoryPage() {
  const router = useRouter();
  const itemsByType = useMemo(() => groupInventoryItemsByType(loggedInPlayerInventoryItems), []);
  const [vipItemToUse, setVipItemToUse] = useState<InventoryItem | null>(null);
  const [vipQuantityToUse, setVipQuantityToUse] = useState(1);

  function handleItemAction(inventoryItem: InventoryItem) {
    if (inventoryItem.type === "vip") {
      setVipItemToUse(inventoryItem);
      setVipQuantityToUse(1);
      return;
    }

    if (inventoryItem.type === "transfer_pass") {
      router.push("/trocar-time", { scroll: false });
    }
  }

  function handleConfirmVipUse() {
    setVipItemToUse(null);
    setVipQuantityToUse(1);
  }

  function handleCancelVipUse() {
    setVipItemToUse(null);
    setVipQuantityToUse(1);
  }

  function handleVipQuantityChange(nextQuantity: number) {
    if (!vipItemToUse) {
      return;
    }

    setVipQuantityToUse(Math.min(Math.max(nextQuantity, 1), vipItemToUse.quantity));
  }

  return (
    <>
      <PanelCard
        title={
          <span className="inline-flex items-center gap-2">
            <Backpack className="h-4 w-4" />
            Inventário
          </span>
        }
      >
        <main className="rounded-b-[18px] border border-border bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-soft)_100%)] px-4 pb-4 pt-10 opacity-95">
          <section className="overflow-hidden rounded-[28px] border border-[var(--homepage-panel-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,245,245,0.98)_100%)] shadow-[0_20px_38px_rgba(73,54,20,0.12)]">
            <div className="border-b border-[var(--homepage-panel-divider)] bg-[linear-gradient(135deg,rgba(132,212,0,0.18)_0%,rgba(78,182,255,0.16)_100%)] px-5 py-5 md:px-7">
              <div className="flex flex-col gap-3">
                <div className="inline-flex w-fit items-center gap-3 rounded-full bg-white/80 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
                  <Backpack className="h-5 w-5 text-[var(--homepage-highlight-label)]" />
                  <span className="text-sm font-black uppercase tracking-[0.16em] text-[var(--homepage-highlight-label)]">
                    Meus itens
                  </span>
                </div>
                <p className="text-sm font-semibold text-[var(--homepage-panel-text)] md:text-base">
                  Itens disponíveis para usar.
                </p>
              </div>
            </div>

            <div className="space-y-5 px-3 py-3 md:px-5 md:py-5">
              {inventoryTypeOrder.map((inventoryItemType) => (
                <InventoryTypeSection
                  inventoryItemType={inventoryItemType}
                  items={itemsByType[inventoryItemType]}
                  key={inventoryItemType}
                  onItemAction={handleItemAction}
                />
              ))}
            </div>
          </section>
        </main>
      </PanelCard>

      <ConfirmationModal
        cancelLabel="Cancelar"
        confirmLabel="Usar VIP"
        message={`Tem certeza que deseja usar ${vipItemToUse?.name ?? "este VIP"}?`}
        onCancel={handleCancelVipUse}
        onConfirm={handleConfirmVipUse}
        open={vipItemToUse !== null}
      >
        {vipItemToUse && vipItemToUse.quantity !== 1 ? (
          <div className="rounded-[18px] border border-[var(--homepage-panel-divider)] bg-[linear-gradient(180deg,var(--homepage-highlight-start)_0%,var(--homepage-highlight-end)_100%)] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--homepage-panel-text-muted)]">
                  Quantidade
                </p>
                <p className="mt-1 text-sm font-bold text-[var(--homepage-panel-text)]">
                  Você tem {vipItemToUse.quantity} disponíveis.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  aria-label="Diminuir quantidade de VIP"
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  disabled={vipQuantityToUse <= 1}
                  onClick={() => handleVipQuantityChange(vipQuantityToUse - 1)}
                  variant="secondary"
                >
                  <Minus className="h-4 w-4" strokeWidth={3} />
                </Button>

                <span className="flex h-10 min-w-12 items-center justify-center rounded-full border border-[var(--homepage-vip-border)] bg-[linear-gradient(180deg,var(--homepage-vip-start)_0%,var(--homepage-vip-end)_100%)] px-4 text-lg font-black text-[var(--homepage-vip-text)] shadow-[0_4px_10px_var(--homepage-vip-shadow)]">
                  {vipQuantityToUse}
                </span>

                <Button
                  aria-label="Aumentar quantidade de VIP"
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  disabled={vipQuantityToUse >= vipItemToUse.quantity}
                  onClick={() => handleVipQuantityChange(vipQuantityToUse + 1)}
                  variant="secondary"
                >
                  <Plus className="h-4 w-4" strokeWidth={3} />
                </Button>
              </div>
            </div>

            {vipItemToUse.durationSeconds ? (
              <p className="mt-4 rounded-full bg-white/78 px-4 py-2 text-center text-sm font-black text-[var(--homepage-panel-text-strong)]">
                Vai ativar {formatVipDuration(vipItemToUse.durationSeconds * vipQuantityToUse)} de VIP.
              </p>
            ) : null}
          </div>
        ) : null}
      </ConfirmationModal>
    </>
  );
}

function InventoryTypeSection({
  inventoryItemType,
  items,
  onItemAction,
}: Readonly<{
  inventoryItemType: InventoryItemType;
  items: InventoryItem[];
  onItemAction: (inventoryItem: InventoryItem) => void;
}>) {
  const inventoryTypeDetail = inventoryTypeDetails[inventoryItemType];
  const InventoryTypeIcon = inventoryTypeDetail.icon;
  const totalVipDurationSeconds =
    inventoryItemType === "vip" ? calculateTotalVipDurationSeconds(items) : 0;

  return (
    <section className="rounded-[22px] border border-[var(--homepage-panel-divider)] bg-white/82 p-4 shadow-[0_10px_24px_rgba(73,54,20,0.08)]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-[var(--homepage-vip-border)] bg-[linear-gradient(180deg,var(--homepage-vip-start)_0%,var(--homepage-vip-end)_100%)] text-[var(--homepage-vip-text)] shadow-[0_6px_14px_var(--homepage-vip-shadow)]">
            <InventoryTypeIcon className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-black text-[var(--homepage-panel-text-strong)]">
              {inventoryTypeDetail.title}
            </h2>
            <p className="text-sm font-semibold text-[var(--homepage-panel-text-muted)]">
              {inventoryTypeDetail.description}
            </p>
          </div>
        </div>

        {inventoryItemType === "vip" && totalVipDurationSeconds > 0 ? (
          <div className="text-right space-y-1 rounded-[18px] border border-[var(--homepage-vip-border)] bg-[linear-gradient(180deg,var(--homepage-vip-start)_0%,var(--homepage-vip-end)_100%)] px-3 py-2 text-[var(--homepage-vip-text)] shadow-[0_6px_14px_var(--homepage-vip-shadow)]">
            <p className="text-sm flex items-center gap-2">
              <Clock3 className="h-4 w-4" strokeWidth={2.5} />
                Tempo total de VIP armazenado
            </p>
            <p className="font-black leading-tight">
              {formatVipDuration(totalVipDurationSeconds)}
            </p>
          </div>
        ) : null}
      </div>

      {items.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {items.map((inventoryItem) => (
            <InventoryItemCard
              inventoryItem={inventoryItem}
              key={inventoryItem.id}
              onItemAction={onItemAction}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[18px] border border-dashed border-[var(--homepage-panel-divider)] bg-[linear-gradient(135deg,rgba(255,255,255,0.78)_0px,rgba(255,255,255,0.78)_8px,rgba(229,233,219,0.82)_8px,rgba(229,233,219,0.82)_16px)] p-4 text-sm font-black text-[var(--homepage-panel-text-muted)]">
          {inventoryTypeDetail.emptyMessage}
        </div>
      )}
    </section>
  );
}

function InventoryItemCard({
  inventoryItem,
  onItemAction,
}: Readonly<{
  inventoryItem: InventoryItem;
  onItemAction: (inventoryItem: InventoryItem) => void;
}>) {
  const inventoryTypeDetail = inventoryTypeDetails[inventoryItem.type];
  const InventoryItemIcon = inventoryTypeDetail.icon;

  return (
    <article className="flex flex-col justify-between gap-4 rounded-[20px] border border-[var(--homepage-highlight-border)] bg-[linear-gradient(180deg,var(--homepage-highlight-start)_0%,var(--homepage-highlight-end)_100%)] p-4 shadow-[0_12px_28px_rgba(73,54,20,0.1)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-4">
          <InventoryItemIcon className="h-4 w-4 text-[var(--homepage-vip-text)]" strokeWidth={2.5} />
          <h3 className="text-lg font-black text-[var(--homepage-panel-text-strong)]">
            {inventoryItem.name}
          </h3>
        </div>

        <span className="rounded-full border border-[var(--homepage-panel-divider)] bg-white px-3 py-1 text-sm font-black text-[var(--homepage-panel-text-strong)] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset]">
            x{inventoryItem.quantity}
        </span>
      </div>

      <Button
        className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-black"
        onClick={() => onItemAction(inventoryItem)}
        variant="primary"
      >
        {inventoryTypeDetail.actionLabel}
      </Button>
    </article>
  );
}

function groupInventoryItemsByType(
  inventoryItems: InventoryItem[],
): Record<InventoryItemType, InventoryItem[]> {
  return {
    vip: inventoryItems.filter(
      (inventoryItem) => inventoryItem.type === "vip",
    ),
    transfer_pass: inventoryItems.filter(
      (inventoryItem) => inventoryItem.type === "transfer_pass",
    ),
  };
}

function calculateTotalVipDurationSeconds(inventoryItems: InventoryItem[]): number {
  return inventoryItems.reduce((totalDurationSeconds, inventoryItem) => {
    if (inventoryItem.type !== "vip" || !inventoryItem.durationSeconds) {
      return totalDurationSeconds;
    }

    return totalDurationSeconds + inventoryItem.durationSeconds * inventoryItem.quantity;
  }, 0);
}

function formatVipDuration(totalDurationSeconds: number): string {
  const totalMinutes = Math.floor(totalDurationSeconds / 60);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  const durationParts: string[] = [];

  if (days > 0) {
    durationParts.push(`${days}d`);
  }

  if (hours > 0) {
    durationParts.push(`${hours}h`);
  }

  if (minutes > 0 || durationParts.length === 0) {
    durationParts.push(`${minutes}min`);
  }

  if (durationParts.length === 1) {
    return durationParts[0];
  }

  return `${durationParts.slice(0, -1).join(", ")} e ${durationParts.at(-1)}`;
}
