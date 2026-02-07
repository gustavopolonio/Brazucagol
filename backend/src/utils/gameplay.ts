import { env } from "@/env";

export function isVipActive(vipExpiresAt: Date | null, currentTime: Date): boolean {
  return vipExpiresAt !== null && vipExpiresAt.getTime() > currentTime.getTime();
}

export function resolveCooldownTtlInSeconds(vipExpiresAt: Date | null, currentTime: Date) {
  return isVipActive(vipExpiresAt, currentTime)
    ? env.COOLDOWN_VIP_SECONDS
    : env.COOLDOWN_STANDARD_SECONDS;
}

export function getNextAutoGoalTimestamp(
  currentTimestampMilliseconds: number,
  cooldownTtlInSeconds: number
) {
  return currentTimestampMilliseconds + cooldownTtlInSeconds * 1000;
}
