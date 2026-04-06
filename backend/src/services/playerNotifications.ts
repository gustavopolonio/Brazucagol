import { getLatestNotifications } from "@/services/notification";
import { getPlayerIdByUserId } from "@/repositories/playerRepository";
import { db } from "@/lib/drizzle";

export interface GetLoggedPlayerLatestNotificationsParams {
  userId: string;
  limit: number;
}

export async function getLoggedPlayerLatestNotifications({
  userId,
  limit,
}: GetLoggedPlayerLatestNotificationsParams) {
  const player = await getPlayerIdByUserId({
    db,
    userId,
  });

  if (!player) {
    throw new Error("Player not found.");
  }

  const notifications = await getLatestNotifications({
    playerId: player.id,
    limit,
  });

  return {
    notifications,
  };
}
