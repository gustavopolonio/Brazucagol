import { db } from "@/lib/drizzle";
import { cupRounds, NewCupRound } from "@/db/schema";

const roundsSeed: NewCupRound[] = [
  { stage: 0, totalClubs: 2, name: "Final", slug: "final" },
  { stage: 1, totalClubs: 4, name: "Semifinal", slug: "semifinal" },
  { stage: 2, totalClubs: 8, name: "Quarterfinal", slug: "quarterfinal" },
  { stage: 3, totalClubs: 16, name: "Round of 16", slug: "round_of_16" },
  { stage: 4, totalClubs: 32, name: "Round of 32", slug: "round_of_32" },
  { stage: 5, totalClubs: 64, name: "Round of 64", slug: "round_of_64" },
  { stage: 6, totalClubs: 128, name: "Round of 128", slug: "round_of_128" },
];

async function seedCupRounds() {
  console.log("Seeding cup rounds...");

  await db.insert(cupRounds).values(roundsSeed).onConflictDoNothing();

  console.log(`Inserted ${roundsSeed.length} cup rounds (existing rows skipped).`);
}

seedCupRounds()
  .then(() => {
    console.log("Cup rounds seed finished.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Cup rounds seed failed:", error);
    process.exit(1);
  });
