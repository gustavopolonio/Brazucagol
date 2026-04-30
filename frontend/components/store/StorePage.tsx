"use client";

import { useMemo, useState } from "react";
import { ShoppingCart, Store } from "lucide-react";

import { PanelCard } from "@/components/layout/PanelCard";
import { InfoBox } from "@/components/ui/InfoBox";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { StoreCart } from "@/components/store/StoreCart";
import { StoreTypeSection } from "@/components/store/StoreTypeSection";
import {
  simulatedCheckoutUrl,
  storeItems,
  type StoreItemType,
} from "@/components/store/store-data";
import {
  getCartItems,
  getCartTotalCents,
  getCartTotalCoins,
  getTotalCartQuantity,
  groupStoreItemsByType,
  type CartQuantities,
} from "@/components/store/store-utils";

const storeTypeOrder: StoreItemType[] = ["vip", "transfer_pass"];

export function StorePage() {
  const [cartQuantities, setCartQuantities] = useState<CartQuantities>({});

  const itemsByType = useMemo(() => groupStoreItemsByType(storeItems), []);
  const cartItems = getCartItems(storeItems, cartQuantities);
  const cartTotalCents = getCartTotalCents(cartItems);
  const cartTotalCoins = getCartTotalCoins(cartItems);
  const totalCartQuantity = getTotalCartQuantity(cartItems);
  const storeTabs: TabItem<StoreItemType>[] = storeTypeOrder.map((storeItemType) => ({
    content: (
      <StoreTypeSection
        cartQuantities={cartQuantities}
        items={itemsByType[storeItemType]}
        onCartQuantityChange={handleCartQuantityChange}
        storeItemType={storeItemType}
      />
    ),
    label: storeItemType === "vip" ? "VIPs" : "Transferência",
    value: storeItemType,
  }));

  function handleCartQuantityChange(storeItemId: string, nextQuantity: number) {
    setCartQuantities((currentCartQuantities) => {
      const safeQuantity = Math.max(nextQuantity, 0);

      if (safeQuantity === 0) {
        const nextCartQuantities = { ...currentCartQuantities };
        delete nextCartQuantities[storeItemId];
        return nextCartQuantities;
      }

      return {
        ...currentCartQuantities,
        [storeItemId]: safeQuantity,
      };
    });
  }

  function handleRealMoneyCheckout() {
    window.location.href = simulatedCheckoutUrl;
  }

  return (
    <PanelCard
      title={
        <span className="inline-flex items-center gap-2">
          <Store className="h-4 w-4" />
          Loja
        </span>
      }
    >
      <main className="rounded-b-[18px] border border-border bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-panel-surface-soft)_100%)] px-4 pb-4 pt-10 opacity-95">
        <section className="overflow-hidden rounded-[28px] border border-[var(--homepage-panel-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,245,245,0.98)_100%)] shadow-[0_20px_38px_rgba(73,54,20,0.12)]">
          <div className="border-b border-[var(--homepage-panel-divider)] bg-[linear-gradient(135deg,rgba(132,212,0,0.18)_0%,rgba(78,182,255,0.16)_100%)] px-5 py-5 md:px-7">
            <div className="flex flex-col gap-3">
              <div className="inline-flex w-fit items-center gap-3 rounded-full bg-white/80 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
                <ShoppingCart className="h-5 w-5 text-[var(--homepage-highlight-label)]" />
                <span className="text-sm font-black uppercase tracking-[0.16em] text-[var(--homepage-highlight-label)]">
                  Itens do jogo
                </span>
              </div>
              <p className="text-sm font-semibold text-[var(--homepage-panel-text)] md:text-base">
                Compre itens para melhorar sua performance.
              </p>
            </div>
          </div>

          <div className="grid gap-5 px-3 py-3 md:px-5 md:py-5 2xl:grid-cols-[1fr_270px]">
            <Tabs defaultValue="vip" tabs={storeTabs} />

            <div className="space-y-3">
              <StoreCart
                cartItems={cartItems}
                cartTotalCents={cartTotalCents}
                cartTotalCoins={cartTotalCoins}
                onCheckout={handleRealMoneyCheckout}
                totalCartQuantity={totalCartQuantity}
              />
              <InfoBox>
                Após a compra, os itens podem levar alguns minutos para ficarem disponíveis no seu inventário.
              </InfoBox>
            </div>
          </div>
        </section>
      </main>
    </PanelCard>
  );
}
