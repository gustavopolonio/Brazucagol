import crypto from "node:crypto";
import { redisClient } from "@/lib/redis";
import { GoalActionType } from "@/types/goal.types";

interface CooldownKeyProps {
  playerId: string;
  actionType: GoalActionType;
}

interface TryAcquireCooldownProps {
  playerId: string;
  actionType: GoalActionType;
  ttlInSeconds: number;
}

type TryAcquireCooldownResult =
  | { acquired: true; token: string }
  | { acquired: false; ttlRemainingSeconds: number }
  | { acquired: false; cooldownUnavailable: true };

interface InitializeCooldownIfMissingProps {
  playerId: string;
  actionType: GoalActionType;
  ttlInSeconds: number;
}

export function buildCooldownKey({ playerId, actionType }: CooldownKeyProps) {
  return `cooldown:v1:${actionType}:${playerId}`;
}

export async function initializeCooldownIfMissing({
  playerId,
  actionType,
  ttlInSeconds,
}: InitializeCooldownIfMissingProps): Promise<void> {
  const cooldownKey = buildCooldownKey({ playerId, actionType });

  try {
    await redisClient.set(cooldownKey, "init", "EX", ttlInSeconds, "NX");
  } catch (error) {
    console.error("Failed to initialize cooldown", error);
  }
}

// Acquiring the right to perform the kick action
export async function tryAcquireCooldown({
  playerId,
  actionType,
  ttlInSeconds,
}: TryAcquireCooldownProps): Promise<TryAcquireCooldownResult> {
  const cooldownKey = buildCooldownKey({ playerId, actionType });
  const cooldownToken = crypto.randomUUID();

  try {
    const setResult = await redisClient.set(cooldownKey, cooldownToken, "EX", ttlInSeconds, "NX");

    if (setResult === "OK") {
      return { acquired: true, token: cooldownToken }; // There wasn't an existing cooldown (kick right acquired)
    }

    const ttlRemainingSeconds = await redisClient.ttl(cooldownKey);

    if (ttlRemainingSeconds > 0) {
      return { acquired: false, ttlRemainingSeconds }; // Cooldown exists (kick right not acquired)
    }

    // cooldownKey not found -> retry process
    if (ttlRemainingSeconds === -2) {
      const retryResult = await redisClient.set(
        cooldownKey,
        cooldownToken,
        "EX",
        ttlInSeconds,
        "NX"
      );

      if (retryResult === "OK") {
        return { acquired: true, token: cooldownToken };
      }

      const ttlLiveRemainingSeconds = await redisClient.ttl(cooldownKey);

      return {
        acquired: false,
        ttlRemainingSeconds: Math.max(0, ttlLiveRemainingSeconds),
      };
    }

    return { acquired: false, ttlRemainingSeconds: 0 };
  } catch (error) {
    console.error("Failed to acquire cooldown lock", error);
    return { acquired: false, cooldownUnavailable: true };
  }
}

const RELEASE_COOLDOWN_SCRIPT = `
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
end
return 0
`;

interface ReleaseCooldownIfTokenMatchesProps {
  playerId: string;
  actionType: GoalActionType;
  token: string;
}

export async function releaseCooldownIfTokenMatches({
  playerId,
  actionType,
  token,
}: ReleaseCooldownIfTokenMatchesProps): Promise<boolean> {
  const cooldownKey = buildCooldownKey({ playerId, actionType });

  try {
    const result = await redisClient.eval(RELEASE_COOLDOWN_SCRIPT, 1, cooldownKey, token);
    return result === 1;
  } catch (error) {
    console.error("Failed to release cooldown lock", error);
    return false;
  }
}
