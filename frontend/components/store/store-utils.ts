import type { StoreItem, StoreItemType } from "@/components/store/store-data";

export type CartPaymentMethod = "real_money" | "coins";

export type CartItem = {
  item: StoreItem;
  paymentMethod: CartPaymentMethod;
  quantity: number;
};

export type CartQuantities = Record<string, number>;

export const realMoneyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  style: "currency",
});

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function groupStoreItemsByType(
  items: StoreItem[],
): Record<StoreItemType, StoreItem[]> {
  return {
    vip: items.filter((storeItem) => storeItem.type === "vip"),
    transfer_pass: items.filter((storeItem) => storeItem.type === "transfer_pass"),
  };
}

export function getCartItems(
  storeItems: StoreItem[],
  cartQuantities: CartQuantities,
): CartItem[] {
  return storeItems.flatMap((storeItem) => {
    const realMoneyQuantity = cartQuantities[getCartQuantityKey(storeItem.id, "real_money")] ?? 0;
    const coinQuantity = cartQuantities[getCartQuantityKey(storeItem.id, "coins")] ?? 0;
    const cartItems: CartItem[] = [];

    if (realMoneyQuantity > 0) {
      cartItems.push({
        item: storeItem,
        paymentMethod: "real_money",
        quantity: realMoneyQuantity,
      });
    }

    if (storeItem.coinPriceCents && coinQuantity > 0) {
      cartItems.push({
        item: storeItem,
        paymentMethod: "coins",
        quantity: coinQuantity,
      });
    }

    return cartItems;
  });
}

export function getCartTotalCents(cartItems: CartItem[]): number {
  return cartItems.reduce(
    (totalCents, cartItem) =>
      cartItem.paymentMethod === "real_money"
        ? totalCents + cartItem.item.realMoneyPriceCents * cartItem.quantity
        : totalCents,
    0,
  );
}

export function getCartTotalCoins(cartItems: CartItem[]): number {
  return cartItems.reduce(
    (totalCoins, cartItem) =>
      cartItem.paymentMethod === "coins" && cartItem.item.coinPriceCents
        ? totalCoins + cartItem.item.coinPriceCents * cartItem.quantity
        : totalCoins,
    0,
  );
}

export function getTotalCartQuantity(cartItems: CartItem[]): number {
  return cartItems.reduce(
    (totalQuantity, cartItem) => totalQuantity + cartItem.quantity,
    0,
  );
}

export function formatGameCoins(coins: number): string {
  return numberFormatter.format(coins);
}

export function getCartQuantityKey(
  storeItemId: string,
  paymentMethod: CartPaymentMethod,
): string {
  return `${paymentMethod}:${storeItemId}`;
}

export function getStoreItemDescription(storeItem: StoreItem): string {
  if (storeItem.type === "vip") {
    return `Inclui 1 VIP com duração de ${formatStoreDuration(storeItem.durationSeconds)}.`;
  }

  return "Inclui 1 passe para trocar de time.";
}

function formatStoreDuration(durationSeconds?: number): string {
  if (!durationSeconds) {
    return "VIP";
  }

  const totalMinutes = Math.floor(durationSeconds / 60);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days} ${days === 1 ? "dia" : "dias"}`;
  }

  if (hours > 0) {
    return `${hours} ${hours === 1 ? "hora" : "horas"}`;
  }

  return `${minutes} minutos`;
}
