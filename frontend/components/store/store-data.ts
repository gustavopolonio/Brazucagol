export type StoreItemType = "vip" | "transfer_pass";
export type StorePricingType = "real_money_only" | "coins_and_real_money";

export type StoreItem = {
  id: string;
  name: string;
  type: StoreItemType;
  durationSeconds?: number;
  pricingType: StorePricingType;
  coinPriceCents?: number;
  realMoneyPriceCents: number;
};

export const simulatedCheckoutUrl =
  "https://checkout.infinitepay.io/brazucagol?lenc=G5EBIIzURjcLL7JVUIf3v9bekZLW-SaNSijUVZk90QaERqgikuKtO5BiSPW33mqrLwjC7PMSCv2kUUKB5txksI6zQqYSPRFV31WZz67A6PW4nbbAXdhiX-E1Zf4vBsKQjR8VAdTjBxoF2CeDfjrfHnrvs0RaB7FlCSgfCfDMMFBMSWdUrvKY3ZinPsSTaDNPogLba-b94vzO3zK6ZrmPHuk8PZ4c24VdvptW0WSz4wj77HXj6Y096b1i1FhwPnuaCCfBfNJ-702oIPzR5odkjN0us7hEbE4v55N2Gzxa9UIsmQPhmAKuEnA2TcFzKyHSSQSRyQUkNjKQG89IX0ywgesXRzQMdGnNtOrzqq9mWd9Cl1lcIjY.v1.eafc8cf398cfaf2e";

export const storeItems: StoreItem[] = [
  {
    id: "8ee2a2c0-a01b-4f8a-8639-7fbbff7f8516",
    name: "VIP - 1 dia",
    type: "vip",
    durationSeconds: 24 * 60 * 60,
    pricingType: "real_money_only",
    realMoneyPriceCents: 499,
  },
  {
    id: "0a745e7b-44ec-4d2d-bb2a-a0b8f6a42727",
    name: "VIP - 3 dias",
    type: "vip",
    durationSeconds: 3 * 24 * 60 * 60,
    pricingType: "real_money_only",
    realMoneyPriceCents: 1299,
  },
  {
    id: "3a0ab0e2-51df-4ac2-beee-fec377575982",
    name: "VIP - 7 dias",
    type: "vip",
    durationSeconds: 7 * 24 * 60 * 60,
    pricingType: "real_money_only",
    realMoneyPriceCents: 2799,
  },
  {
    id: "3d38ecdb-4f1c-48ca-8ce1-ca617b587aa7",
    name: "VIP - 15 dias",
    type: "vip",
    durationSeconds: 15 * 24 * 60 * 60,
    pricingType: "real_money_only",
    realMoneyPriceCents: 4999,
  },
  {
    id: "f29b55d8-3a13-4722-8f42-62e78592e891",
    name: "Passe de transferência",
    type: "transfer_pass",
    pricingType: "coins_and_real_money",
    coinPriceCents: 35000,
    realMoneyPriceCents: 499,
  },
];
