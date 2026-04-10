import { asc, eq } from "drizzle-orm";
import { paymentOrderItems, storeItems, type PaymentOrderItem, type StoreItem } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

type DbClient = (typeof import("@/lib/drizzle"))["db"];

export type PaymentOrderItemRow = Pick<
  PaymentOrderItem,
  | "id"
  | "paymentOrderId"
  | "storeItemId"
  | "quantity"
  | "unitPriceCents"
  | "amountCents"
  | "createdAt"
> &
  Pick<StoreItem, "name" | "type" | "durationSeconds">;

interface CreatePaymentOrderItemProps {
  db: Transaction;
  paymentOrderId: string;
  storeItemId: string;
  quantity: number;
  unitPriceCents: number;
  amountCents: number;
}

export async function createPaymentOrderItem({
  db,
  paymentOrderId,
  storeItemId,
  quantity,
  unitPriceCents,
  amountCents,
}: CreatePaymentOrderItemProps): Promise<void> {
  await db.insert(paymentOrderItems).values({
    paymentOrderId,
    storeItemId,
    quantity,
    unitPriceCents,
    amountCents,
  });
}

interface ListPaymentOrderItemsByPaymentOrderIdProps {
  db: Transaction | DbClient;
  paymentOrderId: string;
}

export async function listPaymentOrderItemsByPaymentOrderId({
  db,
  paymentOrderId,
}: ListPaymentOrderItemsByPaymentOrderIdProps): Promise<PaymentOrderItemRow[]> {
  return db
    .select({
      id: paymentOrderItems.id,
      paymentOrderId: paymentOrderItems.paymentOrderId,
      storeItemId: paymentOrderItems.storeItemId,
      quantity: paymentOrderItems.quantity,
      unitPriceCents: paymentOrderItems.unitPriceCents,
      amountCents: paymentOrderItems.amountCents,
      createdAt: paymentOrderItems.createdAt,
      name: storeItems.name,
      type: storeItems.type,
      durationSeconds: storeItems.durationSeconds,
    })
    .from(paymentOrderItems)
    .innerJoin(storeItems, eq(paymentOrderItems.storeItemId, storeItems.id))
    .where(eq(paymentOrderItems.paymentOrderId, paymentOrderId))
    .orderBy(asc(paymentOrderItems.createdAt), asc(paymentOrderItems.id));
}
