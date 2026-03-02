import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { playerNotifications, type PlayerNotification, type NotificationType } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

type DbClient = (typeof import("@/lib/drizzle"))["db"];

export type PlayerNotificationRow = Pick<
  PlayerNotification,
  "id" | "playerId" | "type" | "payload" | "readAt" | "createdAt"
>;

interface CreatePlayerNotificationProps {
  db: Transaction | DbClient;
  playerId: string;
  type: NotificationType;
  payload: Record<string, unknown>;
}

export async function createPlayerNotification({
  db,
  playerId,
  type,
  payload,
}: CreatePlayerNotificationProps): Promise<PlayerNotificationRow> {
  const rows = await db
    .insert(playerNotifications)
    .values({
      playerId,
      type,
      payload,
    })
    .returning({
      id: playerNotifications.id,
      playerId: playerNotifications.playerId,
      type: playerNotifications.type,
      payload: playerNotifications.payload,
      readAt: playerNotifications.readAt,
      createdAt: playerNotifications.createdAt,
    });

  return rows[0];
}

interface GetPlayerNotificationByIdProps {
  db: Transaction | DbClient;
  notificationId: string;
}

export async function getPlayerNotificationById({
  db,
  notificationId,
}: GetPlayerNotificationByIdProps): Promise<PlayerNotificationRow | null> {
  const rows = await db
    .select({
      id: playerNotifications.id,
      playerId: playerNotifications.playerId,
      type: playerNotifications.type,
      payload: playerNotifications.payload,
      readAt: playerNotifications.readAt,
      createdAt: playerNotifications.createdAt,
    })
    .from(playerNotifications)
    .where(eq(playerNotifications.id, notificationId))
    .limit(1);

  return rows[0] ?? null;
}

interface MarkPlayerNotificationAsReadProps {
  db: Transaction | DbClient;
  notificationId: string;
  readAt: Date;
}

export async function markPlayerNotificationAsRead({
  db,
  notificationId,
  readAt,
}: MarkPlayerNotificationAsReadProps): Promise<PlayerNotificationRow | null> {
  const rows = await db
    .update(playerNotifications)
    .set({ readAt })
    .where(and(eq(playerNotifications.id, notificationId), isNull(playerNotifications.readAt)))
    .returning({
      id: playerNotifications.id,
      playerId: playerNotifications.playerId,
      type: playerNotifications.type,
      payload: playerNotifications.payload,
      readAt: playerNotifications.readAt,
      createdAt: playerNotifications.createdAt,
    });

  return rows[0] ?? null;
}

interface MarkAllPlayerNotificationsAsReadProps {
  db: Transaction | DbClient;
  playerId: string;
  readAt: Date;
}

export async function markAllPlayerNotificationsAsRead({
  db,
  playerId,
  readAt,
}: MarkAllPlayerNotificationsAsReadProps): Promise<number> {
  const rows = await db
    .update(playerNotifications)
    .set({ readAt })
    .where(and(eq(playerNotifications.playerId, playerId), isNull(playerNotifications.readAt)))
    .returning({
      id: playerNotifications.id,
    });

  return rows.length;
}

interface GetPlayerUnreadNotificationCountProps {
  db: Transaction | DbClient;
  playerId: string;
}

export async function getPlayerUnreadNotificationCount({
  db,
  playerId,
}: GetPlayerUnreadNotificationCountProps): Promise<number> {
  const rows = await db
    .select({
      unreadCount: sql<number>`count(*)::int`,
    })
    .from(playerNotifications)
    .where(and(eq(playerNotifications.playerId, playerId), isNull(playerNotifications.readAt)));

  return rows[0]?.unreadCount ?? 0;
}

interface ListPlayerLatestNotificationsProps {
  db: Transaction | DbClient;
  playerId: string;
  limit: number;
}

export async function listPlayerLatestNotifications({
  db,
  playerId,
  limit,
}: ListPlayerLatestNotificationsProps): Promise<PlayerNotificationRow[]> {
  return db
    .select({
      id: playerNotifications.id,
      playerId: playerNotifications.playerId,
      type: playerNotifications.type,
      payload: playerNotifications.payload,
      readAt: playerNotifications.readAt,
      createdAt: playerNotifications.createdAt,
    })
    .from(playerNotifications)
    .where(eq(playerNotifications.playerId, playerId))
    .orderBy(desc(playerNotifications.createdAt), desc(playerNotifications.id))
    .limit(limit);
}
