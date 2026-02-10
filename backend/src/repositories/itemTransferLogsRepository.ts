import { itemTransferLogs } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

interface InsertItemTransferLogProps {
  db: Transaction;
  itemId: string;
  fromClubId: string | null;
  fromPlayerId: string | null;
  toClubId: string | null;
  toPlayerId: string | null;
  quantity: number;
  reason: string;
}

export async function insertItemTransferLog({
  db,
  itemId,
  fromClubId,
  fromPlayerId,
  toClubId,
  toPlayerId,
  quantity,
  reason,
}: InsertItemTransferLogProps): Promise<void> {
  await db.insert(itemTransferLogs).values({
    itemId,
    fromClubId,
    fromPlayerId,
    toClubId,
    toPlayerId,
    quantity,
    reason,
  });
}
