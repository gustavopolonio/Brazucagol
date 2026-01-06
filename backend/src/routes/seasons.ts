import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "@/lib/drizzle";
import { scheduleSeasonMatches } from "@/services/season/schedule";
import { isFiniteNumber, toRoundStartDate, toZonedDayKey } from "@/utils";
import {
  createSeasonPauses,
  deleteSeasonPausesBySeasonId,
} from "@/repositories/seasonPausesRepository";

function findDuplicatePauseDays(pauses: Array<{ date: Date }>): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const pause of pauses) {
    const key = toZonedDayKey(pause.date);
    if (seen.has(key)) duplicates.add(key);
    seen.add(key);
  }

  return Array.from(duplicates).sort();
}

export async function seasonsRoutes(fastify: FastifyInstance) {
  fastify.post("/seasons/:seasonId/schedule", async (request, reply) => {
    const paramsSchema = z.object({
      seasonId: z.uuid(),
    });

    const bodySchema = z.object({
      seasonStartsAt: z.iso.datetime({ offset: true }),
      pauses: z
        .array(
          z.object({
            date: z.iso.datetime({ offset: true }),
            reason: z.string().trim().min(1).max(255).optional(),
          })
        )
        .optional()
        .default([]),
      dryRun: z.boolean().optional().default(false),
    });

    const { seasonId } = paramsSchema.parse(request.params);
    const {
      seasonStartsAt: seasonStartsAtBodyInput,
      pauses: pausesBodyInput,
      dryRun,
    } = bodySchema.parse(request.body);

    const seasonStartsAtInput = new Date(seasonStartsAtBodyInput);
    if (!isFiniteNumber(seasonStartsAtInput.getTime())) {
      return reply.status(400).send({ error: "Invalid startsAt datetime." });
    }

    const seasonStartsAt = toRoundStartDate(seasonStartsAtInput);

    const pauses: Array<{ date: Date; reason?: string }> = [];

    for (const pause of pausesBodyInput) {
      const pauseDate = new Date(pause.date);
      if (!isFiniteNumber(pauseDate.getTime())) {
        return reply.status(400).send({ error: "Invalid pause startsAt datetime." });
      }

      pauses.push({
        date: toRoundStartDate(pauseDate),
        reason: pause.reason,
      });
    }

    const duplicateDays = findDuplicatePauseDays(pauses);

    if (duplicateDays.length > 0) {
      return reply.status(400).send({
        error: `Duplicate pause date(s): ${duplicateDays.join(", ")}. Only one pause per day is allowed.`,
      });
    }

    try {
      const seasonSchedule = await db.transaction(async (tx) => {
        if (!dryRun) {
          await deleteSeasonPausesBySeasonId({ db: tx, seasonId }); // Deleting possible pauses already created for this season

          if (pauses.length !== 0) {
            await createSeasonPauses({ db: tx, seasonId, pauses });
          }
        }

        return scheduleSeasonMatches({
          db: tx,
          seasonId,
          seasonStartsAt,
          pauses: pauses.map((pause) => ({ date: pause.date })),
          dryRun: dryRun,
        });
      });

      return reply.status(200).send({
        seasonId,
        seasonStartsAt: seasonStartsAt.toISOString(),
        seasonEndsAt: seasonSchedule.seasonEndsAt.toISOString(),
        dryRun: dryRun,
        rounds: seasonSchedule.schedule.map((round) => {
          const base = {
            date: round.date.toISOString(),
            competitionId: round.competitionId,
            type: round.competitionType,
          };

          return round.kind === "league"
            ? { ...base, leagueRound: round.leagueRound }
            : { ...base, cupRoundId: round.cupRoundId, cupStage: round.cupStage };
        }),
      });
    } catch (error) {
      request.log.error(error, "Failed to schedule season matches");
      return reply.status(400).send({
        error: error instanceof Error ? error.message : "Failed to schedule season matches.",
      });
    }
  });
}
