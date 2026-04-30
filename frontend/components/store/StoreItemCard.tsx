"use client";

import { useState } from "react";
import { Coins, CreditCard, Crown, Minus, Plus, Ticket } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { RadioPill } from "@/components/ui/RadioPill";
import type { StoreItem } from "@/components/store/store-data";
import {
  type CartPaymentMethod,
  formatGameCoins,
  getCartQuantityKey,
  getStoreItemDescription,
  realMoneyFormatter,
  type CartQuantities,
} from "@/components/store/store-utils";

export function StoreItemCard({
  cartQuantities,
  onCartQuantityChange,
  storeItem,
}: Readonly<{
  cartQuantities: CartQuantities;
  onCartQuantityChange: (storeItemId: string, nextQuantity: number) => void;
  storeItem: StoreItem;
}>) {
  const StoreItemIcon = storeItem.type === "vip" ? Crown : Ticket;
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<CartPaymentMethod>("real_money");
  const realMoneyCartKey = getCartQuantityKey(storeItem.id, "real_money");
  const coinCartKey = getCartQuantityKey(storeItem.id, "coins");
  const realMoneyCartQuantity = cartQuantities[realMoneyCartKey] ?? 0;
  const coinCartQuantity = cartQuantities[coinCartKey] ?? 0;
  const selectedCartKey =
    selectedPaymentMethod === "real_money" ? realMoneyCartKey : coinCartKey;
  const selectedCartQuantity =
    selectedPaymentMethod === "real_money" ? realMoneyCartQuantity : coinCartQuantity;
  const canSelectCoins = storeItem.coinPriceCents !== undefined;

  return (
    <article className="flex flex-col gap-3.5 justify-between rounded-[20px] border border-[var(--homepage-highlight-border)] bg-[linear-gradient(180deg,var(--homepage-highlight-start)_0%,var(--homepage-highlight-end)_100%)] p-4 shadow-[0_12px_28px_rgba(73,54,20,0.1)]">
      <div className="space-y-1">
        <div className="min-w-0 flex items-center gap-3">
          <StoreItemIcon
            className="mt-0.5 h-4 w-4 shrink-0 text-[var(--homepage-vip-text)]"
            strokeWidth={2.5}
          />
          <h3 className="text-lg font-black text-[var(--homepage-panel-text-strong)]">
            {storeItem.name}
          </h3>
        </div>
        <p className="text-sm font-semibold text-[var(--homepage-panel-text-muted)]">
          {getStoreItemDescription(storeItem)}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <RadioPill
          checked={selectedPaymentMethod === "real_money"}
          className="text-[var(--homepage-highlight-label)]"
          name={`payment-method-${storeItem.id}`}
          onChange={() => setSelectedPaymentMethod("real_money")}
        >
          <CreditCard className="h-4 w-4" />
          <span>{realMoneyFormatter.format(storeItem.realMoneyPriceCents / 100)}</span>
        </RadioPill>
        {storeItem.coinPriceCents ? (
          <>
            <span className="text-sm font-semibold text-[var(--homepage-panel-text-muted)]">
          ou
            </span>
            <RadioPill
              checked={selectedPaymentMethod === "coins"}
              className="text-[var(--homepage-stat-highlight)]"
              name={`payment-method-${storeItem.id}`}
              onChange={() => setSelectedPaymentMethod("coins")}
            >
              <Coins className="h-4 w-4" />
              <span>{formatGameCoins(storeItem.coinPriceCents)}</span>
            </RadioPill>
          </>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 rounded-full bg-white/75 p-1">
          <Button
            aria-label={`Remover ${storeItem.name} do carrinho`}
            className="flex h-9 w-9 items-center justify-center rounded-full"
            disabled={selectedCartQuantity === 0}
            onClick={() => onCartQuantityChange(selectedCartKey, selectedCartQuantity - 1)}
            variant="secondary"
          >
            <Minus className="h-4 w-4" strokeWidth={3} />
          </Button>
          <span className="text-sm font-black text-[var(--homepage-panel-text-strong)]">
            {selectedCartQuantity}
          </span>
          <Button
            aria-label={`Adicionar ${storeItem.name} ao carrinho`}
            className="flex h-9 w-9 items-center justify-center rounded-full"
            disabled={selectedPaymentMethod === "coins" && !canSelectCoins}
            onClick={() => onCartQuantityChange(selectedCartKey, selectedCartQuantity + 1)}
            variant="secondary"
          >
            <Plus className="h-4 w-4" strokeWidth={3} />
          </Button>
        </div>
      </div>
    </article>
  );
}
