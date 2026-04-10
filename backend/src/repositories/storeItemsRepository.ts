import { and, eq, inArray } from "drizzle-orm";
import { storeItems, type StoreItem } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

type DbClient = (typeof import("@/lib/drizzle"))["db"];

export type StoreItemEconomyRow = Pick<
  StoreItem,
  | "id"
  | "name"
  | "type"
  | "durationSeconds"
  | "pricingType"
  | "coinPriceCents"
  | "realMoneyPriceCents"
  | "isAvailableInStore"
>;

interface GetStoreItemByIdProps {
  db: Transaction | DbClient;
  storeItemId: string;
}

interface GetStoreItemByTypeAndDurationSecondsProps {
  db: Transaction | DbClient;
  itemType: StoreItem["type"];
  durationSeconds: number;
}

interface ListStoreItemsByIdsProps {
  db: Transaction | DbClient;
  storeItemIds: string[];
}

export async function getStoreItemById({
  db,
  storeItemId,
}: GetStoreItemByIdProps): Promise<StoreItemEconomyRow | null> {
  const rows = await db
    .select({
      id: storeItems.id,
      name: storeItems.name,
      type: storeItems.type,
      durationSeconds: storeItems.durationSeconds,
      pricingType: storeItems.pricingType,
      coinPriceCents: storeItems.coinPriceCents,
      realMoneyPriceCents: storeItems.realMoneyPriceCents,
      isAvailableInStore: storeItems.isAvailableInStore,
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
      name: storeItems.name,
      type: storeItems.type,
      durationSeconds: storeItems.durationSeconds,
      pricingType: storeItems.pricingType,
      coinPriceCents: storeItems.coinPriceCents,
      realMoneyPriceCents: storeItems.realMoneyPriceCents,
      isAvailableInStore: storeItems.isAvailableInStore,
    })
    .from(storeItems)
    .where(and(eq(storeItems.type, itemType), eq(storeItems.durationSeconds, durationSeconds)))
    .limit(1);

  return rows[0] ?? null;
}

export async function listStoreItemsByIds({
  db,
  storeItemIds,
}: ListStoreItemsByIdsProps): Promise<StoreItemEconomyRow[]> {
  if (storeItemIds.length === 0) {
    return [];
  }

  return db
    .select({
      id: storeItems.id,
      name: storeItems.name,
      type: storeItems.type,
      durationSeconds: storeItems.durationSeconds,
      pricingType: storeItems.pricingType,
      coinPriceCents: storeItems.coinPriceCents,
      realMoneyPriceCents: storeItems.realMoneyPriceCents,
      isAvailableInStore: storeItems.isAvailableInStore,
    })
    .from(storeItems)
    .where(inArray(storeItems.id, storeItemIds));
}
