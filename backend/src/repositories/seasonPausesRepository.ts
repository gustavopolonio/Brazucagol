import { eq } from "drizzle-orm";
import { seasonPauses } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

interface DeleteSeasonPausesBySeasonIdProps {
  db: Transaction;
  seasonId: string;
}

export async function deleteSeasonPausesBySeasonId({
  db,
  seasonId,
}: DeleteSeasonPausesBySeasonIdProps) {
  await db.delete(seasonPauses).where(eq(seasonPauses.seasonId, seasonId));
}

type CreateSeasonPauseInput = {
  date: Date;
  reason?: string;
};

interface CreateSeasonPausesProps {
  db: Transaction;
  seasonId: string;
  pauses: CreateSeasonPauseInput[];
}

export async function createSeasonPauses({ db, seasonId, pauses }: CreateSeasonPausesProps) {
  await db.insert(seasonPauses).values(
    pauses.map((pause) => ({
      seasonId,
      date: pause.date,
      reason: pause.reason,
    }))
  );
}
