import { seasonRecordHolders } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

type DbClient = (typeof import("@/lib/drizzle"))["db"];

interface AddRecordHolderProps {
  db: Transaction | DbClient;
  recordId: string;
  playerId: string;
}

export async function addRecordHolder({
  db,
  recordId,
  playerId,
}: AddRecordHolderProps): Promise<void> {
  const insert = db.insert(seasonRecordHolders).values({
    seasonRecordId: recordId,
    playerId,
  });

  await insert.onConflictDoNothing({
    target: [seasonRecordHolders.seasonRecordId, seasonRecordHolders.playerId],
  });
}

interface AddManyRecordHoldersProps {
  db: Transaction | DbClient;
  recordId: string;
  playerIds: string[];
}

export async function addManyRecordHolders({
  db,
  recordId,
  playerIds,
}: AddManyRecordHoldersProps): Promise<void> {
  if (playerIds.length === 0) return;

  const insert = db.insert(seasonRecordHolders).values(
    playerIds.map((playerId) => ({
      seasonRecordId: recordId,
      playerId,
    }))
  );

  await insert.onConflictDoNothing({
    target: [seasonRecordHolders.seasonRecordId, seasonRecordHolders.playerId],
  });
}
