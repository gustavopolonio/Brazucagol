import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getLeagueById, getLeagueMatches } from "@/repositories/leagueRepository";
import { getClubsByIds } from "@/repositories/clubRepository";
import { LeagueMatchWithClubs } from "@/types/league.types";

export const leaguesRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/leagues/:leagueId/matches", async (request, reply) => {
    const paramsSchema = z.object({
      leagueId: z.uuid(),
    });

    const querySchema = z.object({
      divisionNumber: z.coerce.number().int().positive(),
    });

    const { leagueId } = paramsSchema.parse(request.params);
    const { divisionNumber } = querySchema.parse(request.query);

    try {
      const league = await getLeagueById(leagueId);

      if (!league) {
        return reply.status(404).send({ error: "League not found." });
      }

      const leagueMatches = await getLeagueMatches(leagueId, divisionNumber);

      if (leagueMatches.length === 0) {
        return reply.status(404).send({ error: "No matches found for this league division." });
      }

      const clubIds = Array.from(
        new Set(leagueMatches.flatMap((match) => [match.homeClubId, match.awayClubId]))
      );

      const clubs = await getClubsByIds(clubIds);
      const clubsById = new Map(clubs.map((club) => [club.id, club]));

      const matchesByRound = new Map<number, LeagueMatchWithClubs[]>();

      for (const match of leagueMatches) {
        const round = match.leagueRound;

        const enrichedMatch: LeagueMatchWithClubs = {
          ...match,
          homeClub: clubsById.get(match.homeClubId)!,
          awayClub: clubsById.get(match.awayClubId)!,
        };

        const list = matchesByRound.get(round) ?? [];
        list.push(enrichedMatch);
        matchesByRound.set(round, list);
      }

      const rounds = Array.from(matchesByRound.entries()).map(([round, matches]) => ({
        round,
        matches,
      }));

      return reply.status(200).send({
        id: league.id,
        name: league.name,
        rounds,
      });
    } catch (error) {
      request.log.error(error, "Failed to fetch league matches");
      throw new Error(error);
    }
  });
};
