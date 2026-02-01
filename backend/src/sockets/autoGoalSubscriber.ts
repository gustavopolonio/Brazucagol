import { redisClient } from "@/lib/redis";
import { AUTO_GOAL_SCORED_CHANNEL } from "@/redis/keys/autoGoal";
import { emitToPlayer } from "@/sockets/emitter";

export function startAutoGoalSubscriber() {
  const subscriber = redisClient.duplicate();

  subscriber.on("message", (channel, message) => {
    if (channel !== AUTO_GOAL_SCORED_CHANNEL) return;

    try {
      const payload = JSON.parse(message) as { playerId?: string };

      if (!payload?.playerId) {
        return;
      }

      emitToPlayer(payload.playerId, "goal_result", payload);
    } catch (error) {
      console.warn("Failed to process auto-goal message", error);
    }
  });

  subscriber.subscribe(AUTO_GOAL_SCORED_CHANNEL).catch((error) => {
    console.warn("Failed to subscribe to auto-goal channel", error);
  });
}
