import { env } from "@/env";
import { db } from "@/lib/drizzle";
import { listActivePresidents } from "@/repositories/clubMembersRepository";
import { hasPenaltyAttemptSince } from "@/repositories/playerRoundStatsRepository";
import { removeInactivePresident } from "@/services/clubPresidency";

const PRESIDENT_ACTIVITY_WINDOW_DAYS = 5 * 24 * 60 * 60 * 1000; // 5 days
const INACTIVE_PRESIDENT_REASON = "inactive_president_no_penalty_attempt";

function resolveActivityStartDate(currentDate: Date): Date {
  const activityWindowMilliseconds = PRESIDENT_ACTIVITY_WINDOW_DAYS;
  return new Date(currentDate.getTime() - activityWindowMilliseconds);
}

async function processPresidentActivity({
  playerId,
  clubId,
  activityStartDate,
}: {
  playerId: string;
  clubId: string;
  activityStartDate: Date;
}): Promise<void> {
  const hasAttemptedPenaltyRecently = await hasPenaltyAttemptSince({
    db,
    playerId,
    sinceDate: activityStartDate,
  });

  if (hasAttemptedPenaltyRecently) {
    return;
  }

  await removeInactivePresident(playerId, clubId, INACTIVE_PRESIDENT_REASON);
}

export async function runPresidentActivityWorkerOnce(): Promise<void> {
  const currentDate = new Date();
  const activityStartDate = resolveActivityStartDate(currentDate);
  const activePresidents = await listActivePresidents({ db });

  for (const activePresident of activePresidents) {
    try {
      await processPresidentActivity({
        playerId: activePresident.playerId,
        clubId: activePresident.clubId,
        activityStartDate,
      });
    } catch (error) {
      console.error(
        `President activity check failed for club ${activePresident.clubId} and player ${activePresident.playerId}`,
        error
      );
    }
  }
}

interface StartPresidentActivityWorkerProps {
  intervalMilliseconds?: number;
}

export function startPresidentActivityWorker({
  intervalMilliseconds = env.PRESIDENT_ACTIVITY_WORKER_INTERVAL_MS,
}: StartPresidentActivityWorkerProps = {}) {
  const runTick = async () => {
    try {
      await runPresidentActivityWorkerOnce();
    } catch (error) {
      console.error("President activity worker tick failed", error);
    }
  };

  void runTick();

  return setInterval(() => {
    void runTick();
  }, intervalMilliseconds);
}

startPresidentActivityWorker();
