"use client";

import { ChevronRight, Coins, CreditCard, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/Button";
import type { CartItem } from "@/components/store/store-utils";
import { formatGameCoins, realMoneyFormatter } from "@/components/store/store-utils";

export function StoreCart({
  cartItems,
  cartTotalCents,
  cartTotalCoins,
  onCheckout,
  totalCartQuantity,
}: Readonly<{
  cartItems: CartItem[];
  cartTotalCents: number;
  cartTotalCoins: number;
  onCheckout: () => void;
  totalCartQuantity: number;
}>) {
  return (
    <aside className="h-fit rounded-[22px] border border-[var(--homepage-panel-divider)] bg-white/90 p-4 shadow-[0_10px_24px_rgba(73,54,20,0.08)]">
      <div className="flex items-center gap-3 px-3 py-2 rounded-[14px] border border-[var(--homepage-vip-border)] bg-[linear-gradient(180deg,var(--homepage-vip-start)_0%,var(--homepage-vip-end)_100%)] text-[var(--homepage-vip-text)] shadow-[0_6px_14px_var(--homepage-vip-shadow)]">
        <ShoppingCart className="h-5 w-5" strokeWidth={2.5} />
        <h2 className="text-lg font-black">
          Carrinho
        </h2>
      </div>

      <div className="mt-4 space-y-3">
        {cartItems.length > 0 ? (
          cartItems.map((cartItem) => (
            <div
              className="rounded-[16px] border border-[var(--homepage-panel-divider)] bg-[var(--homepage-highlight-start)] p-3"
              key={`${cartItem.paymentMethod}:${cartItem.item.id}`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-black text-[var(--homepage-panel-text-strong)]">
                  {cartItem.item.name}
                </p>
                <div className="flex shrink-0 items-center gap-2">
                  {cartItem.paymentMethod === "real_money" ? (
                    <CreditCard className="h-4 w-4 text-[var(--homepage-highlight-label)]" />
                  ) : (
                    <Coins className="h-4 w-4 text-[var(--homepage-stat-highlight)]" />
                  )}
                  <p className="text-sm font-black text-[var(--homepage-highlight-label)]">
                    x{cartItem.quantity}
                  </p>
                </div>
              </div>
              <p className="mt-1 text-sm font-bold text-[var(--homepage-panel-text-muted)]">
                {cartItem.paymentMethod === "real_money"
                  ? realMoneyFormatter.format(
                    (cartItem.item.realMoneyPriceCents * cartItem.quantity) / 100,
                  )
                  : `${formatGameCoins((cartItem.item.coinPriceCents ?? 0) * cartItem.quantity)} moedas`}
              </p>
            </div>
          ))
        ) : (
          <p className="rounded-[16px] border border-dashed border-[var(--homepage-panel-divider)] bg-[var(--homepage-highlight-start)] p-3 text-sm font-bold text-[var(--homepage-panel-text-muted)]">
            Adicione itens para finalizar a compra.
          </p>
        )}
      </div>

      {cartTotalCents > 0 || cartTotalCoins > 0 ? (
        <div className="mt-5 space-y-2">
          {cartTotalCents > 0 ? (
            <div className="rounded-[18px] border border-[var(--homepage-vip-border)] bg-[linear-gradient(180deg,var(--homepage-vip-start)_0%,var(--homepage-vip-end)_100%)] px-4 py-3 text-[var(--homepage-vip-text)] shadow-[0_6px_14px_var(--homepage-vip-shadow)]">
              <p className="text-xs font-black uppercase tracking-[0.14em]">Total em R$</p>
              <p className="mt-1 text-2xl font-black leading-none">
                {realMoneyFormatter.format(cartTotalCents / 100)}
              </p>
            </div>
          ) : null}

          {cartTotalCoins > 0 ? (
            <div className="rounded-[18px] border border-[var(--homepage-highlight-border)] bg-[linear-gradient(180deg,var(--homepage-highlight-start)_0%,var(--homepage-highlight-end)_100%)] px-4 py-3 text-[var(--homepage-stat-highlight)] shadow-[0_6px_14px_rgba(73,54,20,0.08)]">
              <p className="text-xs font-black uppercase tracking-[0.14em]">Total em moedas</p>
              <p className="mt-1 text-2xl font-black leading-none">
                {formatGameCoins(cartTotalCoins)}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      <Button
        className="mt-4 w-full gap-2 rounded-full px-5 py-3 text-sm font-black"
        disabled={totalCartQuantity === 0}
        onClick={onCheckout}
        variant="primary"
      >
        Finalizar compra
        <ChevronRight className="h-4 w-4" strokeWidth={3} />
      </Button>
    </aside>
  );
}
