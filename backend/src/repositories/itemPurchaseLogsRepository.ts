import { and, desc, eq, isNotNull } from "drizzle-orm";
import { itemPurchaseLogs, storeItems, type ItemPurchaseLog, type StoreItem } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

type DbClient = (typeof import("@/lib/drizzle"))["db"];

export type ClubPurchaseHistoryRow = Pick<
  ItemPurchaseLog,
  "id" | "itemId" | "paymentMethod" | "unitPrice" | "quantity" | "purchasedAt"
> &
  Pick<StoreItem, "name" | "type" | "durationSeconds">;

interface ListClubPurchaseHistoryProps {
  db: Transaction | DbClient;
  clubId: string;
}

export async function listClubPurchaseHistory({
  db,
  clubId,
}: ListClubPurchaseHistoryProps): Promise<ClubPurchaseHistoryRow[]> {
  return db
    .select({
      id: itemPurchaseLogs.id,
      itemId: itemPurchaseLogs.itemId,
      name: storeItems.name,
      type: storeItems.type,
      durationSeconds: storeItems.durationSeconds,
      paymentMethod: itemPurchaseLogs.paymentMethod,
      unitPrice: itemPurchaseLogs.unitPrice,
      quantity: itemPurchaseLogs.quantity,
      purchasedAt: itemPurchaseLogs.purchasedAt,
    })
    .from(itemPurchaseLogs)
    .innerJoin(storeItems, eq(itemPurchaseLogs.itemId, storeItems.id))
    .where(and(eq(itemPurchaseLogs.clubId, clubId), isNotNull(itemPurchaseLogs.clubId)))
    .orderBy(desc(itemPurchaseLogs.purchasedAt), desc(itemPurchaseLogs.id));
}

interface InsertClubItemPurchaseLogWithCoinsProps {
  db: Transaction;
  clubId: string;
  itemId: string;
  unitPrice: number;
  quantity: number;
}

export async function insertClubItemPurchaseLogWithCoins({
  db,
  clubId,
  itemId,
  unitPrice,
  quantity,
}: InsertClubItemPurchaseLogWithCoinsProps): Promise<void> {
  await db.insert(itemPurchaseLogs).values({
    itemId,
    clubId,
    playerId: null,
    paymentMethod: "coins",
    unitPrice,
    quantity,
  });
}

interface InsertPlayerItemPurchaseLogWithCoinsProps {
  db: Transaction;
  playerId: string;
  itemId: string;
  unitPrice: number;
  quantity: number;
}

export async function insertPlayerItemPurchaseLogWithCoins({
  db,
  playerId,
  itemId,
  unitPrice,
  quantity,
}: InsertPlayerItemPurchaseLogWithCoinsProps): Promise<void> {
  await db.insert(itemPurchaseLogs).values({
    itemId,
    clubId: null,
    playerId,
    paymentMethod: "coins",
    unitPrice,
    quantity,
  });
}
