import { db } from "@/lib/drizzle";
import { env } from "@/env";
import { releaseCooldownIfTokenMatches, tryAcquireCooldown } from "@/services/cooldown";
import { clearGameplayPresence, isPlayerOffline } from "@/services/gameplayPresenceStore";
import { resolveCooldownTtlInSeconds } from "@/utils/gameplay";
import { getPlayerClubMembership } from "@/repositories/clubMembersRepository";
import { getLevelForTotalGoals } from "@/repositories/levelsRepository";
import { getMatchByIdForUpdate, incrementMatchGoals } from "@/repositories/matchRepository";
import { getPlayerById, updatePlayerLevel } from "@/repositories/playerRepository";
import {
  AttemptColumnName,
  GoalColumnName,
  createPlayerRoundStats,
  getPlayerRoundStatsForUpdate,
  incrementPlayerRoundStatsColumns,
} from "@/repositories/playerRoundStatsRepository";
import { getPlayerTotalStats } from "@/repositories/playerTotalStatsRepository";
import { GoalActionType } from "@/types/goal.types";
import { resolveScoringSide } from "@/services/scoringSide";

type GoalAttemptResolved = {
  matchId: string;
  playerId: string;
  actionType: GoalActionType;
  homeGoals: number;
  awayGoals: number;
  playerLevel: number;
  effectiveTotalGoals: number;
};

export type GoalActionResult =
  | ({
      status: "scored";
    } & GoalAttemptResolved)
  | ({
      status: "missed";
    } & GoalAttemptResolved)
  | {
      status: "cooldown";
      ttlRemainingSeconds: number;
    }
  | {
      status: "cooldown_unavailable";
    }
  | {
      status: "match_not_in_progress";
    };

interface AttemptGoalActionProps {
  playerId: string;
  matchId: string;
  actionType: GoalActionType;
}

// TODO: don't know if this file is the best place for this function
function getPlayerRoundStatsColumns(actionType: GoalActionType): {
  goalColumnName: GoalColumnName;
  attemptColumnName: AttemptColumnName;
} {
  if (actionType === "auto") {
    return { goalColumnName: "autoGoal", attemptColumnName: "autoGoalAttempts" };
  }
  if (actionType === "penalty") {
    return { goalColumnName: "penaltyGoal", attemptColumnName: "penaltyAttempts" };
  }
  if (actionType === "free_kick") {
    return { goalColumnName: "freeKickGoal", attemptColumnName: "freeKickAttempts" };
  }
  if (actionType === "trail") {
    return { goalColumnName: "trailGoal", attemptColumnName: "trailAttempts" };
  }

  throw new Error(`Unsupported action type: ${actionType}`);
}

const GOAL_PROBABILITY_BY_ACTION: Record<GoalActionType, number> = {
  auto: env.GOAL_PROBABILITY_AUTO,
  penalty: env.GOAL_PROBABILITY_PENALTY,
  free_kick: env.GOAL_PROBABILITY_FREE_KICK,
  trail: env.GOAL_PROBABILITY_TRAIL,
};

function rollGoalScoringChance(actionType: GoalActionType) {
  return Math.random() < GOAL_PROBABILITY_BY_ACTION[actionType];
}

