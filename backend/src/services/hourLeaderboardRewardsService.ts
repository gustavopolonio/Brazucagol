import { db } from "@/lib/drizzle";
import { redisClient } from "@/lib/redis";
import { createAndDeliverNotification } from "@/services/notification";
import { buildHourlyLeaderboardKey } from "@/redis/keys/leaderboard";
import { incrementPlayerCoins } from "@/repositories/playerRepository";
import { upsertPlayerItemQuantityIncrease } from "@/repositories/playerItemsRepository";
import { getStoreItemByTypeAndDurationSeconds } from "@/repositories/storeItemsRepository";

type HourLeaderboardReward = {
  placement: 1 | 2 | 3;
  vipDurationSeconds: number;
  coinReward: number;
};

type HourLeaderboardWinner = {
  playerId: string;
  placement: 1 | 2 | 3;
  goals: number;
};

const HOUR_LEADERBOARD_REWARDS: Record<1 | 2 | 3, HourLeaderboardReward> = {
  1: {
    placement: 1,
    vipDurationSeconds: 60 * 60,
    coinReward: 150,
  },
  2: {
    placement: 2,
    vipDurationSeconds: 30 * 60,
    coinReward: 90,
  },
  3: {
    placement: 3,
    vipDurationSeconds: 15 * 60,
    coinReward: 60,
  },
};

const HOUR_LEADERBOARD_REWARD_REASON = "hour_leaderboard_reward";

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

function resolveHourLeaderboardWinners(
  leaderboardEntries: Array<{ playerId: string; goals: number }>
): HourLeaderboardWinner[] {
  const winners: HourLeaderboardWinner[] = [];
  let currentPlacement: 1 | 2 | 3 | null = null;
  let previousGoals: number | null = null;

  for (let index = 0; index < leaderboardEntries.length; index += 1) {
    const leaderboardEntry = leaderboardEntries[index];

    if (previousGoals === null || leaderboardEntry.goals !== previousGoals) {
      const nextPlacement = index + 1;

      if (nextPlacement > 3) {
        break;
      }

      currentPlacement = nextPlacement as 1 | 2 | 3;
      previousGoals = leaderboardEntry.goals;
    }

    if (currentPlacement === null) {
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

export interface ProcessHourLeaderboardRewardsResult {
  hourKey: string;
  rewardedPlayersCount: number;
}

export async function processHourLeaderboardRewards(
  hourKey: string
): Promise<ProcessHourLeaderboardRewardsResult> {
  const leaderboardKey = buildHourlyLeaderboardKey(hourKey);
  const rawEntries = await redisClient.zrevrange(leaderboardKey, 0, -1, "WITHSCORES");
  const leaderboardEntries = buildLeaderboardEntriesFromZset(rawEntries);
  const winners = resolveHourLeaderboardWinners(leaderboardEntries);

  if (winners.length === 0) {
    return {
      hourKey,
      rewardedPlayersCount: 0,
    };
  }

  const rewardedPlayers = await db.transaction(async (transaction) => {
    const rewardVipItemByPlacement = new Map<1 | 2 | 3, string>();

    for (const placement of [1, 2, 3] as const) {
      const reward = HOUR_LEADERBOARD_REWARDS[placement];
      const vipItem = await getStoreItemByTypeAndDurationSeconds({
        db: transaction,
        itemType: "vip",
        durationSeconds: reward.vipDurationSeconds,
      });

      if (!vipItem) {
        throw new Error(`VIP reward item not found for placement ${placement}.`);
      }

      rewardVipItemByPlacement.set(placement, vipItem.id);
    }

    for (const winner of winners) {
      const reward = HOUR_LEADERBOARD_REWARDS[winner.placement];
      const vipItemId = rewardVipItemByPlacement.get(winner.placement);

      if (!vipItemId) {
        throw new Error(`VIP reward item not found for placement ${winner.placement}.`);
      }

      const updatedPlayerCoins = await incrementPlayerCoins({
        db: transaction,
        playerId: winner.playerId,
        amount: reward.coinReward,
      });

      if (!updatedPlayerCoins) {
        throw new Error("Unable to grant hourly leaderboard coin reward.");
      }

      await upsertPlayerItemQuantityIncrease({
        db: transaction,
        playerId: winner.playerId,
        itemId: vipItemId,
        quantityToIncrease: 1,
      });
    }

    return winners.map((winner) => {
      const reward = HOUR_LEADERBOARD_REWARDS[winner.placement];
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
          reason: HOUR_LEADERBOARD_REWARD_REASON,
          hourKey,
          placement: rewardedPlayer.placement,
          goals: rewardedPlayer.goals,
        },
      }),
      createAndDeliverNotification({
        playerId: rewardedPlayer.playerId,
        type: "system",
        payload: {
          message: "Hourly leaderboard reward received.",
          reason: HOUR_LEADERBOARD_REWARD_REASON,
          hourKey,
          placement: rewardedPlayer.placement,
          goals: rewardedPlayer.goals,
          coinReward: rewardedPlayer.coinReward,
          vipDurationSeconds: rewardedPlayer.vipDurationSeconds,
        },
      }),
    ])
  );

  console.log(
    `[leaderboard_reward] processed hourKey=${hourKey} rewardedPlayersCount=${rewardedPlayers.length}`
  );

  return {
    hourKey,
    rewardedPlayersCount: rewardedPlayers.length,
  };
}
