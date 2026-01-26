import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.url(),
  REDIS_URL: z.string().min(1),
  CLIENT_URL: z.url(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  MATCH_LIFECYCLE_WORKER_INTERVAL_MS: z.coerce.number().default(30000), // 30 sec
  AUTO_GOAL_WORKER_INTERVAL_MS: z.coerce.number().default(2000), // 2 sec
  PRESENCE_CLEANUP_INTERVAL_MS: z.coerce.number().default(60000), // 60 sec
  ONLINE_WINDOW_MS: z.coerce.number().int().positive().default(60000), // 60 sec
  COOLDOWN_STANDARD_SECONDS: z.coerce.number().int().positive().default(600), // 10 min
  COOLDOWN_VIP_SECONDS: z.coerce.number().int().positive().default(300), // 5 min
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
