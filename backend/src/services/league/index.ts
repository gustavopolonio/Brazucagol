import { Transaction } from "@/lib/drizzle";
import { and, eq, isNull } from "drizzle-orm";
import {
  clubs,
  competitionClubs,
  leagueDivisions,
  leagueStandings,
  matches,
  NewLeagueDivision,
  NewMatch,
} from "@/db/schema";

interface ClubDivision {
  clubId: string;
  divisionId: string;
}

interface LeagueMatch {
  homeClubId: string;
  awayClubId: string;
}

interface LeagueRound {
  round: number;
  matches: LeagueMatch[];
}

interface CreateLeagueDivisionsProps {
  db: Transaction;
  competitionId: string;
  divisions: number;
}

export async function createLeagueDivisions({
  db,
  competitionId,
  divisions,
}: CreateLeagueDivisionsProps) {
  console.log("Creating league divisions...");

  if (divisions <= 0) throw new Error("Invalid number of divisions.");

  const values: NewLeagueDivision[] = Array.from({ length: divisions }, (_, i) => ({
    competitionId,
    divisionNumber: i + 1,
    name: i === divisions - 1 ? "Divisão de acesso" : `${i + 1}ª divisão`,
  }));

  await db.insert(leagueDivisions).values(values);

  console.log(`League divisions created - ${divisions} divison(s)`);
}

interface RandomlyBuildInitialLeagueDivisionAssignmentsProps {
  db: Transaction;
  competitionId: string;
}

export async function randomlyBuildInitialLeagueDivisionAssignments({
  db,
  competitionId,
}: RandomlyBuildInitialLeagueDivisionAssignmentsProps) {
  console.log(
    `Randomly building initial league divisions assigments for competition id: ${competitionId}`
  );

  const CLUBS_PER_DIVISION = 20;

  // Get divisions ordered by division number
  const divisions = await db
    .select({
      id: leagueDivisions.id,
      divisionNumber: leagueDivisions.divisionNumber,
    })
    .from(leagueDivisions)
    .where(eq(leagueDivisions.competitionId, competitionId))
    .orderBy(leagueDivisions.divisionNumber);

  if (divisions.length <= 0) throw new Error("Invalid league divisions quantity");

  // Get Clubs
  const clubsList = await db
    .select({
      id: clubs.id,
    })
    .from(clubs)
    .where(isNull(clubs.deletedAt));

  if (clubsList.length !== divisions.length * CLUBS_PER_DIVISION)
    throw new Error(
      `Expected exatcly ${divisions.length * CLUBS_PER_DIVISION} clubs instead of ${clubsList.length}`
    );

  // Shuffle clubs (V1)
  const clubsShuffled = [...clubsList].sort(() => Math.random() - 0.5);

  // Split clubs into divisions
  const assignments: ClubDivision[] = [];

  divisions.forEach((division, index) => {
    const startIndex = index * CLUBS_PER_DIVISION;
    const endIndex = (index + 1) * CLUBS_PER_DIVISION;
    const clubsInCurrentDivision = clubsShuffled.slice(startIndex, endIndex);

    if (clubsInCurrentDivision.length !== CLUBS_PER_DIVISION)
      throw new Error(
        `Division ${division.divisionNumber} has invalid clubs count (${clubsInCurrentDivision.length})`
      );

    clubsInCurrentDivision.forEach((club) => {
      assignments.push({
        clubId: club.id,
        divisionId: division.id,
      });
    });
  });

  console.log(`Builded initial league divisions assigments for competition id: ${competitionId}`);

  return assignments;
}

interface AssignClubsToCompetitionProps {
  db: Transaction;
  competitionId: string;
  assignments: ClubDivision[];
}

export async function assignClubsToCompetition({
  db,
  competitionId,
  assignments,
}: AssignClubsToCompetitionProps) {
  console.log("Assigning clubs to divisions...");

  if (assignments.length === 0) throw new Error("No clubs assignments provided.");

  await db.insert(competitionClubs).values(
    assignments.map((a) => ({
      competitionId,
      divisionId: a.divisionId,
      clubId: a.clubId,
    }))
  );

  console.log(`Clubs assigned to divisions, competition id: ${competitionId}`);
}

interface CreateLeagueStandingsProps {
  db: Transaction;
  competitionId: string;
  assignments: ClubDivision[];
}

