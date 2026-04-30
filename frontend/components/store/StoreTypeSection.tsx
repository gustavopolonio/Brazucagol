"use client";

import { Crown, Ticket } from "lucide-react";

import { StoreItemCard } from "@/components/store/StoreItemCard";
import type { StoreItem, StoreItemType } from "@/components/store/store-data";
import type { CartQuantities } from "@/components/store/store-utils";

const storeTypeDetails: Record<
  StoreItemType,
  {
    description: string;
    title: string;
  }
> = {
  vip: {
    description: "Disponível para compra com dinheiro real (pix ou cartão de crédito).",
    title: "VIPs",
  },
  transfer_pass: {
    description: "Disponível para compra com dinheiro real ou moedas do jogo. Selecione abaixo o modo de compra que preferir.",
    title: "Passe de transferência",
  },
};

export function StoreTypeSection({
  cartQuantities,
  items,
  onCartQuantityChange,
  storeItemType,
}: Readonly<{
  cartQuantities: CartQuantities;
  items: StoreItem[];
  onCartQuantityChange: (storeItemId: string, nextQuantity: number) => void;
  storeItemType: StoreItemType;
}>) {
  const storeTypeDetail = storeTypeDetails[storeItemType];
  const StoreTypeIcon = storeItemType === "vip" ? Crown : Ticket;

  return (
    <section className="rounded-[22px] border border-[var(--homepage-panel-divider)] bg-white/82 p-4 shadow-[0_10px_24px_rgba(73,54,20,0.08)]">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-[var(--homepage-vip-border)] bg-[linear-gradient(180deg,var(--homepage-vip-start)_0%,var(--homepage-vip-end)_100%)] text-[var(--homepage-vip-text)] shadow-[0_6px_14px_var(--homepage-vip-shadow)]">
          <StoreTypeIcon className="h-5 w-5" strokeWidth={2.5} />
        </span>
        <div>
          <h2 className="text-lg font-black text-[var(--homepage-panel-text-strong)]">
            {storeTypeDetail.title}
          </h2>
          <p className="text-sm font-semibold text-[var(--homepage-panel-text-muted)]">
            {storeTypeDetail.description}
          </p>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {items.map((storeItem) => (
          <StoreItemCard
            cartQuantities={cartQuantities}
            key={storeItem.id}
            onCartQuantityChange={onCartQuantityChange}
            storeItem={storeItem}
          />
        ))}
      </div>
    </section>
  );
}
