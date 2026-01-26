import { env } from "@/env";

export function resolveCooldownTtlInSeconds(vipExpiresAt: Date | null, currentTime: Date) {
  const isVipActive = vipExpiresAt !== null && vipExpiresAt.getTime() > currentTime.getTime();
  return isVipActive ? env.COOLDOWN_VIP_SECONDS : env.COOLDOWN_STANDARD_SECONDS;
}

export function getNextAutoGoalTimestamp(
  currentTimestampMilliseconds: number,
  cooldownTtlInSeconds: number
) {
  return currentTimestampMilliseconds + cooldownTtlInSeconds * 1000;
}
