import { and, eq } from "drizzle-orm";
import { storeItems, type StoreItem } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

export type StoreItemEconomyRow = Pick<
  StoreItem,
  "id" | "type" | "durationSeconds" | "pricingType" | "coinPriceCents"
>;

interface GetStoreItemByIdProps {
  db: Transaction;
  storeItemId: string;
}

interface GetStoreItemByTypeAndDurationSecondsProps {
  db: Transaction;
  itemType: StoreItem["type"];
  durationSeconds: number;
}

export async function getStoreItemById({
  db,
  storeItemId,
}: GetStoreItemByIdProps): Promise<StoreItemEconomyRow | null> {
  const rows = await db
    .select({
      id: storeItems.id,
      type: storeItems.type,
      durationSeconds: storeItems.durationSeconds,
      pricingType: storeItems.pricingType,
      coinPriceCents: storeItems.coinPriceCents,
    })
    .from(storeItems)
    .where(eq(storeItems.id, storeItemId))
    .limit(1);

  return rows[0] ?? null;
}

export async function getStoreItemByTypeAndDurationSeconds({
  db,
  itemType,
  durationSeconds,
}: GetStoreItemByTypeAndDurationSecondsProps): Promise<StoreItemEconomyRow | null> {
  const rows = await db
    .select({
      id: storeItems.id,
      type: storeItems.type,
      durationSeconds: storeItems.durationSeconds,
      pricingType: storeItems.pricingType,
      coinPriceCents: storeItems.coinPriceCents,
    })
    .from(storeItems)
    .where(and(eq(storeItems.type, itemType), eq(storeItems.durationSeconds, durationSeconds)))
    .limit(1);

  return rows[0] ?? null;
}
