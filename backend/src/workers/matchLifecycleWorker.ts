import { env } from "@/env";
import { db } from "@/lib/drizzle";
import { redisClient } from "@/lib/redis";
import { finalizeRoundMatches } from "@/services/match/finalize";
import { buildRoundLeaderboardRewardProcessedKey } from "@/redis/keys/leaderboard";
import {
  getEarliestInProgressRoundDate,
  getEarliestPendingRoundDate,
  getRoundSeasonContextsByDate,
  lockMatchesByDate,
  markRoundFinished,
  markRoundInProgress,
} from "@/repositories/matchRepository";
import { lockRoundMatchesForFinalize } from "@/repositories/matchFinalizationRepository";
import {
  buildLeagueRoundId,
  checkRoundSeasonRecordForRoundId,
} from "@/services/leaderboardService";
import { processRoundLeaderboardRewards } from "@/services/roundLeaderboardRewardsService";

const ROUND_REWARD_PROCESSED_TTL_SECONDS = 7 * 24 * 60 * 60;

type RoundActionResult = {
  roundDate: Date | null;
  matchesCount: number;
};

interface StartDueRoundProps {
  currentTime?: Date;
}

export async function startDueRound({
  currentTime = new Date(),
}: StartDueRoundProps = {}): Promise<RoundActionResult> {
  return db.transaction(async (transaction) => {
    const roundDate = await getEarliestPendingRoundDate({ db: transaction, now: currentTime });

    if (!roundDate) {
      return { roundDate: null, matchesCount: 0 };
    }

    const lockedMatches = await lockMatchesByDate({ db: transaction, roundDate });

    if (lockedMatches.length === 0) {
      return { roundDate, matchesCount: 0 };
    }

    const statuses = new Set(lockedMatches.map((match) => match.status));

    if (statuses.size === 1 && statuses.has("pending")) {
      // Atomic round start: every match is pending, so move the whole round together.
      await markRoundInProgress({ db: transaction, roundDate });
      return { roundDate, matchesCount: lockedMatches.length };
    }

    if (statuses.size === 1 && statuses.has("in_progress")) {
      // Idempotency: another worker already started this round.
      return { roundDate, matchesCount: 0 };
    }

    throw new Error(
      `Refusing to start round ${roundDate.toISOString()} because match statuses are mixed.`
    );
  });
}

interface FinishDueRoundProps {
  currentTime?: Date;
}

export async function finishDueRound({
  currentTime = new Date(),
}: FinishDueRoundProps = {}): Promise<RoundActionResult> {
  return db.transaction(async (transaction) => {
    const roundDate = await getEarliestInProgressRoundDate({ db: transaction, now: currentTime });

    if (!roundDate) {
      return { roundDate: null, matchesCount: 0 };
    }

    const lockedMatches = await lockRoundMatchesForFinalize({ db: transaction, roundDate });

    if (lockedMatches.length === 0) {
      return { roundDate, matchesCount: 0 };
    }

    const statuses = new Set(lockedMatches.map((match) => match.status));

    if (statuses.size === 1 && statuses.has("in_progress")) {
      // Atomic round finish: finalize all matches in the round in the same transaction.
      await finalizeRoundMatches({
        db: transaction,
        roundDate,
        lockedMatches,
      });

      await markRoundFinished({ db: transaction, roundDate });

      return { roundDate, matchesCount: lockedMatches.length };
    }

    if (statuses.size === 1 && statuses.has("finished")) {
      // Idempotency: another worker already finished this round.
      return { roundDate, matchesCount: 0 };
    }

    throw new Error(
      `Refusing to finish round ${roundDate.toISOString()} because match statuses are mixed.`
    );
  });
}

async function checkRoundSeasonRecords(roundDate: Date): Promise<void> {
  const roundContexts = await getRoundSeasonContextsByDate({ db, roundDate });

  for (const roundContext of roundContexts) {
    if (roundContext.matchType === "league") {
      if (roundContext.leagueRound === null) {
        continue;
      }

      await checkRoundSeasonRecordForRoundId(
        roundContext.seasonId,
        buildLeagueRoundId({
          competitionId: roundContext.competitionId,
          leagueRound: roundContext.leagueRound,
        })
      );

      continue;
    }

    if (roundContext.cupRoundId) {
      await checkRoundSeasonRecordForRoundId(roundContext.seasonId, roundContext.cupRoundId);
    }
  }
}

async function processRoundLeaderboardRewardsForDate(roundDate: Date): Promise<void> {
  const roundContexts = await getRoundSeasonContextsByDate({ db, roundDate });

  for (const roundContext of roundContexts) {
    const roundId =
      roundContext.matchType === "league"
        ? roundContext.leagueRound === null
          ? null
          : buildLeagueRoundId({
              competitionId: roundContext.competitionId,
              leagueRound: roundContext.leagueRound,
            })
        : roundContext.cupRoundId;

    if (!roundId) {
      continue;
    }

    const rewardProcessedKey = buildRoundLeaderboardRewardProcessedKey(roundId);
    const rewardProcessed = await redisClient.set(
      rewardProcessedKey,
      "1",
      "EX",
      ROUND_REWARD_PROCESSED_TTL_SECONDS,
      "NX"
    );

    if (rewardProcessed !== "OK") {
      continue;
    }

    try {
      await processRoundLeaderboardRewards(roundId);
    } catch (error) {
      await redisClient.del(rewardProcessedKey);
      throw error;
    }
  }
}

export async function runMatchLifecycleWorkerOnce() {
  const finishedRound = await finishDueRound({ currentTime: new Date("2026-02-14T21:00:00Z") });

  if (finishedRound.roundDate && finishedRound.matchesCount > 0) {
    await checkRoundSeasonRecords(finishedRound.roundDate);
    await processRoundLeaderboardRewardsForDate(finishedRound.roundDate);
  }

  await startDueRound({ currentTime: new Date("2026-02-14T21:00:00Z") });
}

interface StartMatchLifecycleWorkerProps {
  intervalMilliseconds?: number;
}

export function startMatchLifecycleWorker({
  intervalMilliseconds = env.MATCH_LIFECYCLE_WORKER_INTERVAL_MS,
}: StartMatchLifecycleWorkerProps = {}) {
  const runTick = async () => {
    // console.log(`[match-worker] tick: ${new Date().toISOString()}`);

    try {
      await runMatchLifecycleWorkerOnce();
    } catch (error) {
      console.error("Match lifecycle worker tick failed", error);
    }
  };

  void runTick();

  return setInterval(() => {
    void runTick();
  }, intervalMilliseconds);
}

startMatchLifecycleWorker();
