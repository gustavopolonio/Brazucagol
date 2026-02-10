import { and, eq, sql } from "drizzle-orm";
import { playerItems, type PlayerItem } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

export type PlayerItemQuantityRow = Pick<PlayerItem, "playerId" | "itemId" | "quantity">;

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
