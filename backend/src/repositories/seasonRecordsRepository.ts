import { eq, and } from "drizzle-orm";
import {
  seasonRecordHolders,
  seasonRecords,
  type SeasonRecord,
  type SeasonRecordType,
} from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

type DbClient = (typeof import("@/lib/drizzle"))["db"];

export type SeasonRecordRow = Pick<SeasonRecord, "id" | "recordValue">;

interface GetSeasonRecordProps {
  db: Transaction | DbClient;
  seasonId: string;
  type: SeasonRecordType;
}

export async function getSeasonRecord({
  db,
  seasonId,
  type,
}: GetSeasonRecordProps): Promise<SeasonRecordRow | null> {
  const rows = await db
    .select({
      id: seasonRecords.id,
      recordValue: seasonRecords.recordValue,
    })
    .from(seasonRecords)
    .where(and(eq(seasonRecords.seasonId, seasonId), eq(seasonRecords.type, type)))
    .limit(1);

  return rows[0] ?? null;
}

interface CreateSeasonRecordProps {
  db: Transaction | DbClient;
  seasonId: string;
  type: SeasonRecordType;
  recordValue: number;
}

export async function createSeasonRecord({
  db,
  seasonId,
  type,
  recordValue,
}: CreateSeasonRecordProps): Promise<SeasonRecordRow> {
  const rows = await db
    .insert(seasonRecords)
    .values({
      seasonId,
      type,
      recordValue,
    })
    .returning({
      id: seasonRecords.id,
      recordValue: seasonRecords.recordValue,
    });

  return rows[0];
}

interface UpdateSeasonRecordValueProps {
  db: Transaction | DbClient;
  recordId: string;
  newValue: number;
}

export async function updateSeasonRecordValue({
  db,
  recordId,
  newValue,
}: UpdateSeasonRecordValueProps): Promise<void> {
  await db
    .update(seasonRecords)
    .set({ recordValue: newValue })
    .where(eq(seasonRecords.id, recordId));
}

interface ClearSeasonRecordHoldersProps {
  db: Transaction | DbClient;
  recordId: string;
}

export async function clearSeasonRecordHolders({
  db,
  recordId,
}: ClearSeasonRecordHoldersProps): Promise<void> {
  await db.delete(seasonRecordHolders).where(eq(seasonRecordHolders.seasonRecordId, recordId));
}
