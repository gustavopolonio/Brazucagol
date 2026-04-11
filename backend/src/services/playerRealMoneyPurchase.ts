import crypto from "node:crypto";
import { db } from "@/lib/drizzle";
import { env } from "@/env";
import { createPaymentOrderItem } from "@/repositories/paymentOrderItemsRepository";
import { getPlayerIdByUserId } from "@/repositories/playerRepository";
import {
  createPaymentOrder,
  updatePaymentOrderCheckoutCreated,
  updatePaymentOrderStatus,
} from "@/repositories/paymentOrdersRepository";
import { listStoreItemsByIds } from "@/repositories/storeItemsRepository";
import { createInfinitePayCheckoutLink } from "@/services/infinitePay";
import { assertPositiveInteger, assertStoreItemAllowsRealMoney } from "@/utils/validation";

export interface RealMoneyPurchaseItemInput {
  storeItemId: string;
  quantity: number;
}

export interface CreateLoggedPlayerRealMoneyPurchaseParams {
  userId: string;
  userName: string;
  userEmail: string;
  items: RealMoneyPurchaseItemInput[];
}

export interface CreateLoggedPlayerRealMoneyPurchaseResult {
  paymentOrderId: string;
  orderNsu: string;
  checkoutUrl: string;
}

function normalizePurchaseItems(items: RealMoneyPurchaseItemInput[]): RealMoneyPurchaseItemInput[] {
  const quantityByItemId = new Map<string, number>();

  for (const item of items) {
    assertPositiveInteger(item.quantity, "quantity");

    const currentQuantity = quantityByItemId.get(item.storeItemId) ?? 0;
    quantityByItemId.set(item.storeItemId, currentQuantity + item.quantity);
  }

  return Array.from(quantityByItemId.entries()).map(([storeItemId, quantity]) => ({
    storeItemId,
    quantity,
  }));
}

export async function createLoggedPlayerRealMoneyPurchase({
  userId,
  userName,
  userEmail,
  items,
}: CreateLoggedPlayerRealMoneyPurchaseParams): Promise<CreateLoggedPlayerRealMoneyPurchaseResult> {
  if (items.length === 0) {
    throw new Error("items must contain at least one purchase item.");
  }

  const normalizedItems = normalizePurchaseItems(items);

  const player = await getPlayerIdByUserId({
    db,
    userId,
  });

  if (!player) {
    throw new Error("Player not found.");
  }

  const storeItemIds = normalizedItems.map((item) => item.storeItemId);
  const storeItems = await listStoreItemsByIds({
    db,
    storeItemIds,
  });

  if (storeItems.length !== normalizedItems.length) {
    throw new Error("One or more store items were not found.");
  }

  const storeItemById = new Map(storeItems.map((storeItem) => [storeItem.id, storeItem]));
  let totalPriceCents = 0;

  const checkoutItems = normalizedItems.map((purchaseItem) => {
    const storeItem = storeItemById.get(purchaseItem.storeItemId);

    if (!storeItem) {
      throw new Error("One or more store items were not found.");
    }

    if (!storeItem.isAvailableInStore) {
      throw new Error("One or more store items are not available in store.");
    }

    assertStoreItemAllowsRealMoney(
      storeItem.pricingType,
      "One or more store items cannot be purchased with real money."
    );

    if (storeItem.realMoneyPriceCents === null) {
      throw new Error("One or more store items do not have a real money price.");
    }

    const itemAmountCents = storeItem.realMoneyPriceCents * purchaseItem.quantity;
    assertPositiveInteger(itemAmountCents, "itemAmountCents");
    totalPriceCents += itemAmountCents;

    return {
      storeItemId: storeItem.id,
      name: storeItem.name,
      type: storeItem.type,
      quantity: purchaseItem.quantity,
      unitPriceCents: storeItem.realMoneyPriceCents,
      amountCents: itemAmountCents,
      durationSeconds: storeItem.durationSeconds,
    };
  });

  assertPositiveInteger(totalPriceCents, "totalPriceCents");

  const paymentOrderId = crypto.randomUUID();
  const orderNsu = paymentOrderId;

  await db.transaction(async (transaction) => {
    await createPaymentOrder({
      db: transaction,
      id: paymentOrderId,
      playerId: player.id,
      buyerEmail: userEmail,
      amountCents: totalPriceCents,
      orderNsu,
      redirectUrl: env.INFINITEPAY_CHECKOUT_REDIRECT_URL,
      webhookUrl: env.INFINITEPAY_CHECKOUT_WEBHOOK_URL,
    });

    for (const checkoutItem of checkoutItems) {
      await createPaymentOrderItem({
        db: transaction,
        paymentOrderId,
        storeItemId: checkoutItem.storeItemId,
        quantity: checkoutItem.quantity,
        unitPriceCents: checkoutItem.unitPriceCents,
        amountCents: checkoutItem.amountCents,
      });
    }
  });

  try {
    const checkoutResponse = await createInfinitePayCheckoutLink({
      orderNsu,
      customerName: userName,
      customerEmail: userEmail,
      items: checkoutItems.map((checkoutItem) => ({
        quantity: checkoutItem.quantity,
        price: checkoutItem.unitPriceCents,
        description: checkoutItem.name,
      })),
    });

    const updatedPaymentOrder = await updatePaymentOrderCheckoutCreated({
      db,
      orderNsu,
      checkoutUrl: checkoutResponse.url,
    });

    if (!updatedPaymentOrder) {
      throw new Error("Payment order not found after checkout creation.");
    }

    if (!updatedPaymentOrder.checkoutUrl) {
      throw new Error("Payment checkout URL not found after checkout creation.");
    }

    return {
      paymentOrderId: updatedPaymentOrder.id,
      orderNsu: updatedPaymentOrder.orderNsu,
      checkoutUrl: updatedPaymentOrder.checkoutUrl,
    };
  } catch (error) {
    await updatePaymentOrderStatus({
      db,
      orderNsu,
      status: "failed",
    });

    throw error;
  }
}
