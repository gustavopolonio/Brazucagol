import { itemPurchaseLogs } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

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
