import { sql } from "drizzle-orm";
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
