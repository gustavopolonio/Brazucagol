import { getLatestNotifications, getUnreadCount, markAsRead } from "@/services/notification";
import { getPlayerIdByUserId } from "@/repositories/playerRepository";
import { db } from "@/lib/drizzle";

export interface GetLoggedPlayerLatestNotificationsParams {
  userId: string;
  limit: number;
}

export interface GetLoggedPlayerUnreadNotificationsCountParams {
  userId: string;
}

export interface MarkLoggedPlayerNotificationAsReadParams {
  userId: string;
  notificationId: string;
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

export async function getLoggedPlayerUnreadNotificationsCount({
  userId,
}: GetLoggedPlayerUnreadNotificationsCountParams) {
  const player = await getPlayerIdByUserId({
    db,
    userId,
  });

  if (!player) {
    throw new Error("Player not found.");
  }

  const unreadCount = await getUnreadCount({
    playerId: player.id,
  });

  return {
    unreadCount,
  };
}

export async function markLoggedPlayerNotificationAsRead({
  userId,
  notificationId,
}: MarkLoggedPlayerNotificationAsReadParams) {
  const player = await getPlayerIdByUserId({
    db,
    userId,
  });

  if (!player) {
    throw new Error("Player not found.");
  }

  const notification = await markAsRead({
    playerId: player.id,
    notificationId,
  });

  return {
    notification,
  };
}
