import { type CaptureMethod } from "@/db/schema";
import { db } from "@/lib/drizzle";
import { insertPlayerItemPurchaseLogWithRealMoney } from "@/repositories/itemPurchaseLogsRepository";
import {
  listPaymentOrderItemsByPaymentOrderId,
  type PaymentOrderItemRow,
} from "@/repositories/paymentOrderItemsRepository";
import {
  getPaymentOrderByOrderNsuForUpdate,
  markPaymentOrderAsPaid,
} from "@/repositories/paymentOrdersRepository";
import { upsertPlayerItemQuantityIncrease } from "@/repositories/playerItemsRepository";
import { createAndDeliverNotification } from "@/services/notification";
import { checkInfinitePayPayment } from "@/services/infinitePay";

export interface InfinitePayWebhookPayload {
  invoice_slug: string;
  amount: number;
  paid_amount: number;
  installments: number;
  capture_method: CaptureMethod;
  transaction_nsu: string;
  order_nsu: string;
  receipt_url?: string;
  items?: unknown[];
}

interface ConfirmInfinitePayWebhookResult {
  success: true;
  message: null;
  alreadyProcessed: boolean;
}

async function notifyFulfilledPaymentOrderItems({
  playerId,
  items,
  captureMethod,
}: {
  playerId: string;
  items: PaymentOrderItemRow[];
  captureMethod: CaptureMethod;
}): Promise<void> {
  for (const item of items) {
    if (item.type === "vip") {
      await createAndDeliverNotification({
        playerId,
        type: "vip_received",
        payload: {
          itemId: item.storeItemId,
          quantity: item.quantity,
          reason: "store_purchase_real_money",
          captureMethod,
        },
      });
      continue;
    }

    if (item.type === "transfer_pass") {
      await createAndDeliverNotification({
        playerId,
        type: "transfer_pass_received",
        payload: {
          itemId: item.storeItemId,
          quantity: item.quantity,
          reason: "store_purchase_real_money",
          captureMethod,
        },
      });
      continue;
    }

    await createAndDeliverNotification({
      playerId,
      type: "system",
      payload: {
        message: "Item received in inventory.",
        itemId: item.storeItemId,
        quantity: item.quantity,
        reason: "store_purchase_real_money",
        captureMethod,
      },
    });
  }
}

export async function confirmInfinitePayWebhookPayment(
  payload: InfinitePayWebhookPayload
): Promise<ConfirmInfinitePayWebhookResult> {
  const paymentVerification = await checkInfinitePayPayment({
    orderNsu: payload.order_nsu,
    transactionNsu: payload.transaction_nsu,
    invoiceSlug: payload.invoice_slug,
  });

  if (!paymentVerification.success || !paymentVerification.paid) {
    throw new Error("InfinitePay payment could not be verified as paid.");
  }

  if (paymentVerification.capture_method !== payload.capture_method) {
    throw new Error("InfinitePay capture method mismatch.");
  }

  const transactionResult = await db.transaction(async (transaction) => {
    const paymentOrder = await getPaymentOrderByOrderNsuForUpdate({
      db: transaction,
      orderNsu: payload.order_nsu,
    });

    if (!paymentOrder) {
      throw new Error("Payment order not found.");
    }

    if (paymentOrder.status === "paid") {
      return {
        playerId: paymentOrder.playerId,
        items: [] as PaymentOrderItemRow[],
        captureMethod: null,
        alreadyProcessed: true,
      };
    }

    if (paymentOrder.amountCents !== payload.amount) {
      throw new Error("InfinitePay webhook amount does not match payment order.");
    }

    if (paymentOrder.amountCents !== paymentVerification.amount) {
      throw new Error("InfinitePay amount does not match payment order.");
    }

    const paymentOrderItems = await listPaymentOrderItemsByPaymentOrderId({
      db: transaction,
      paymentOrderId: paymentOrder.id,
    });

    if (paymentOrderItems.length === 0) {
      throw new Error("Payment order items not found.");
    }

    for (const paymentOrderItem of paymentOrderItems) {
      await upsertPlayerItemQuantityIncrease({
        db: transaction,
        playerId: paymentOrder.playerId,
        itemId: paymentOrderItem.storeItemId,
        quantityToIncrease: paymentOrderItem.quantity,
      });

      await insertPlayerItemPurchaseLogWithRealMoney({
        db: transaction,
        playerId: paymentOrder.playerId,
        itemId: paymentOrderItem.storeItemId,
        unitPrice: paymentOrderItem.unitPriceCents,
        quantity: paymentOrderItem.quantity,
      });
    }

    const paidPaymentOrder = await markPaymentOrderAsPaid({
      db: transaction,
      orderNsu: paymentOrder.orderNsu,
      invoiceSlug: payload.invoice_slug,
      transactionNsu: payload.transaction_nsu,
      captureMethod: paymentVerification.capture_method,
      paidAmountCents: paymentVerification.paid_amount,
      receiptUrl: payload.receipt_url ?? null,
      providerPayload: {
        webhook: payload,
        verification: paymentVerification,
      },
      paidAt: new Date(),
    });

    if (!paidPaymentOrder) {
      throw new Error("Unable to mark payment order as paid.");
    }

    return {
      playerId: paymentOrder.playerId,
      items: paymentOrderItems,
      captureMethod: paymentVerification.capture_method,
      alreadyProcessed: false,
    };
  });

  if (transactionResult.captureMethod !== null && transactionResult.items.length > 0) {
    await notifyFulfilledPaymentOrderItems({
      playerId: transactionResult.playerId,
      items: transactionResult.items,
      captureMethod: transactionResult.captureMethod,
    });
  }

  return {
    success: true,
    message: null,
    alreadyProcessed: transactionResult.alreadyProcessed,
  };
}
