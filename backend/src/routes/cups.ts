import { FastifyInstance } from "fastify";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/drizzle";
import { competitions } from "@/db/schema";
import { getCupMatches } from "@/repositories/cupRepository";
import {
  buildCupMatchesMetadata,
  buildMatchPayload,
  extractUniqueClubIdsFromCupMatches,
  groupCupMatchesByRound,
} from "@/utils/cup";
import { getClubsByIds } from "@/repositories/clubRepository";
import { ceilHalf } from "@/utils";
import { BracketContext, ClubPreview } from "@/types/cup.types";

export const cupsRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/cups/:cupId/bracket", async (request, reply) => {
    const paramsSchema = z.object({
      cupId: z.uuid(),
    });

    const { cupId } = paramsSchema.parse(request.params);

    try {
      const competition = await db.query.competitions.findFirst({
        where: eq(competitions.id, cupId),
      });

      if (!competition || competition.type !== "cup") {
        return reply.status(404).send({ error: "Cup not found." });
      }

      const cupMatches = await getCupMatches(cupId);

      if (cupMatches.length === 0) {
        return reply.status(404).send({ error: "No matches found for this cup." });
      }

      const clubIds = extractUniqueClubIdsFromCupMatches(cupMatches);

      const matchesById = new Map(cupMatches.map((match) => [match.id, match]));
      const clubsById = new Map<string, ClubPreview>();

      if (clubIds.length > 0) {
        const clubs = await getClubsByIds(clubIds);

        clubs.forEach((club) => {
          clubsById.set(club.id, club);
        });
      }

      const cupMatchesByRound = groupCupMatchesByRound(cupMatches);
      const matchMetadataById = buildCupMatchesMetadata(cupMatchesByRound);

      const bracketContext: BracketContext = {
        clubsById,
        matchesById,
        matchMetadataById,
      };

      const roundsPayload = cupMatchesByRound.map((round) => {
        const bracketSideSize = ceilHalf(round.matches.length);

        const matchesSideA = round.matches
          .slice(0, bracketSideSize)
          .map((match) => buildMatchPayload({ ctx: bracketContext, match }));

        const matchesSideB = round.matches
          .slice(bracketSideSize)
          .map((match) => buildMatchPayload({ ctx: bracketContext, match }));

        return {
          key: round.slug,
          name: round.name,
          stage: round.stage,
          totalClubs: round.totalClubs,
          matchesSideA,
          matchesSideB,
        };
      });

      return reply.status(200).send({
        id: competition.id,
        name: competition.name,
        brackets: roundsPayload,
      });
    } catch (error) {
      request.log.error(error, "Failed to fetch cup bracket");
      throw new Error(error as string);
    }
  });
};
