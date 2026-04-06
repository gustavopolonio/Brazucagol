import { and, asc, eq, gt, sql } from "drizzle-orm";
import { playerItems, storeItems, type PlayerItem, type StoreItem } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

export type PlayerItemQuantityRow = Pick<PlayerItem, "playerId" | "itemId" | "quantity">;
export type PlayerInventoryItemRow = Pick<StoreItem, "id" | "name" | "type" | "durationSeconds"> &
  Pick<PlayerItem, "quantity">;

type DbClient = (typeof import("@/lib/drizzle"))["db"];

interface ListPlayerInventoryItemsByPlayerIdProps {
  db: Transaction | DbClient;
  playerId: string;
}

export async function listPlayerInventoryItemsByPlayerId({
  db,
  playerId,
}: ListPlayerInventoryItemsByPlayerIdProps): Promise<PlayerInventoryItemRow[]> {
  return db
    .select({
      id: storeItems.id,
      name: storeItems.name,
      type: storeItems.type,
      durationSeconds: storeItems.durationSeconds,
      quantity: playerItems.quantity,
    })
    .from(playerItems)
    .innerJoin(storeItems, eq(playerItems.itemId, storeItems.id))
    .where(and(eq(playerItems.playerId, playerId), gt(playerItems.quantity, 0)))
    .orderBy(asc(storeItems.name));
}

interface UpsertPlayerItemQuantityIncreaseProps {
  db: Transaction;
  playerId: string;
  itemId: string;
  quantityToIncrease: number;
}

export async function upsertPlayerItemQuantityIncrease({
  db,
  playerId,
  itemId,
  quantityToIncrease,
}: UpsertPlayerItemQuantityIncreaseProps): Promise<PlayerItemQuantityRow> {
  const rows = await db
    .insert(playerItems)
    .values({
      playerId,
      itemId,
      quantity: quantityToIncrease,
    })
    .onConflictDoUpdate({
      target: [playerItems.playerId, playerItems.itemId],
      set: {
        quantity: sql<number>`${playerItems.quantity} + ${quantityToIncrease}`,
        updatedAt: sql`now()`,
      },
    })
    .returning({
      playerId: playerItems.playerId,
      itemId: playerItems.itemId,
      quantity: playerItems.quantity,
    });

  return rows[0];
}

interface GetPlayerItemQuantityForUpdateProps {
  db: Transaction;
  playerId: string;
  itemId: string;
}

export async function getPlayerItemQuantityForUpdate({
  db,
  playerId,
  itemId,
}: GetPlayerItemQuantityForUpdateProps): Promise<PlayerItemQuantityRow | null> {
  const result = await db.execute(sql`
    select
      ${playerItems.playerId} as "playerId",
      ${playerItems.itemId} as "itemId",
      ${playerItems.quantity} as "quantity"
    from ${playerItems}
    where ${playerItems.playerId} = ${playerId}
      and ${playerItems.itemId} = ${itemId}
    limit 1
    for update
  `);

  return (result.rows[0] as PlayerItemQuantityRow | undefined) ?? null;
}

interface DecrementPlayerItemQuantityProps {
  db: Transaction;
  playerId: string;
  itemId: string;
  quantityToDecrease: number;
}

export async function decrementPlayerItemQuantity({
  db,
  playerId,
  itemId,
  quantityToDecrease,
}: DecrementPlayerItemQuantityProps): Promise<PlayerItemQuantityRow | null> {
  const rows = await db
    .update(playerItems)
    .set({
      quantity: sql<number>`${playerItems.quantity} - ${quantityToDecrease}`,
      updatedAt: sql`now()`,
    })
    .where(
      and(
        eq(playerItems.playerId, playerId),
        eq(playerItems.itemId, itemId),
        sql`${playerItems.quantity} >= ${quantityToDecrease}`
      )
    )
    .returning({
      playerId: playerItems.playerId,
      itemId: playerItems.itemId,
      quantity: playerItems.quantity,
    });

  return rows[0] ?? null;
}
