import { db } from "@/lib/drizzle";
import { redisClient } from "@/lib/redis";
import { incrementPlayerCoins } from "@/repositories/playerRepository";
import { upsertPlayerItemQuantityIncrease } from "@/repositories/playerItemsRepository";
import { getStoreItemByTypeAndDurationSeconds } from "@/repositories/storeItemsRepository";
import { buildRoundLeaderboardKey } from "@/redis/keys/leaderboard";
import { createAndDeliverNotification } from "@/services/notification";

type RoundLeaderboardReward = {
  vipDurationSeconds: number;
  coinReward: number;
};

type RoundLeaderboardWinner = {
  playerId: string;
  placement: number;
  goals: number;
};

const ROUND_LEADERBOARD_REWARDS: Record<number, RoundLeaderboardReward> = {
  1: {
    vipDurationSeconds: 24 * 60 * 60,
    coinReward: 2500,
  },
  2: {
    vipDurationSeconds: 12 * 60 * 60,
    coinReward: 1700,
  },
  3: {
    vipDurationSeconds: 8 * 60 * 60,
    coinReward: 1200,
  },
  4: {
    vipDurationSeconds: 4 * 60 * 60,
    coinReward: 1000,
  },
  5: {
    vipDurationSeconds: 4 * 60 * 60,
    coinReward: 800,
  },
  6: {
    vipDurationSeconds: 4 * 60 * 60,
    coinReward: 600,
  },
  7: {
    vipDurationSeconds: 4 * 60 * 60,
    coinReward: 500,
  },
  8: {
    vipDurationSeconds: 4 * 60 * 60,
    coinReward: 400,
  },
  9: {
    vipDurationSeconds: 4 * 60 * 60,
    coinReward: 300,
  },
  10: {
    vipDurationSeconds: 4 * 60 * 60,
    coinReward: 200,
  },
};

const ROUND_LEADERBOARD_REWARD_REASON = "round_leaderboard_reward";
const MAX_REWARDED_ROUND_PLACEMENT = 10;

function buildLeaderboardEntriesFromZset(
  rawEntries: string[]
): Array<{ playerId: string; goals: number }> {
  const leaderboardEntries: Array<{ playerId: string; goals: number }> = [];

  for (let index = 0; index < rawEntries.length; index += 2) {
    const playerId = rawEntries[index];
    const scoreValue = rawEntries[index + 1];

    if (!playerId || scoreValue === null) {
      continue;
    }

    const goals = Number(scoreValue);

    if (!Number.isFinite(goals)) {
      continue;
    }

    leaderboardEntries.push({
      playerId,
      goals,
    });
  }

  return leaderboardEntries;
}

function resolveRoundLeaderboardWinners(
  leaderboardEntries: Array<{ playerId: string; goals: number }>
): RoundLeaderboardWinner[] {
  const winners: RoundLeaderboardWinner[] = [];
  let currentPlacement: number | null = null;
  let previousGoals: number | null = null;

  for (let index = 0; index < leaderboardEntries.length; index += 1) {
    const leaderboardEntry = leaderboardEntries[index];

    if (previousGoals === null || leaderboardEntry.goals !== previousGoals) {
      const nextPlacement = index + 1;

      if (nextPlacement > MAX_REWARDED_ROUND_PLACEMENT) {
        break;
      }

      currentPlacement = nextPlacement;
      previousGoals = leaderboardEntry.goals;
    }

    if (currentPlacement === null || currentPlacement > MAX_REWARDED_ROUND_PLACEMENT) {
      break;
    }

    winners.push({
      playerId: leaderboardEntry.playerId,
      placement: currentPlacement,
      goals: leaderboardEntry.goals,
    });
  }

  return winners;
}

export interface ProcessRoundLeaderboardRewardsResult {
  roundId: string;
  rewardedPlayersCount: number;
}

export async function processRoundLeaderboardRewards(
  roundId: string
): Promise<ProcessRoundLeaderboardRewardsResult> {
  const leaderboardKey = buildRoundLeaderboardKey(roundId);
  const rawEntries = await redisClient.zrevrange(leaderboardKey, 0, -1, "WITHSCORES");
  const leaderboardEntries = buildLeaderboardEntriesFromZset(rawEntries);
  const winners = resolveRoundLeaderboardWinners(leaderboardEntries);

  if (winners.length === 0) {
    return {
      roundId,
      rewardedPlayersCount: 0,
    };
  }

  const rewardedPlayers = await db.transaction(async (transaction) => {
    const rewardVipItemByPlacement = new Map<number, string>();

    for (const [placementKey, reward] of Object.entries(ROUND_LEADERBOARD_REWARDS)) {
      const placement = Number(placementKey);
      const vipItem = await getStoreItemByTypeAndDurationSeconds({
        db: transaction,
        itemType: "vip",
        durationSeconds: reward.vipDurationSeconds,
      });

      if (!vipItem) {
        throw new Error(`VIP reward item not found for round placement ${placement}.`);
      }

      rewardVipItemByPlacement.set(placement, vipItem.id);
    }

    for (const winner of winners) {
      const reward = ROUND_LEADERBOARD_REWARDS[winner.placement];
      const vipItemId = rewardVipItemByPlacement.get(winner.placement);

      if (!reward || !vipItemId) {
        throw new Error(`Round reward configuration not found for placement ${winner.placement}.`);
      }

      const updatedPlayerCoins = await incrementPlayerCoins({
        db: transaction,
        playerId: winner.playerId,
        amount: reward.coinReward,
      });

      if (!updatedPlayerCoins) {
        throw new Error("Unable to grant round leaderboard coin reward.");
      }

      await upsertPlayerItemQuantityIncrease({
        db: transaction,
        playerId: winner.playerId,
        itemId: vipItemId,
        quantityToIncrease: 1,
      });
    }

    return winners.map((winner) => {
      const reward = ROUND_LEADERBOARD_REWARDS[winner.placement];
      const vipItemId = rewardVipItemByPlacement.get(winner.placement)!;

      return {
        ...winner,
        vipItemId,
        vipDurationSeconds: reward.vipDurationSeconds,
        coinReward: reward.coinReward,
      };
    });
  });

  await Promise.all(
    rewardedPlayers.flatMap((rewardedPlayer) => [
      createAndDeliverNotification({
        playerId: rewardedPlayer.playerId,
        type: "vip_received",
        payload: {
          itemId: rewardedPlayer.vipItemId,
          quantity: 1,
          reason: ROUND_LEADERBOARD_REWARD_REASON,
          roundId,
          placement: rewardedPlayer.placement,
          goals: rewardedPlayer.goals,
        },
      }),
      createAndDeliverNotification({
        playerId: rewardedPlayer.playerId,
        type: "system",
        payload: {
          message: "Round leaderboard reward received.",
          reason: ROUND_LEADERBOARD_REWARD_REASON,
          roundId,
          placement: rewardedPlayer.placement,
          goals: rewardedPlayer.goals,
          coinReward: rewardedPlayer.coinReward,
          vipDurationSeconds: rewardedPlayer.vipDurationSeconds,
        },
      }),
    ])
  );

  console.log(
    `[leaderboard_reward] processed roundId=${roundId} rewardedPlayersCount=${rewardedPlayers.length}`
  );

  return {
    roundId,
    rewardedPlayersCount: rewardedPlayers.length,
  };
}
