import { type ItemPricingType } from "@/db/schema";

export function assertPositiveInteger(value: number, fieldName: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive integer.`);
  }
}

export function assertStoreItemAllowsCoins(
  pricingType: ItemPricingType,
  errorMessage = "Store item cannot be purchased with coins."
): void {
  if (pricingType === "coins_only" || pricingType === "coins_and_real_money") {
    return;
  }

  throw new Error(errorMessage);
}
