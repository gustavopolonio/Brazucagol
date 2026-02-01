import { Socket } from "socket.io";
import { attemptGoalAction } from "@/services/goalScoringService";
import { handleGameplaySocketHeartbeat } from "@/services/gameplayPresence";
import { GoalActionType } from "@/types/goal.types";
import { emitToPlayer } from "@/sockets/emitter";

const ALLOWED_ACTION_TYPES: GoalActionType[] = ["penalty", "free_kick", "trail"];

type AttemptGoalPayload = {
  matchId: string;
  actionType: GoalActionType;
};

export function registerGameplayHandlers(socket: Socket): void {
  socket.on("heartbeat", async () => {
    const playerId = socket.data.playerId;

    if (!playerId) {
      return;
    }

    await handleGameplaySocketHeartbeat(playerId);
  });

  socket.on("attempt_goal", async (payload: AttemptGoalPayload) => {
    const playerId = socket.data.playerId;

    if (!playerId) {
      return;
    }

    if (!payload?.matchId || !ALLOWED_ACTION_TYPES.includes(payload.actionType)) {
      return;
    }

    try {
      const result = await attemptGoalAction({
        playerId,
        matchId: payload.matchId,
        actionType: payload.actionType,
      });

      emitToPlayer(playerId, "goal_result", result);
    } catch (error) {
      console.error("Failed to process goal attempt", error);
    }
  });
}
