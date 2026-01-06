import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "@/lib/drizzle";
import { createSeason } from "@/services/season";
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
  fastify.post("/seasons", async (request, reply) => {
    const bodySchema = z.object({
      seasonName: z.string().trim().min(1).max(50),
      startsAt: z.iso.datetime({ offset: true }).optional(),
      endsAt: z.iso.datetime({ offset: true }).optional(),
    });

    const { seasonName, startsAt, endsAt } = bodySchema.parse(request.body);

    const parsedStartsAt = startsAt ? new Date(startsAt) : undefined;
    const parsedEndsAt = endsAt ? new Date(endsAt) : undefined;

    if (parsedStartsAt && !isFiniteNumber(parsedStartsAt.getTime())) {
      return reply.status(400).send({ error: "Invalid startsAt datetime." });
    }
    if (parsedEndsAt && !isFiniteNumber(parsedEndsAt.getTime())) {
      return reply.status(400).send({ error: "Invalid endsAt datetime." });
    }

    try {
      const season = await createSeason(seasonName, {
        startsAt: parsedStartsAt,
        endsAt: parsedEndsAt,
      });

      return reply.status(201).send({
        id: season.id,
        seasonName: season.name,
        startsAt: season.startsAt ? season.startsAt.toISOString() : null,
        endsAt: season.endsAt ? season.endsAt.toISOString() : null,
        createdAt: season.createdAt.toISOString(),
      });
    } catch (error) {
      request.log.error(error, "Failed to create season");
      throw new Error(error);
    }
  });

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
