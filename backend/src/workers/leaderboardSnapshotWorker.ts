import { env } from "@/env";
import { db } from "@/lib/drizzle";
import {
  getInProgressCupRoundId,
  getInProgressLeagueRound,
  getInProgressMatchIds,
  getInProgressSeasonId,
} from "@/repositories/matchRepository";
import {
  buildLeagueRoundId,
  refreshCurrentHourLeaderboardSnapshot,
  refreshMatchLeaderboardSnapshot,
  refreshRoundLeaderboardSnapshot,
  refreshSeasonLeaderboardSnapshot,
} from "@/services/leaderboardService";

async function refreshActiveMatchSnapshots(): Promise<void> {
  const matchIds = await getInProgressMatchIds({ db });

  for (const matchId of matchIds) {
    await refreshMatchLeaderboardSnapshot({ matchId });
  }
}

async function refreshActiveRoundSnapshots(): Promise<void> {
  const leagueRound = await getInProgressLeagueRound({ db });

  if (leagueRound) {
    // League round
    const roundId = buildLeagueRoundId({
      competitionId: leagueRound.competitionId,
      leagueRound: leagueRound.leagueRound,
    });

    await refreshRoundLeaderboardSnapshot({ roundId });

    return;
  }

  const cupRoundId = await getInProgressCupRoundId({ db });

  if (!cupRoundId) {
    return;
  }

  // Cup round
  await refreshRoundLeaderboardSnapshot({ roundId: cupRoundId });
}

export async function runLeaderboardSnapshotWorkerOnce() {
  await refreshCurrentHourLeaderboardSnapshot();
  await refreshActiveRoundSnapshots();

  const seasonId = await getInProgressSeasonId({ db });

  if (seasonId) {
    await refreshSeasonLeaderboardSnapshot({ seasonId });
  }

  await refreshActiveMatchSnapshots();
}

interface StartLeaderboardSnapshotWorkerProps {
  intervalMilliseconds?: number;
}

export function startLeaderboardSnapshotWorker({
  intervalMilliseconds = env.LEADERBOARD_SNAPSHOT_INTERVAL_MS,
}: StartLeaderboardSnapshotWorkerProps = {}) {
  const runTick = async () => {
    try {
      await runLeaderboardSnapshotWorkerOnce();
    } catch (error) {
      console.error("Leaderboard snapshot worker tick failed", error);
    }
  };

  void runTick();

  return setInterval(() => {
    void runTick();
  }, intervalMilliseconds);
}

startLeaderboardSnapshotWorker();