export async function attemptGoalAction({
  playerId,
  matchId,
  actionType,
}: AttemptGoalActionProps): Promise<GoalActionResult> {
  let cooldownToken: string | null = null;

  try {
    if (actionType === "auto") {
      throw new Error("Auto goals are handled by the auto-goal worker.");
    }

    const isOffline = await isPlayerOffline(playerId);

    if (isOffline) {
      await clearGameplayPresence(playerId);
      return;
    }

    return await db.transaction(async (transaction) => {
      const match = await getMatchByIdForUpdate({ db: transaction, matchId });

      if (!match) {
        throw new Error("Match not found.");
      }

      if (match.status !== "in_progress") {
        return { status: "match_not_in_progress" };
      }

      if (!match.clubHomeId || !match.clubAwayId) {
        throw new Error("Match is missing club assignments.");
      }

      const player = await getPlayerById({ db: transaction, playerId });

      if (!player) {
        throw new Error("Player not found.");
      }

      const playerClubMembership = await getPlayerClubMembership({
        db: transaction,
        playerId,
      });

      if (!playerClubMembership) {
        throw new Error("Player does not belong to a club.");
      }

      const scoringSide = resolveScoringSide({
        playerClubId: playerClubMembership.clubId,
        matchClubHomeId: match.clubHomeId,
        matchClubAwayId: match.clubAwayId,
      });

      if (!scoringSide) {
        throw new Error("Player does not belong to a match club.");
      }

      const currentTime = new Date();
      const cooldownTtlInSeconds = resolveCooldownTtlInSeconds(player.vipExpiresAt, currentTime);

      const cooldownResult = await tryAcquireCooldown({
        playerId,
        actionType,
        ttlInSeconds: cooldownTtlInSeconds,
      });

      if (!cooldownResult.acquired) {
        if ("ttlRemainingSeconds" in cooldownResult) {
          return {
            status: "cooldown",
            ttlRemainingSeconds: cooldownResult.ttlRemainingSeconds,
          };
        }

        return { status: "cooldown_unavailable" };
      }

      cooldownToken = cooldownResult.token;

      const existingPlayerRoundStats = await getPlayerRoundStatsForUpdate({
        db: transaction,
        playerId,
        matchId,
      });

      if (!existingPlayerRoundStats) {
        await createPlayerRoundStats({ db: transaction, playerId, matchId });
      }

      const { goalColumnName, attemptColumnName } = getPlayerRoundStatsColumns(actionType);

      const updatedPlayerRoundStatsAfterAttempt = await incrementPlayerRoundStatsColumns({
        db: transaction,
        playerId,
        matchId,
        columnNames: [attemptColumnName],
      });

      const didScore = rollGoalScoringChance(actionType);
      let updatedPlayerRoundStats = updatedPlayerRoundStatsAfterAttempt;
      let updatedMatch = match;

      if (didScore) {
        updatedPlayerRoundStats = await incrementPlayerRoundStatsColumns({
          db: transaction,
          playerId,
          matchId,
          columnNames: [goalColumnName],
        });

        updatedMatch = await incrementMatchGoals({
          db: transaction,
          matchId,
          scoringSide,
        });
      }

      const playerTotalStats = await getPlayerTotalStats({ db: transaction, playerId });

      if (!playerTotalStats) {
        throw new Error("Player total stats not found.");
      }

      const effectiveTotalGoals =
        playerTotalStats.autoGoal +
        playerTotalStats.penaltyGoal +
        playerTotalStats.freeKickGoal +
        playerTotalStats.trailGoal +
        updatedPlayerRoundStats.autoGoal +
        updatedPlayerRoundStats.penaltyGoal +
        updatedPlayerRoundStats.freeKickGoal +
        updatedPlayerRoundStats.trailGoal;

      const nextLevel = await getLevelForTotalGoals({
        db: transaction,
        totalGoals: effectiveTotalGoals,
      });

      let playerLevel = player.level;

      if (nextLevel && nextLevel.id > player.level) {
        await updatePlayerLevel({
          db: transaction,
          playerId,
          level: nextLevel.id,
        });
        playerLevel = nextLevel.id;
      }

      return {
        status: didScore ? "scored" : "missed",
        matchId,
        playerId,
        actionType,
        homeGoals: updatedMatch.homeGoals,
        awayGoals: updatedMatch.awayGoals,
        playerLevel,
        effectiveTotalGoals,
      };
    });
  } catch (error) {
    if (cooldownToken) {
      // Roll back the cooldown if the transaction fails after acquisition -> player has the right to kick again, instantly
      await releaseCooldownIfTokenMatches({ playerId, actionType, token: cooldownToken });
    }
    throw error;
  }
}
