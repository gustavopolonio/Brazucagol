import { db } from "@/lib/drizzle";
import {
  clearSeasonRecordHolders,
  createSeasonRecord,
  getSeasonRecord,
  updateSeasonRecordValue,
} from "@/repositories/seasonRecordsRepository";
import { addManyRecordHolders } from "@/repositories/seasonRecordHoldersRepository";
import { LeaderboardSnapshot } from "@/types/leaderboard.types";
import { type SeasonRecordType } from "@/db/schema";

type SnapshotLeaders = {
  recordValue: number;
  playerIds: string[];
};

function resolveSnapshotLeaders(
  leaderboardSnapshot: LeaderboardSnapshot | null
): SnapshotLeaders | null {
  if (!leaderboardSnapshot || leaderboardSnapshot.length === 0) {
    return null;
  }

  let topScore = Number.NEGATIVE_INFINITY;

  for (const entry of leaderboardSnapshot) {
    if (!Number.isFinite(entry.goals)) continue;
    if (entry.goals > topScore) {
      topScore = entry.goals;
    }
  }

  if (!Number.isFinite(topScore)) {
    return null;
  }

  const playerIds = Array.from(
    new Set(
      leaderboardSnapshot
        .filter((entry) => entry.goals === topScore)
        .map((entry) => entry.playerId)
        .filter((playerId) => playerId.length > 0)
    )
  );

  if (playerIds.length === 0) {
    return null;
  }

  return {
    recordValue: topScore,
    playerIds,
  };
}

async function checkAndUpdateSeasonRecord(
  seasonId: string,
  type: SeasonRecordType,
  leaderboardSnapshot: LeaderboardSnapshot | null
): Promise<void> {
  const snapshotLeaders = resolveSnapshotLeaders(leaderboardSnapshot);

  if (!snapshotLeaders) {
    return;
  }

  const existingRecord = await getSeasonRecord({ db, seasonId, type });

  if (!existingRecord) {
    const createdRecord = await createSeasonRecord({
      db,
      seasonId,
      type,
      recordValue: snapshotLeaders.recordValue,
    });

    await addManyRecordHolders({
      db,
      recordId: createdRecord.id,
      playerIds: snapshotLeaders.playerIds,
    });

    return;
  }

  if (snapshotLeaders.recordValue > existingRecord.recordValue) {
    await updateSeasonRecordValue({
      db,
      recordId: existingRecord.id,
      newValue: snapshotLeaders.recordValue,
    });

    await clearSeasonRecordHolders({
      db,
      recordId: existingRecord.id,
    });

    await addManyRecordHolders({
      db,
      recordId: existingRecord.id,
      playerIds: snapshotLeaders.playerIds,
    });

    return;
  }

  if (snapshotLeaders.recordValue === existingRecord.recordValue) {
    await addManyRecordHolders({
      db,
      recordId: existingRecord.id,
      playerIds: snapshotLeaders.playerIds,
    });
  }
}

export async function checkAndUpdateHourSeasonRecord(
  seasonId: string,
  leaderboardSnapshot: LeaderboardSnapshot | null
): Promise<void> {
  await checkAndUpdateSeasonRecord(seasonId, "hour_goals", leaderboardSnapshot);
}

export async function checkAndUpdateRoundSeasonRecord(
  seasonId: string,
  leaderboardSnapshot: LeaderboardSnapshot | null
): Promise<void> {
  await checkAndUpdateSeasonRecord(seasonId, "round_goals", leaderboardSnapshot);
}
