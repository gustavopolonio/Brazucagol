import { eq, sql } from "drizzle-orm";
import {
  paymentOrders,
  type CaptureMethod,
  type PaymentOrder,
  type PaymentOrderStatus,
} from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

type DbClient = (typeof import("@/lib/drizzle"))["db"];

export type PaymentOrderRow = Pick<
  PaymentOrder,
  | "id"
  | "playerId"
  | "storeItemId"
  | "status"
  | "buyerEmail"
  | "quantity"
  | "unitPriceCents"
  | "amountCents"
  | "orderNsu"
  | "checkoutUrl"
  | "redirectUrl"
  | "webhookUrl"
  | "invoiceSlug"
  | "transactionNsu"
  | "captureMethod"
  | "paidAmountCents"
  | "receiptUrl"
  | "providerPayload"
  | "checkoutRequestedAt"
  | "paidAt"
  | "createdAt"
  | "updatedAt"
>;

interface CreatePaymentOrderProps {
  db: Transaction;
  id: string;
  playerId: string;
  storeItemId: string;
  buyerEmail: string;
  quantity: number;
  unitPriceCents: number;
  amountCents: number;
  orderNsu: string;
  redirectUrl: string;
  webhookUrl: string;
}

export async function createPaymentOrder({
  db,
  id,
  playerId,
  storeItemId,
  buyerEmail,
  quantity,
  unitPriceCents,
  amountCents,
  orderNsu,
  redirectUrl,
  webhookUrl,
}: CreatePaymentOrderProps): Promise<PaymentOrderRow> {
  const rows = await db
    .insert(paymentOrders)
    .values({
      id,
      playerId,
      storeItemId,
      buyerEmail,
      quantity,
      unitPriceCents,
      amountCents,
      orderNsu,
      redirectUrl,
      webhookUrl,
    })
    .returning();

  return rows[0];
}

interface GetPaymentOrderByOrderNsuProps {
  db: Transaction | DbClient;
  orderNsu: string;
}

export async function getPaymentOrderByOrderNsu({
  db,
  orderNsu,
}: GetPaymentOrderByOrderNsuProps): Promise<PaymentOrderRow | null> {
  const rows = await db
    .select()
    .from(paymentOrders)
    .where(eq(paymentOrders.orderNsu, orderNsu))
    .limit(1);

  return rows[0] ?? null;
}

interface GetPaymentOrderByOrderNsuForUpdateProps {
  db: Transaction;
  orderNsu: string;
}

export async function getPaymentOrderByOrderNsuForUpdate({
  db,
  orderNsu,
}: GetPaymentOrderByOrderNsuForUpdateProps): Promise<PaymentOrderRow | null> {
  const result = await db.execute(sql`
    select
      ${paymentOrders.id} as "id",
      ${paymentOrders.playerId} as "playerId",
      ${paymentOrders.storeItemId} as "storeItemId",
      ${paymentOrders.status} as "status",
      ${paymentOrders.buyerEmail} as "buyerEmail",
      ${paymentOrders.quantity} as "quantity",
      ${paymentOrders.unitPriceCents} as "unitPriceCents",
      ${paymentOrders.amountCents} as "amountCents",
      ${paymentOrders.orderNsu} as "orderNsu",
      ${paymentOrders.checkoutUrl} as "checkoutUrl",
      ${paymentOrders.redirectUrl} as "redirectUrl",
      ${paymentOrders.webhookUrl} as "webhookUrl",
      ${paymentOrders.invoiceSlug} as "invoiceSlug",
      ${paymentOrders.transactionNsu} as "transactionNsu",
      ${paymentOrders.captureMethod} as "captureMethod",
      ${paymentOrders.paidAmountCents} as "paidAmountCents",
      ${paymentOrders.receiptUrl} as "receiptUrl",
      ${paymentOrders.providerPayload} as "providerPayload",
      ${paymentOrders.checkoutRequestedAt} as "checkoutRequestedAt",
      ${paymentOrders.paidAt} as "paidAt",
      ${paymentOrders.createdAt} as "createdAt",
      ${paymentOrders.updatedAt} as "updatedAt"
    from ${paymentOrders}
    where ${paymentOrders.orderNsu} = ${orderNsu}
    limit 1
    for update
  `);

  return (result.rows[0] as PaymentOrderRow | undefined) ?? null;
}

interface UpdatePaymentOrderCheckoutCreatedProps {
  db: Transaction | DbClient;
  orderNsu: string;
  checkoutUrl: string;
}

export async function updatePaymentOrderCheckoutCreated({
  db,
  orderNsu,
  checkoutUrl,
}: UpdatePaymentOrderCheckoutCreatedProps): Promise<PaymentOrderRow | null> {
  const rows = await db
    .update(paymentOrders)
    .set({
      status: "checkout_created",
      checkoutUrl,
    })
    .where(eq(paymentOrders.orderNsu, orderNsu))
    .returning();

  return rows[0] ?? null;
}

interface UpdatePaymentOrderStatusProps {
  db: Transaction | DbClient;
  orderNsu: string;
  status: PaymentOrderStatus;
}

export async function updatePaymentOrderStatus({
  db,
  orderNsu,
  status,
}: UpdatePaymentOrderStatusProps): Promise<PaymentOrderRow | null> {
  const rows = await db
    .update(paymentOrders)
    .set({
      status,
    })
    .where(eq(paymentOrders.orderNsu, orderNsu))
    .returning();

  return rows[0] ?? null;
}

interface MarkPaymentOrderAsPaidProps {
  db: Transaction;
  orderNsu: string;
  invoiceSlug: string;
  transactionNsu: string;
  captureMethod: CaptureMethod;
  paidAmountCents: number;
  receiptUrl: string | null;
  providerPayload: Record<string, unknown>;
  paidAt: Date;
}

export async function markPaymentOrderAsPaid({
  db,
  orderNsu,
  invoiceSlug,
  transactionNsu,
  captureMethod,
  paidAmountCents,
  receiptUrl,
  providerPayload,
  paidAt,
}: MarkPaymentOrderAsPaidProps): Promise<PaymentOrderRow | null> {
  const rows = await db
    .update(paymentOrders)
    .set({
      status: "paid",
      invoiceSlug,
      transactionNsu,
      captureMethod,
      paidAmountCents,
      receiptUrl,
      providerPayload,
      paidAt,
    })
    .where(eq(paymentOrders.orderNsu, orderNsu))
    .returning();

  return rows[0] ?? null;
}
