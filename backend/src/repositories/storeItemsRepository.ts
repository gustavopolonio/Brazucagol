import { eq } from "drizzle-orm";
import { storeItems, type StoreItem } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

export type StoreItemEconomyRow = Pick<StoreItem, "id" | "type" | "pricingType" | "coinPriceCents">;

interface GetStoreItemByIdProps {
  db: Transaction;
  storeItemId: string;
}

export async function getStoreItemById({
  db,
  storeItemId,
}: GetStoreItemByIdProps): Promise<StoreItemEconomyRow | null> {
  const rows = await db
    .select({
      id: storeItems.id,
      type: storeItems.type,
      pricingType: storeItems.pricingType,
      coinPriceCents: storeItems.coinPriceCents,
    })
    .from(storeItems)
    .where(eq(storeItems.id, storeItemId))
    .limit(1);

  return rows[0] ?? null;
}