export async function createLeagueStandings({
  db,
  competitionId,
  assignments,
}: CreateLeagueStandingsProps) {
  console.log("Creating league standings...");

  if (assignments.length === 0) throw new Error("No clubs assignments provided.");

  const alreadyHasStandings = await db
    .select({ id: leagueStandings.id })
    .from(leagueStandings)
    .where(eq(leagueStandings.competitionId, competitionId));

  if (alreadyHasStandings.length > 0)
    throw new Error(`Competition already has standings, competition id: ${competitionId}`);

  await db.insert(leagueStandings).values(
    assignments.map((assignment) => ({
      competitionId,
      divisionId: assignment.divisionId,
      clubId: assignment.clubId,
    }))
  );

  console.log("League standings created");
}

export function buildDoubleRoundRobinSchedule(clubIds: string[]) {
  if (clubIds.length % 2 !== 0) throw new Error("Number of clubs must be even");

  const clubs = [...clubIds];
  const totalClubs = clubs.length;
  const roundsPerLeg = totalClubs - 1;
  const matchesPerRound = totalClubs / 2;

  const firstLeg: LeagueRound[] = [];

  // Circle method
  for (let round = 0; round < roundsPerLeg; round++) {
    const matches: LeagueMatch[] = [];

    // Each match from a round
    for (let matchIndex = 0; matchIndex < matchesPerRound; matchIndex++) {
      const clubA = clubs[matchIndex];
      const clubB = clubs[totalClubs - 1 - matchIndex];

      // Alternate home/away by round
      const isEven = round % 2 === 0;

      matches.push({
        homeClubId: isEven ? clubA : clubB,
        awayClubId: isEven ? clubB : clubA,
      });
    }

    firstLeg.push({ round, matches });

    // Rotate clubs (first club is fixed)
    clubs.splice(1, 0, clubs.pop());
  }

  const secondLeg: LeagueRound[] = firstLeg.map((round, index) => ({
    round: roundsPerLeg + index,
    matches: round.matches.map((match) => ({
      homeClubId: match.awayClubId,
      awayClubId: match.homeClubId,
    })),
  }));

  return [...firstLeg, ...secondLeg];
}

interface BuildLeagueScheduleProps {
  db: Transaction;
  competitionId: string;
}

export async function buildLeagueMatches({ db, competitionId }: BuildLeagueScheduleProps) {
  console.log(`Building league schedule for competition id: ${competitionId}`);

  // Check if competition already has matches
  const alreadyHasMatches = await db
    .select()
    .from(matches)
    .where(eq(matches.competitionId, competitionId));

  if (alreadyHasMatches.length > 0)
    throw new Error(`Competition already has matches, competition id: ${competitionId}`);

  // Get league divisions
  const divisions = await db
    .select({ id: leagueDivisions.id })
    .from(leagueDivisions)
    .where(eq(leagueDivisions.competitionId, competitionId));

  const allMatches: NewMatch[] = [];

  for (const division of divisions) {
    // Get clubs of this division
    const clubsFromCurrentDivision = await db
      .select({ clubId: competitionClubs.clubId })
      .from(competitionClubs)
      .where(
        and(
          eq(competitionClubs.competitionId, competitionId),
          eq(competitionClubs.divisionId, division.id)
        )
      );

    if (clubsFromCurrentDivision.length !== 20)
      throw new Error(`Division ${division.id} does not have 20 clubs`);

    const clubIds = clubsFromCurrentDivision.map((club) => club.clubId);

    const currentDivisionRounds = buildDoubleRoundRobinSchedule(clubIds);

    for (const round of currentDivisionRounds) {
      for (const match of round.matches) {
        allMatches.push({
          competitionId,
          divisionId: division.id,
          clubHomeId: match.homeClubId,
          clubAwayId: match.awayClubId,
          leagueRound: round.round,
          type: "league",
        });
      }
    }
  }

  console.log(`Builded league schedule for competitionId: ${competitionId}`);

  return allMatches;
}

interface PersistLeagueMatchesProps {
  db: Transaction;
  matchesToPersist: NewMatch[];
}

export async function persistLeagueMatches({ db, matchesToPersist }: PersistLeagueMatchesProps) {
  console.log(`
    Persisting ${matchesToPersist.length} league matches ...
    competition id: ${matchesToPersist[0].competitionId}  
  `);

  if (matchesToPersist.length === 0) throw new Error("No matches to insert");

  await db.insert(matches).values(matchesToPersist);

  console.log("League matches persisted");
}
