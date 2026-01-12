import { and, asc, eq, sql } from "drizzle-orm";
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

interface DeleteSeasonPauseByIdProps {
  db: Transaction;
  seasonId: string;
  pauseId: string;
}

export async function deleteSeasonPauseById({ db, seasonId, pauseId }: DeleteSeasonPauseByIdProps) {
  return db
    .delete(seasonPauses)
    .where(and(eq(seasonPauses.id, pauseId), eq(seasonPauses.seasonId, seasonId)))
    .returning({ id: seasonPauses.id });
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
  const insert = db.insert(seasonPauses).values(
    pauses.map((pause) => ({
      seasonId,
      date: pause.date,
      reason: pause.reason,
    }))
  );

  await insert.onConflictDoUpdate({
    target: [seasonPauses.seasonId, seasonPauses.date],
    set: {
      seasonId: sql`excluded.season_id`,
      date: sql`excluded.date`,
      reason: sql`excluded.reason`,
      createdAt: sql`now()`,
    },
  });
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
