import { asc, eq } from "drizzle-orm";
import { seasonPauses } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

type DbClient = (typeof import("@/lib/drizzle"))["db"];

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

interface GetSeasonPausesBySeasonIdProps {
  db: Transaction | DbClient;
  seasonId: string;
}

export async function getSeasonPausesBySeasonId({ db, seasonId }: GetSeasonPausesBySeasonIdProps) {
  return db
    .select({
      id: seasonPauses.id,
      date: seasonPauses.date,
      reason: seasonPauses.reason,
    })
    .from(seasonPauses)
    .where(eq(seasonPauses.seasonId, seasonId))
    .orderBy(asc(seasonPauses.date));
}
