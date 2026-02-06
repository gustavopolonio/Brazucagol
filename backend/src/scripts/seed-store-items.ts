import { db } from "@/lib/drizzle";
import { NewStoreItem, storeItems } from "@/db/schema";

type Vip = Pick<
  NewStoreItem,
  "name" | "durationSeconds" | "realMoneyPriceCents" | "isAvailableInStore"
>;

const vips: Vip[] = [
  /* VIPs available in store */
  {
    name: "VIP - 15 dias",
    durationSeconds: 15 * 24 * 60 * 60, // 15 days
    realMoneyPriceCents: 4999,
    isAvailableInStore: true,
  },
  {
    name: "VIP - 7 dias",
    durationSeconds: 7 * 24 * 60 * 60, // 7 days
    realMoneyPriceCents: 2799,
    isAvailableInStore: true,
  },
  {
    name: "VIP - 3 dias",
    durationSeconds: 3 * 24 * 60 * 60, // 3 days
    realMoneyPriceCents: 1299,
    isAvailableInStore: true,
  },
  {
    name: "VIP - 1 dia",
    durationSeconds: 24 * 60 * 60, // 1 day
    realMoneyPriceCents: 499,
    isAvailableInStore: true,
  },

  /* VIPs not available in store */
  {
    name: "VIP - 12 horas",
    durationSeconds: 12 * 60 * 60, // 12 hours
    realMoneyPriceCents: 399,
    isAvailableInStore: false,
  },
  {
    name: "VIP - 8 horas",
    durationSeconds: 8 * 60 * 60, // 8 hours
    realMoneyPriceCents: 399,
    isAvailableInStore: false,
  },
  {
    name: "VIP - 6 horas",
    durationSeconds: 6 * 60 * 60, // 6 hours
    realMoneyPriceCents: 399,
    isAvailableInStore: false,
  },
  {
    name: "VIP - 4 horas",
    durationSeconds: 4 * 60 * 60, // 4 hours
    realMoneyPriceCents: 399,
    isAvailableInStore: false,
  },
  {
    name: "VIP - 30 minutos",
    durationSeconds: 30 * 60, // 30 min
    realMoneyPriceCents: 399,
    isAvailableInStore: false,
  },
  {
    name: "VIP - 15 minutos",
    durationSeconds: 15 * 60, // 15 min
    realMoneyPriceCents: 399,
    isAvailableInStore: false,
  },
];

const itemsSeed: NewStoreItem[] = [
  {
    name: "Passe de transferência",
    type: "transfer_pass",
    pricingType: "coins_and_real_money",
    coinPriceCents: 35000,
    realMoneyPriceCents: 499,
    isAvailableInStore: true,
  },
];

vips.forEach((vipItem) =>
  itemsSeed.push({
    ...vipItem,
    type: "vip",
    pricingType: "real_money_only",
  })
);

async function seedItemsStore() {
  console.log("Seeding items store...");

  await db.insert(storeItems).values(itemsSeed).onConflictDoNothing();

  console.log(`Inserted ${itemsSeed.length} items (existing rows skipped).`);
}

seedItemsStore()
  .then(() => {
    console.log("Items store seed finished.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Items store seed failed:", error);
    process.exit(1);
  });
