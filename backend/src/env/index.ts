import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  // env
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  PORT: z.coerce.number().default(3333),

  // Client URL
  CLIENT_URL: z.url(),

  // DB
  DATABASE_URL: z.url(),

  // Redis
  REDIS_URL: z.string().min(1),

  // Auth
  BETTER_AUTH_SECRET: z.string(),

  // Google
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),

  // Cooldowns
  COOLDOWN_STANDARD_SECONDS: z.coerce.number().int().positive().default(600), // 10 min
  COOLDOWN_VIP_SECONDS: z.coerce.number().int().positive().default(300), // 5 min

  // Workers
  MATCH_LIFECYCLE_WORKER_INTERVAL_MS: z.coerce.number().default(30000), // 30 sec
  AUTO_GOAL_WORKER_INTERVAL_MS: z.coerce.number().default(2000), // 2 sec
  PRESENCE_CLEANUP_INTERVAL_MS: z.coerce.number().default(60000), // 60 sec
  LEADERBOARD_SNAPSHOT_INTERVAL_MS: z.coerce.number().default(10000), // 10 sec
  ONLINE_PLAYERS_COUNT_INTERVAL_MS: z.coerce.number().default(60000), // 60 sec
  ONLINE_WINDOW_MS: z.coerce.number().int().positive().default(60000), // 60 sec
  PRESIDENT_ACTIVITY_WORKER_INTERVAL_MS: z.coerce.number().default(86400000), // 1 day

  // Leaderboard TTLs (history window)
  HOUR_LEADERBOARD_TTL_SECONDS: z.coerce.number().int().positive().default(7200), // 2 hours
  ROUND_LEADERBOARD_TTL_SECONDS: z.coerce.number().int().positive().default(604800), // 7 days

  // Probabilities
  GOAL_PROBABILITY_AUTO: z.coerce.number().min(0).max(1),
  GOAL_PROBABILITY_PENALTY: z.coerce.number().min(0).max(1),
  GOAL_PROBABILITY_FREE_KICK: z.coerce.number().min(0).max(1),
  GOAL_PROBABILITY_TRAIL: z.coerce.number().min(0).max(1),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
