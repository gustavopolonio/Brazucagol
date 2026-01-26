import { desc, lte } from "drizzle-orm";
import { levels, type Level } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

export type LevelRow = Pick<Level, "id" | "requiredTotalGoals">;

interface GetLevelForTotalGoalsProps {
  db: Transaction;
  totalGoals: number;
}

export async function getLevelForTotalGoals({
  db,
  totalGoals,
}: GetLevelForTotalGoalsProps): Promise<LevelRow | null> {
  const rows = await db
    .select({
      id: levels.id,
      requiredTotalGoals: levels.requiredTotalGoals,
    })
    .from(levels)
    .where(lte(levels.requiredTotalGoals, totalGoals))
    .orderBy(desc(levels.requiredTotalGoals))
    .limit(1);

  return rows[0] ?? null;
}
