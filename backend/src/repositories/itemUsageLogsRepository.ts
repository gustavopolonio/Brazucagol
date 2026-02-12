import { itemUsageLogs } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

interface InsertPlayerItemUsageLogProps {
  db: Transaction;
  itemId: string;
  playerId: string;
  quantityUsed: number;
  reason: string;
}

export async function insertPlayerItemUsageLog({
  db,
  itemId,
  playerId,
  quantityUsed,
  reason,
}: InsertPlayerItemUsageLogProps): Promise<void> {
  await db.insert(itemUsageLogs).values({
    itemId,
    playerId,
    clubId: null,
    quantityUsed,
    reason,
  });
}
