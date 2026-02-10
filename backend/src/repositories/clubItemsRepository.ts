import { and, eq, sql } from "drizzle-orm";
import { clubItems, type ClubItem } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

export type ClubItemQuantityRow = Pick<ClubItem, "clubId" | "itemId" | "quantity">;

interface GetClubItemQuantityForUpdateProps {
  db: Transaction;
  clubId: string;
  itemId: string;
}

export async function getClubItemQuantityForUpdate({
  db,
  clubId,
  itemId,
}: GetClubItemQuantityForUpdateProps): Promise<ClubItemQuantityRow | null> {
  const result = await db.execute(sql`
    select
      ${clubItems.clubId} as "clubId",
      ${clubItems.itemId} as "itemId",
      ${clubItems.quantity} as "quantity"
    from ${clubItems}
    where ${clubItems.clubId} = ${clubId}
      and ${clubItems.itemId} = ${itemId}
    limit 1
    for update
  `);

  return (result.rows[0] as ClubItemQuantityRow | undefined) ?? null;
}

interface UpsertClubItemQuantityIncreaseProps {
  db: Transaction;
  clubId: string;
  itemId: string;
  quantityToIncrease: number;
}

export async function upsertClubItemQuantityIncrease({
  db,
  clubId,
  itemId,
  quantityToIncrease,
}: UpsertClubItemQuantityIncreaseProps): Promise<ClubItemQuantityRow> {
  const rows = await db
    .insert(clubItems)
    .values({
      clubId,
      itemId,
      quantity: quantityToIncrease,
    })
    .onConflictDoUpdate({
      target: [clubItems.clubId, clubItems.itemId],
      set: {
        quantity: sql<number>`${clubItems.quantity} + ${quantityToIncrease}`,
        updatedAt: sql`now()`,
      },
    })
    .returning({
      clubId: clubItems.clubId,
      itemId: clubItems.itemId,
      quantity: clubItems.quantity,
    });

  return rows[0];
}

interface SetClubItemQuantityProps {
  db: Transaction;
  clubId: string;
  itemId: string;
  quantity: number;
}

export async function setClubItemQuantity({
  db,
  clubId,
  itemId,
  quantity,
}: SetClubItemQuantityProps): Promise<ClubItemQuantityRow | null> {
  const rows = await db
    .update(clubItems)
    .set({
      quantity,
    })
    .where(and(eq(clubItems.clubId, clubId), eq(clubItems.itemId, itemId)))
    .returning({
      clubId: clubItems.clubId,
      itemId: clubItems.itemId,
      quantity: clubItems.quantity,
    });

  return rows[0] ?? null;
}
