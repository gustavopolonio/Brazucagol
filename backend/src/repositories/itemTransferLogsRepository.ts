import { and, desc, eq, isNotNull, isNull } from "drizzle-orm";
import {
  itemTransferLogs,
  players,
  storeItems,
  type ItemTransferLog,
  type Player,
  type StoreItem,
} from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

type DbClient = (typeof import("@/lib/drizzle"))["db"];

export type ClubToPlayerItemTransferHistoryRow = Pick<
  ItemTransferLog,
  "id" | "itemId" | "toPlayerId" | "quantity" | "reason" | "createdAt"
> &
  Pick<StoreItem, "name" | "type" | "durationSeconds"> & {
    playerName: Player["name"];
  };

interface ListClubToPlayerItemTransferHistoryProps {
  db: Transaction | DbClient;
  clubId: string;
}

export async function listClubToPlayerItemTransferHistory({
  db,
  clubId,
}: ListClubToPlayerItemTransferHistoryProps): Promise<ClubToPlayerItemTransferHistoryRow[]> {
  return db
    .select({
      id: itemTransferLogs.id,
      itemId: itemTransferLogs.itemId,
      toPlayerId: itemTransferLogs.toPlayerId,
      name: storeItems.name,
      type: storeItems.type,
      durationSeconds: storeItems.durationSeconds,
      playerName: players.name,
      quantity: itemTransferLogs.quantity,
      reason: itemTransferLogs.reason,
      createdAt: itemTransferLogs.createdAt,
    })
    .from(itemTransferLogs)
    .innerJoin(storeItems, eq(itemTransferLogs.itemId, storeItems.id))
    .innerJoin(players, eq(itemTransferLogs.toPlayerId, players.id))
    .where(
      and(
        eq(itemTransferLogs.fromClubId, clubId),
        isNull(itemTransferLogs.fromPlayerId),
        isNull(itemTransferLogs.toClubId),
        isNotNull(itemTransferLogs.toPlayerId)
      )
    )
    .orderBy(desc(itemTransferLogs.createdAt), desc(itemTransferLogs.id));
}

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
