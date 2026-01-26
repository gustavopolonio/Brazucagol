import { and, eq, isNull } from "drizzle-orm";
import { players, type Player } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

export type PlayerRow = Pick<Player, "id" | "level" | "vipExpiresAt">;
export type PlayerIdRow = Pick<Player, "id">;

type DbClient = (typeof import("@/lib/drizzle"))["db"];

interface GetPlayerByIdProps {
  db: Transaction | DbClient;
  playerId: string;
}

export async function getPlayerById({
  db,
  playerId,
}: GetPlayerByIdProps): Promise<PlayerRow | null> {
  const rows = await db
    .select({
      id: players.id,
      level: players.level,
      vipExpiresAt: players.vipExpiresAt,
    })
    .from(players)
    .where(and(eq(players.id, playerId), isNull(players.deletedAt)))
    .limit(1);

  return rows[0] ?? null;
}

interface UpdatePlayerLevelProps {
  db: Transaction;
  playerId: string;
  level: number;
}

export async function updatePlayerLevel({
  db,
  playerId,
  level,
}: UpdatePlayerLevelProps): Promise<void> {
  await db.update(players).set({ level }).where(eq(players.id, playerId));
}

interface GetPlayerIdByUserIdProps {
  db: Transaction | DbClient;
  userId: string;
}

export async function getPlayerIdByUserId({
  db,
  userId,
}: GetPlayerIdByUserIdProps): Promise<PlayerIdRow | null> {
  const rows = await db
    .select({
      id: players.id,
    })
    .from(players)
    .where(and(eq(players.userId, userId), isNull(players.deletedAt)))
    .limit(1);

  return rows[0] ?? null;
}
