export const AUTO_GOAL_SCORED_CHANNEL = "events:auto_goal_scored";

export function buildAutoGoalClaimKey(playerId: string) {
  return `auto_goal:v1:claim:${playerId}`;
}
