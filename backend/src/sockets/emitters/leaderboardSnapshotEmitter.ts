import { env } from "@/env";
import { db } from "@/lib/drizzle";
import {
  getInProgressCupRoundId,
  getInProgressLeagueRound,
  getInProgressSeasonId,
} from "@/repositories/matchRepository";
import {
  buildLeagueRoundId,
  getCurrentHourLeaderboardSnapshot,
  getCurrentSeasonLeaderboardSnapshot,
  getRoundLeaderboardSnapshot,
} from "@/services/leaderboardService";
import { getSocketServer } from "@/sockets/socketServer";

async function emitRoundSnapshot(io: ReturnType<typeof getSocketServer>) {
  const leagueRound = await getInProgressLeagueRound({ db });

  if (leagueRound) {
    const roundId = buildLeagueRoundId({
      competitionId: leagueRound.competitionId,
      leagueRound: leagueRound.leagueRound,
    });
    const roundSnapshot = await getRoundLeaderboardSnapshot(roundId);

    if (roundSnapshot) {
      io.emit("leaderboard:round_snapshot", roundSnapshot);
    }

    return;
  }

  const cupRoundId = await getInProgressCupRoundId({ db });

  if (!cupRoundId) {
    return;
  }

  const roundSnapshot = await getRoundLeaderboardSnapshot(cupRoundId);

  if (roundSnapshot) {
    io.emit("leaderboard:round_snapshot", roundSnapshot);
  }
}

export function startLeaderboardSnapshotEmitter(
  intervalMilliseconds: number = env.LEADERBOARD_SNAPSHOT_INTERVAL_MS
) {
  // Workers only write Redis snapshots; the API process emits sockets.
  const runTick = async () => {
    try {
      const io = getSocketServer();
      const hourSnapshot = await getCurrentHourLeaderboardSnapshot();

      if (hourSnapshot) {
        io.emit("leaderboard:hour_snapshot", hourSnapshot);
      }

      const seasonId = await getInProgressSeasonId({ db });

      if (seasonId) {
        const seasonSnapshot = await getCurrentSeasonLeaderboardSnapshot();

        if (seasonSnapshot) {
          io.emit("leaderboard:season_snapshot", seasonSnapshot);
        }
      }

      await emitRoundSnapshot(io);
    } catch (error) {
      console.warn("Leaderboard snapshot emitter skipped", error);
    }
  };

  void runTick();

  return setInterval(() => {
    void runTick();
  }, intervalMilliseconds);
}
