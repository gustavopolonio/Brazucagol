import { db } from "@/lib/drizzle";
import { insertPlayerItemPurchaseLogWithCoins } from "@/repositories/itemPurchaseLogsRepository";
import { decrementPlayerCoins, getPlayerCoinsForUpdate } from "@/repositories/playerRepository";
import { upsertPlayerItemQuantityIncrease } from "@/repositories/playerItemsRepository";
import { getStoreItemById } from "@/repositories/storeItemsRepository";
import { assertPositiveInteger, assertStoreItemAllowsCoins } from "@/utils/validation";

export interface BuyStoreItemWithPlayerCoinsParams {
  actorPlayerId: string;
  storeItemId: string;
  quantity: number;
}

type PlayerEconomyOperationResult = {
  playerId: string;
};

export async function buyStoreItemWithPlayerCoins({
  actorPlayerId,
  storeItemId,
  quantity,
}: BuyStoreItemWithPlayerCoinsParams): Promise<PlayerEconomyOperationResult> {
  assertPositiveInteger(quantity, "quantity");

  return db.transaction(async (transaction) => {
    const playerCoins = await getPlayerCoinsForUpdate({
      db: transaction,
      playerId: actorPlayerId,
    });

    if (!playerCoins) {
      throw new Error("Player not found.");
    }

    const storeItem = await getStoreItemById({
      db: transaction,
      storeItemId,
    });

    if (!storeItem) {
      throw new Error("Store item not found.");
    }

    assertStoreItemAllowsCoins(
      storeItem.pricingType,
      "Store item cannot be purchased with player coins."
    );

    if (storeItem.coinPriceCents === null) {
      throw new Error("Store item does not have a coin price.");
    }

    const totalPrice = storeItem.coinPriceCents * quantity;
    assertPositiveInteger(totalPrice, "totalPrice");

    if (playerCoins.coins < totalPrice) {
      throw new Error("Player does not have enough coins.");
    }

    const updatedPlayerCoins = await decrementPlayerCoins({
      db: transaction,
      playerId: actorPlayerId,
      amount: totalPrice,
    });

    if (!updatedPlayerCoins) {
      throw new Error("Unable to complete player item purchase.");
    }

    await upsertPlayerItemQuantityIncrease({
      db: transaction,
      playerId: actorPlayerId,
      itemId: storeItemId,
      quantityToIncrease: quantity,
    });

    await insertPlayerItemPurchaseLogWithCoins({
      db: transaction,
      playerId: actorPlayerId,
      itemId: storeItemId,
      unitPrice: storeItem.coinPriceCents,
      quantity,
    });

    console.log(
      `[player_economy] buy_store_item_with_player_coins actorPlayerId=${actorPlayerId} storeItemId=${storeItemId} quantity=${quantity} totalPrice=${totalPrice} remainingCoins=${updatedPlayerCoins.coins}`
    );

    return {
      playerId: actorPlayerId,
    };
  });
}
