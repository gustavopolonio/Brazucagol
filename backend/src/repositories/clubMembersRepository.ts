import { and, eq, isNull } from "drizzle-orm";
import { clubMembers, type ClubMember } from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

export type PlayerClubMembershipRow = Pick<ClubMember, "clubId">;

interface GetPlayerClubMembershipProps {
  db: Transaction;
  playerId: string;
}

export async function getPlayerClubMembership({
  db,
  playerId,
}: GetPlayerClubMembershipProps): Promise<PlayerClubMembershipRow | null> {
  const rows = await db
    .select({
      clubId: clubMembers.clubId,
    })
    .from(clubMembers)
    .where(and(eq(clubMembers.playerId, playerId), isNull(clubMembers.leftAt)))
    .limit(1);

  return rows[0] ?? null;
}
