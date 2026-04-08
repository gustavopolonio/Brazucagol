import { type SeasonRecordType } from "@/db/schema";
import { db } from "@/lib/drizzle";
import { incrementPlayerCoins } from "@/repositories/playerRepository";
import { upsertPlayerItemQuantityIncrease } from "@/repositories/playerItemsRepository";
import { listSeasonRecordHoldersByRecordId } from "@/repositories/seasonRecordHoldersRepository";
import { getSeasonRecord } from "@/repositories/seasonRecordsRepository";
import { getStoreItemByTypeAndDurationSeconds } from "@/repositories/storeItemsRepository";
import { createAndDeliverNotification } from "@/services/notification";

type SeasonRecordReward = {
  vipDurationSeconds: number;
  vipQuantity: number;
  coinReward: number;
};

const SEASON_RECORD_REWARD_BY_TYPE: Record<SeasonRecordType, SeasonRecordReward> = {
  hour_goals: {
    vipDurationSeconds: 24 * 60 * 60,
    vipQuantity: 1,
    coinReward: 10000,
  },
  round_goals: {
    vipDurationSeconds: 24 * 60 * 60,
    vipQuantity: 2,
    coinReward: 20000,
  },
};

const SEASON_RECORD_REWARD_REASON: Record<SeasonRecordType, string> = {
  hour_goals: "season_hour_record_reward",
  round_goals: "season_round_record_reward",
};

export interface ProcessSeasonRecordRewardsParams {
  seasonId: string;
  type: SeasonRecordType;
}

export interface ProcessSeasonRecordRewardsResult {
  seasonId: string;
  type: SeasonRecordType;
  rewardedPlayersCount: number;
}

export async function processSeasonRecordRewards({
  seasonId,
  type,
}: ProcessSeasonRecordRewardsParams): Promise<ProcessSeasonRecordRewardsResult> {
  const seasonRecord = await getSeasonRecord({
    db,
    seasonId,
    type,
  });

  if (!seasonRecord) {
    return {
      seasonId,
      type,
      rewardedPlayersCount: 0,
    };
  }

  const recordHolders = await listSeasonRecordHoldersByRecordId({
    db,
    recordId: seasonRecord.id,
  });

  if (recordHolders.length === 0) {
    return {
      seasonId,
      type,
      rewardedPlayersCount: 0,
    };
  }

  const reward = SEASON_RECORD_REWARD_BY_TYPE[type];
  const rewardReason = SEASON_RECORD_REWARD_REASON[type];

  const rewardedPlayers = await db.transaction(async (transaction) => {
    const vipItem = await getStoreItemByTypeAndDurationSeconds({
      db: transaction,
      itemType: "vip",
      durationSeconds: reward.vipDurationSeconds,
    });

    if (!vipItem) {
      throw new Error(`VIP reward item not found for season record type ${type}.`);
    }

    for (const recordHolder of recordHolders) {
      const updatedPlayerCoins = await incrementPlayerCoins({
        db: transaction,
        playerId: recordHolder.playerId,
        amount: reward.coinReward,
      });

      if (!updatedPlayerCoins) {
        throw new Error("Unable to grant season record coin reward.");
      }

      await upsertPlayerItemQuantityIncrease({
        db: transaction,
        playerId: recordHolder.playerId,
        itemId: vipItem.id,
        quantityToIncrease: reward.vipQuantity,
      });
    }

    return recordHolders.map((recordHolder) => ({
      playerId: recordHolder.playerId,
      vipItemId: vipItem.id,
    }));
  });

  await Promise.all(
    rewardedPlayers.flatMap((rewardedPlayer) => [
      createAndDeliverNotification({
        playerId: rewardedPlayer.playerId,
        type: "vip_received",
        payload: {
          itemId: rewardedPlayer.vipItemId,
          quantity: reward.vipQuantity,
          reason: rewardReason,
          seasonId,
          recordType: type,
          recordValue: seasonRecord.recordValue,
        },
      }),
      createAndDeliverNotification({
        playerId: rewardedPlayer.playerId,
        type: "system",
        payload: {
          message: "Season record reward received.",
          reason: rewardReason,
          seasonId,
          recordType: type,
          recordValue: seasonRecord.recordValue,
          coinReward: reward.coinReward,
          vipDurationSeconds: reward.vipDurationSeconds,
          vipQuantity: reward.vipQuantity,
        },
      }),
    ])
  );

  console.log(
    `[season_record_reward] processed seasonId=${seasonId} type=${type} rewardedPlayersCount=${rewardedPlayers.length}`
  );

  return {
    seasonId,
    type,
    rewardedPlayersCount: rewardedPlayers.length,
  };
}
