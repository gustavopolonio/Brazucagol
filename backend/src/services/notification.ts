import { type NotificationType } from "@/db/schema";
import { db } from "@/lib/drizzle";
import {
  createPlayerNotification,
  getPlayerNotificationById,
  getPlayerUnreadNotificationCount,
  listPlayerLatestNotifications,
  markAllPlayerNotificationsAsRead,
  markPlayerNotificationAsRead,
  type PlayerNotificationRow,
} from "@/repositories/playerNotificationsRepository";
import { getPlayerById } from "@/repositories/playerRepository";
import { assertPositiveInteger } from "@/utils/validation";

const MAX_NOTIFICATION_PAYLOAD_BYTES = 16 * 1024;
const MAX_LATEST_NOTIFICATIONS_LIMIT = 100;

export interface CreateNotificationParams {
  playerId: string;
  type: NotificationType;
  payload: Record<string, unknown>;
}

export interface MarkAsReadParams {
  notificationId: string;
}

export interface MarkAllAsReadParams {
  playerId: string;
}

export interface GetUnreadCountParams {
  playerId: string;
}

export interface GetLatestNotificationsParams {
  playerId: string;
  limit: number;
}

export interface MarkAllAsReadResult {
  playerId: string;
  markedCount: number;
}

interface PlayerNotificationSocketPayload {
  id: string;
  type: NotificationType;
  payload: Record<string, unknown>;
  createdAt: Date;
  readAt: Date | null;
}

function toPlayerNotificationSocketPayload(
  notification: PlayerNotificationRow
): PlayerNotificationSocketPayload {
  return {
    id: notification.id,
    type: notification.type,
    payload: notification.payload,
    createdAt: notification.createdAt,
    readAt: notification.readAt,
  };
}

function assertNotificationPayload(payload: Record<string, unknown>): void {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    throw new Error("payload must be a plain object.");
  }

  let payloadSerialized = "";

  try {
    payloadSerialized = JSON.stringify(payload);
  } catch {
    throw new Error("payload must be JSON serializable.");
  }

  if (Buffer.byteLength(payloadSerialized, "utf8") > MAX_NOTIFICATION_PAYLOAD_BYTES) {
    throw new Error("payload exceeds the maximum allowed size.");
  }
}

function assertLatestNotificationsLimit(limit: number): void {
  assertPositiveInteger(limit, "limit");

  if (limit > MAX_LATEST_NOTIFICATIONS_LIMIT) {
    throw new Error(`limit must be less than or equal to ${MAX_LATEST_NOTIFICATIONS_LIMIT}.`);
  }
}

export async function createNotification({
  playerId,
  type,
  payload,
}: CreateNotificationParams): Promise<PlayerNotificationRow> {
  assertNotificationPayload(payload);

  return db.transaction(async (transaction) => {
    const player = await getPlayerById({
      db: transaction,
      playerId,
    });

    if (!player) {
      throw new Error("Player not found.");
    }

    return createPlayerNotification({
      db: transaction,
      playerId,
      type,
      payload,
    });
  });
}

export async function createAndDeliverNotification({
  playerId,
  type,
  payload,
}: CreateNotificationParams): Promise<PlayerNotificationRow> {
  const createdNotification = await createNotification({
    playerId,
    type,
    payload,
  });

  try {
    const [{ isPlayerOffline }, { emitToPlayer }] = await Promise.all([
      import("@/services/gameplayPresenceStore"),
      import("@/sockets/emitter"),
    ]);

    const isOffline = await isPlayerOffline(playerId);

    if (!isOffline) {
      emitToPlayer(
        playerId,
        "player:notification",
        toPlayerNotificationSocketPayload(createdNotification)
      );
    }
  } catch (error) {
    console.warn(
      `[notification] failed to deliver realtime notification playerId=${playerId} notificationId=${createdNotification.id}`,
      error
    );
  }

  return createdNotification;
}

export async function markAsRead({
  notificationId,
}: MarkAsReadParams): Promise<PlayerNotificationRow> {
  const currentDate = new Date();
  const updatedNotification = await markPlayerNotificationAsRead({
    db,
    notificationId,
    readAt: currentDate,
  });

  if (updatedNotification) {
    return updatedNotification;
  }

  const existingNotification = await getPlayerNotificationById({
    db,
    notificationId,
  });

  if (!existingNotification) {
    throw new Error("Notification not found.");
  }

  return existingNotification;
}

export async function markAllAsRead({
  playerId,
}: MarkAllAsReadParams): Promise<MarkAllAsReadResult> {
  const currentDate = new Date();
  const markedCount = await markAllPlayerNotificationsAsRead({
    db,
    playerId,
    readAt: currentDate,
  });

  return {
    playerId,
    markedCount,
  };
}

export async function getUnreadCount({ playerId }: GetUnreadCountParams): Promise<number> {
  return getPlayerUnreadNotificationCount({
    db,
    playerId,
  });
}

export async function getLatestNotifications({
  playerId,
  limit,
}: GetLatestNotificationsParams): Promise<PlayerNotificationRow[]> {
  assertLatestNotificationsLimit(limit);

  return listPlayerLatestNotifications({
    db,
    playerId,
    limit,
  });
}
