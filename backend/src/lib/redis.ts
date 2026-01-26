import Redis from "ioredis";
import { env } from "@/env";

const redisClient = new Redis(env.REDIS_URL);

redisClient.on("error", (error) => {
  console.error("Redis connection error", error);
});

export { redisClient };
