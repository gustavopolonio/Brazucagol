import { and, eq, isNull, sql } from "drizzle-orm";
import {
  clubTransferProposals,
  type ClubTransferProposalStatus,
  type ClubTransferProposal,
} from "@/db/schema";
import { Transaction } from "@/lib/drizzle";

export type ClubTransferProposalRow = Pick<
  ClubTransferProposal,
  | "id"
  | "proposerClubId"
  | "targetPlayerCurrentClubId"
  | "actorPlayerId"
  | "targetPlayerId"
  | "transferPassItemId"
  | "status"
  | "expiresAt"
  | "createdAt"
  | "resolvedAt"
>;

interface CreateClubTransferProposalProps {
  db: Transaction;
  proposerClubId: string;
  targetPlayerCurrentClubId: string;
  actorPlayerId: string;
  targetPlayerId: string;
  transferPassItemId: string;
  expiresAt: Date;
}

export async function createClubTransferProposal({
  db,
  proposerClubId,
  targetPlayerCurrentClubId,
  actorPlayerId,
  targetPlayerId,
  transferPassItemId,
  expiresAt,
}: CreateClubTransferProposalProps): Promise<ClubTransferProposalRow> {
  const rows = await db
    .insert(clubTransferProposals)
    .values({
      proposerClubId,
      targetPlayerCurrentClubId,
      actorPlayerId,
      targetPlayerId,
      transferPassItemId,
      status: "pending",
      expiresAt,
    })
    .returning({
      id: clubTransferProposals.id,
      proposerClubId: clubTransferProposals.proposerClubId,
      targetPlayerCurrentClubId: clubTransferProposals.targetPlayerCurrentClubId,
      actorPlayerId: clubTransferProposals.actorPlayerId,
      targetPlayerId: clubTransferProposals.targetPlayerId,
      transferPassItemId: clubTransferProposals.transferPassItemId,
      status: clubTransferProposals.status,
      expiresAt: clubTransferProposals.expiresAt,
      createdAt: clubTransferProposals.createdAt,
      resolvedAt: clubTransferProposals.resolvedAt,
    });

  return rows[0];
}

interface GetClubTransferProposalByIdForUpdateProps {
  db: Transaction;
  proposalId: string;
}

export async function getClubTransferProposalByIdForUpdate({
  db,
  proposalId,
}: GetClubTransferProposalByIdForUpdateProps): Promise<ClubTransferProposalRow | null> {
  const result = await db.execute(sql`
    select
      ${clubTransferProposals.id} as "id",
      ${clubTransferProposals.proposerClubId} as "proposerClubId",
      ${clubTransferProposals.targetPlayerCurrentClubId} as "targetPlayerCurrentClubId",
      ${clubTransferProposals.actorPlayerId} as "actorPlayerId",
      ${clubTransferProposals.targetPlayerId} as "targetPlayerId",
      ${clubTransferProposals.transferPassItemId} as "transferPassItemId",
      ${clubTransferProposals.status} as "status",
      ${clubTransferProposals.expiresAt} as "expiresAt",
      ${clubTransferProposals.createdAt} as "createdAt",
      ${clubTransferProposals.resolvedAt} as "resolvedAt"
    from ${clubTransferProposals}
    where ${clubTransferProposals.id} = ${proposalId}
    limit 1
    for update
  `);

  return (result.rows[0] as ClubTransferProposalRow | undefined) ?? null;
}

interface ResolveClubTransferProposalProps {
  db: Transaction;
  proposalId: string;
  status: Exclude<ClubTransferProposalStatus, "pending">;
  resolvedAt: Date;
}

export async function resolveClubTransferProposal({
  db,
  proposalId,
  status,
  resolvedAt,
}: ResolveClubTransferProposalProps): Promise<ClubTransferProposalRow | null> {
  const rows = await db
    .update(clubTransferProposals)
    .set({
      status,
      resolvedAt,
    })
    .where(
      and(
        eq(clubTransferProposals.id, proposalId),
        eq(clubTransferProposals.status, "pending"),
        isNull(clubTransferProposals.resolvedAt)
      )
    )
    .returning({
      id: clubTransferProposals.id,
      proposerClubId: clubTransferProposals.proposerClubId,
      targetPlayerCurrentClubId: clubTransferProposals.targetPlayerCurrentClubId,
      actorPlayerId: clubTransferProposals.actorPlayerId,
      targetPlayerId: clubTransferProposals.targetPlayerId,
      transferPassItemId: clubTransferProposals.transferPassItemId,
      status: clubTransferProposals.status,
      expiresAt: clubTransferProposals.expiresAt,
      createdAt: clubTransferProposals.createdAt,
      resolvedAt: clubTransferProposals.resolvedAt,
    });

  return rows[0] ?? null;
}
