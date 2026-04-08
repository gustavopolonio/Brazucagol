import { db } from "@/lib/drizzle";
import { redisClient } from "@/lib/redis";
import { incrementPlayerCoins } from "@/repositories/playerRepository";
import { upsertPlayerItemQuantityIncrease } from "@/repositories/playerItemsRepository";
import { getStoreItemByTypeAndDurationSeconds } from "@/repositories/storeItemsRepository";
import { buildSeasonLeaderboardKey } from "@/redis/keys/leaderboard";
import { createAndDeliverNotification } from "@/services/notification";

type SeasonLeaderboardReward = {
  vipDurationSeconds: number;
  vipQuantity: number;
  coinReward: number;
};

type SeasonLeaderboardWinner = {
  playerId: string;
  placement: number;
  goals: number;
};

const SEASON_LEADERBOARD_REWARDS: Record<number, SeasonLeaderboardReward> = {
  1: {
    vipDurationSeconds: 24 * 60 * 60,
    vipQuantity: 3,
    coinReward: 40000,
  },
  2: {
    vipDurationSeconds: 24 * 60 * 60,
    vipQuantity: 2,
    coinReward: 30000,
  },
  3: {
    vipDurationSeconds: 24 * 60 * 60,
    vipQuantity: 1,
    coinReward: 22000,
  },
  4: {
    vipDurationSeconds: 12 * 60 * 60,
    vipQuantity: 1,
    coinReward: 16000,
  },
  5: {
    vipDurationSeconds: 12 * 60 * 60,
    vipQuantity: 1,
    coinReward: 13000,
  },
  6: {
    vipDurationSeconds: 12 * 60 * 60,
    vipQuantity: 1,
    coinReward: 10000,
  },
  7: {
    vipDurationSeconds: 12 * 60 * 60,
    vipQuantity: 1,
    coinReward: 8000,
  },
  8: {
    vipDurationSeconds: 12 * 60 * 60,
    vipQuantity: 1,
    coinReward: 6500,
  },
  9: {
    vipDurationSeconds: 12 * 60 * 60,
    vipQuantity: 1,
    coinReward: 5500,
  },
  10: {
    vipDurationSeconds: 12 * 60 * 60,
    vipQuantity: 1,
    coinReward: 4500,
  },
};

const SEASON_LEADERBOARD_REWARD_REASON = "season_leaderboard_reward";
const MAX_REWARDED_SEASON_PLACEMENT = 10;

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

function resolveSeasonLeaderboardWinners(
  leaderboardEntries: Array<{ playerId: string; goals: number }>
): SeasonLeaderboardWinner[] {
  const winners: SeasonLeaderboardWinner[] = [];
  let currentPlacement: number | null = null;
  let previousGoals: number | null = null;

  for (let index = 0; index < leaderboardEntries.length; index += 1) {
    const leaderboardEntry = leaderboardEntries[index];

    if (previousGoals === null || leaderboardEntry.goals !== previousGoals) {
      const nextPlacement = index + 1;

      if (nextPlacement > MAX_REWARDED_SEASON_PLACEMENT) {
        break;
      }

      currentPlacement = nextPlacement;
      previousGoals = leaderboardEntry.goals;
    }

    if (currentPlacement === null || currentPlacement > MAX_REWARDED_SEASON_PLACEMENT) {
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

export interface ProcessSeasonLeaderboardRewardsResult {
  seasonId: string;
  rewardedPlayersCount: number;
}

export async function processSeasonLeaderboardRewards(
  seasonId: string
): Promise<ProcessSeasonLeaderboardRewardsResult> {
  const leaderboardKey = buildSeasonLeaderboardKey(seasonId);
  const rawEntries = await redisClient.zrevrange(leaderboardKey, 0, -1, "WITHSCORES");
  const leaderboardEntries = buildLeaderboardEntriesFromZset(rawEntries);
  const winners = resolveSeasonLeaderboardWinners(leaderboardEntries);

  if (winners.length === 0) {
    return {
      seasonId,
      rewardedPlayersCount: 0,
    };
  }

  const rewardedPlayers = await db.transaction(async (transaction) => {
    const rewardVipItemByPlacement = new Map<number, string>();

    for (const [placementKey, reward] of Object.entries(SEASON_LEADERBOARD_REWARDS)) {
      const placement = Number(placementKey);
      const vipItem = await getStoreItemByTypeAndDurationSeconds({
        db: transaction,
        itemType: "vip",
        durationSeconds: reward.vipDurationSeconds,
      });

      if (!vipItem) {
        throw new Error(`VIP reward item not found for season placement ${placement}.`);
      }

      rewardVipItemByPlacement.set(placement, vipItem.id);
    }

    for (const winner of winners) {
      const reward = SEASON_LEADERBOARD_REWARDS[winner.placement];
      const vipItemId = rewardVipItemByPlacement.get(winner.placement);

      if (!reward || !vipItemId) {
        throw new Error(`Season reward configuration not found for placement ${winner.placement}.`);
      }

      const updatedPlayerCoins = await incrementPlayerCoins({
        db: transaction,
        playerId: winner.playerId,
        amount: reward.coinReward,
      });

      if (!updatedPlayerCoins) {
        throw new Error("Unable to grant season leaderboard coin reward.");
      }

      await upsertPlayerItemQuantityIncrease({
        db: transaction,
        playerId: winner.playerId,
        itemId: vipItemId,
        quantityToIncrease: reward.vipQuantity,
      });
    }

    return winners.map((winner) => {
      const reward = SEASON_LEADERBOARD_REWARDS[winner.placement];
      const vipItemId = rewardVipItemByPlacement.get(winner.placement)!;

      return {
        ...winner,
        vipItemId,
        vipDurationSeconds: reward.vipDurationSeconds,
        vipQuantity: reward.vipQuantity,
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
          quantity: rewardedPlayer.vipQuantity,
          reason: SEASON_LEADERBOARD_REWARD_REASON,
          seasonId,
          placement: rewardedPlayer.placement,
          goals: rewardedPlayer.goals,
        },
      }),
      createAndDeliverNotification({
        playerId: rewardedPlayer.playerId,
        type: "system",
        payload: {
          message: "Season leaderboard reward received.",
          reason: SEASON_LEADERBOARD_REWARD_REASON,
          seasonId,
          placement: rewardedPlayer.placement,
          goals: rewardedPlayer.goals,
          coinReward: rewardedPlayer.coinReward,
          vipDurationSeconds: rewardedPlayer.vipDurationSeconds,
          vipQuantity: rewardedPlayer.vipQuantity,
        },
      }),
    ])
  );

  console.log(
    `[leaderboard_reward] processed seasonId=${seasonId} rewardedPlayersCount=${rewardedPlayers.length}`
  );

  return {
    seasonId,
    rewardedPlayersCount: rewardedPlayers.length,
  };
}
