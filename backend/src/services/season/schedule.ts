import { Transaction } from "@/lib/drizzle";
import { addDaysKeepingRoundStart, isFiniteNumber, toRoundStartDate, toZonedDayKey } from "@/utils";
import {
  getSeasonCompetitionsBySeasonId,
  getSeasonCupRoundsBySeasonId,
  getSeasonLeagueRoundsBySeasonId,
  getSeasonMatchesStatsBySeasonId,
  getSeasonNonPendingMatchesByDateRanges,
  updatePendingCupMatchDate,
  updatePendingLeagueMatchDate,
  updateSeasonScheduleDates,
} from "@/repositories/seasonRepository";

export type SeasonPauseInput = {
  date: Date;
};

type LeagueRound = {
  kind: "league";
  competitionId: string;
  competitionType: "league";
  leagueRound: number;
  order: number;
};

type CupRound = {
  kind: "cup";
  competitionId: string;
  competitionType: "cup";
  cupRoundId: string;
  cupStage: number;
  order: number;
};

export type SeasonRound = LeagueRound | CupRound;

export type SeasonScheduledRound = SeasonRound & {
  date: Date;
};

interface AssertSeasonPausesAllowedProps {
  db: Transaction;
  seasonId: string;
  pausesToCreate: SeasonPauseInput[];
}

export async function ensureSeasonPausesOnlyOnPendingMatches({
  db,
  seasonId,
  pausesToCreate,
}: AssertSeasonPausesAllowedProps) {
  const pausesToCreateByDay = new Map<string, { date: Date }>();

  for (const pause of pausesToCreate) {
    const dayKey = toZonedDayKey(pause.date);
    if (!pausesToCreateByDay.has(dayKey)) {
      pausesToCreateByDay.set(dayKey, { date: pause.date });
    }
  }

  const pausesToCreateRanges = Array.from(pausesToCreateByDay.values()).map((pause) => {
    const start = toRoundStartDate(pause.date);
    const end = addDaysKeepingRoundStart({ date: start, daysToAdd: 1 });
    return { start, end };
  });

  const nonPendingMatches = await getSeasonNonPendingMatchesByDateRanges({
    db,
    seasonId,
    ranges: pausesToCreateRanges,
  });

  if (nonPendingMatches.length > 0) {
    const conflictDays = Array.from(
      new Set(nonPendingMatches.map((match) => toZonedDayKey(match.date)))
    ).sort();

    throw new Error(`Pause date(s) have non-pending matches: ${conflictDays.join(", ")}.`);
  }
}

function expandPauseDays(pauses: SeasonPauseInput[]): Set<string> {
  const pauseDays = new Set<string>();

  for (const pause of pauses) {
    const pauseInMs = pause.date.getTime();
    if (!isFiniteNumber(pauseInMs)) continue;
    pauseDays.add(toZonedDayKey(pause.date));
  }

  return pauseDays;
}

function intercalateSeasonRoundsKeepingCupFinalsLast(groups: SeasonRound[]): SeasonRound[] {
  const cupFinals: CupRound[] = [];
  const nonFinalRoundsByCompetition = new Map<string, SeasonRound[]>();

  for (const group of groups) {
    if (group.kind === "cup" && group.cupStage === 0) {
      cupFinals.push(group);
      continue;
    }

    const nonFinalRounds = nonFinalRoundsByCompetition.get(group.competitionId) ?? [];
    nonFinalRounds.push(group);
    nonFinalRoundsByCompetition.set(group.competitionId, nonFinalRounds);
  }

  nonFinalRoundsByCompetition.forEach((round) => {
    round.sort((a, b) => a.order - b.order);
  });

  let nonFinalRoundsTotal = 0;
  nonFinalRoundsByCompetition.forEach((round) => {
    nonFinalRoundsTotal += round.length;
  });

  const nonFinalRoundsWithKeys: Array<{
    key: number;
    competitionId: string;
    order: number;
    group: SeasonRound;
  }> = [];

  nonFinalRoundsByCompetition.forEach((rounds, competitionId) => {
    const currentCompetitionRoundsTotal = rounds.length;

    // Building sorting weights (stored in "key" variable)
    for (let round = 0; round < currentCompetitionRoundsTotal; round += 1) {
      const key =
        nonFinalRoundsTotal === 0
          ? 0
          : (round * nonFinalRoundsTotal) / currentCompetitionRoundsTotal;
      nonFinalRoundsWithKeys.push({ key, competitionId, order: round, group: rounds[round]! });
    }
  });

  nonFinalRoundsWithKeys.sort((a, b) => {
    if (a.key !== b.key) return a.key - b.key;
    if (a.competitionId !== b.competitionId) return a.competitionId.localeCompare(b.competitionId);
    return a.order - b.order;
  });

  cupFinals.sort((a, b) => a.competitionId.localeCompare(b.competitionId));

  return [...nonFinalRoundsWithKeys.map((round) => round.group), ...cupFinals];
}

interface AssignDatesToSeasonRoundsProps {
  orderedGroups: SeasonRound[];
  seasonStartsAt: Date;
  pauses: SeasonPauseInput[];
}

function assignDatesToSeasonRounds({
  orderedGroups,
  seasonStartsAt,
  pauses,
}: AssignDatesToSeasonRoundsProps): SeasonScheduledRound[] {
  const pauseDays = expandPauseDays(pauses);
  const schedule: SeasonScheduledRound[] = [];

  let cursor = toRoundStartDate(seasonStartsAt);

  for (const group of orderedGroups) {
    while (pauseDays.has(toZonedDayKey(cursor))) {
      cursor = addDaysKeepingRoundStart({ date: cursor, daysToAdd: 1 });
    }

    schedule.push({ ...group, date: new Date(cursor) });
    cursor = addDaysKeepingRoundStart({ date: cursor, daysToAdd: 1 });
  }

  return schedule;
}

interface BuildSeasonRoundsProps {
  db: Transaction;
  seasonId: string;
  requireAllPendingMatches?: boolean;
}

async function buildSeasonRounds({
  db,
  seasonId,
  requireAllPendingMatches = true,
}: BuildSeasonRoundsProps) {
  const seasonCompetitions = await getSeasonCompetitionsBySeasonId({ db, seasonId });

  if (seasonCompetitions.length === 0) {
    throw new Error("Season has no competitions.");
  }

  const competitionsById = new Map(
    seasonCompetitions.map((competition) => [competition.id, competition])
  );

  const stats = await getSeasonMatchesStatsBySeasonId({ db, seasonId });
  if (!stats || stats.totalMatches === 0) {
    throw new Error("Season has no matches.");
  }

  if (requireAllPendingMatches && stats.nonPendingMatches > 0) {
    throw new Error("Season has non-pending matches; refusing to reschedule.");
  }

  const leagueRoundsRows = await getSeasonLeagueRoundsBySeasonId({ db, seasonId });

  // "leagueCompAId" => [1, 2, 3, 4, 5, ...]; "leagueCompBId" => [1, 2, 3, ...]
  const leagueRoundsByCompetition = new Map<string, number[]>();

  for (const round of leagueRoundsRows) {
    if (!round.competitionId || round.leagueRound == null) continue;

    const list = leagueRoundsByCompetition.get(round.competitionId) ?? [];
    list.push(round.leagueRound);
    leagueRoundsByCompetition.set(round.competitionId, list);
  }

  const cupRoundsRows = await getSeasonCupRoundsBySeasonId({ db, seasonId });

  const cupRoundsByCompetition = new Map<string, Array<{ cupRoundId: string; stage: number }>>();

  for (const round of cupRoundsRows) {
    if (!round.competitionId || !round.cupRoundId) continue;

    const list = cupRoundsByCompetition.get(round.competitionId) ?? [];
    list.push({ cupRoundId: round.cupRoundId, stage: round.stage });
    cupRoundsByCompetition.set(round.competitionId, list);
  }

  const groups: SeasonRound[] = [];

  leagueRoundsByCompetition.forEach((rounds, competitionId) => {
    const competition = competitionsById.get(competitionId);
    if (!competition || competition.type !== "league") return;

    const uniqueSortedRounds = Array.from(new Set(rounds)).sort((a, b) => a - b);

    for (let i = 0; i < uniqueSortedRounds.length; i += 1) {
      groups.push({
        kind: "league",
        competitionId,
        competitionType: "league",
        leagueRound: uniqueSortedRounds[i],
        order: i,
      });
    }
  });

  cupRoundsByCompetition.forEach((rounds, competitionId) => {
    const competition = competitionsById.get(competitionId);
    if (!competition || competition.type !== "cup") return;

    const uniqueById = new Map(rounds.map((round) => [round.cupRoundId, round]));
    const sorted = Array.from(uniqueById.values()).sort((a, b) => b.stage - a.stage);

    for (let i = 0; i < sorted.length; i += 1) {
      groups.push({
        kind: "cup",
        competitionId,
        competitionType: "cup",
        cupRoundId: sorted[i].cupRoundId,
        cupStage: sorted[i].stage,
        order: i,
      });
    }
  });

  if (groups.length === 0) {
    throw new Error("Season has no schedulable round groups.");
  }

  return groups;
}

interface ScheduleSeasonMatchesProps {
  db: Transaction;
  seasonId: string;
  seasonStartsAt: Date;
  pauses?: SeasonPauseInput[];
  dryRun?: boolean;
  requireAllPendingMatches?: boolean;
}

export async function scheduleSeasonMatches({
  db,
  seasonId,
  seasonStartsAt,
  pauses = [],
  dryRun = false,
  requireAllPendingMatches = true,
}: ScheduleSeasonMatchesProps) {
  const seasonStartsAtRoundStart = toRoundStartDate(seasonStartsAt);

  const groups = await buildSeasonRounds({ db, seasonId, requireAllPendingMatches });
  const orderedGroups = intercalateSeasonRoundsKeepingCupFinalsLast(groups);

  const schedule = assignDatesToSeasonRounds({
    orderedGroups,
    seasonStartsAt: seasonStartsAtRoundStart,
    pauses,
  });

  const last = schedule.length > 0 ? schedule[schedule.length - 1] : undefined;
  const seasonEndsAt = last
    ? addDaysKeepingRoundStart({ date: last.date, daysToAdd: 1 })
    : new Date(seasonStartsAtRoundStart);

  if (dryRun) {
    return { schedule, seasonEndsAt };
  }

  await updateSeasonScheduleDates({
    db,
    seasonId,
    startsAt: seasonStartsAtRoundStart,
    endsAt: seasonEndsAt,
  });

  for (const round of schedule) {
    if (round.kind === "league") {
      await updatePendingLeagueMatchDate({
        db,
        competitionId: round.competitionId,
        leagueRound: round.leagueRound,
        date: round.date,
      });
    } else {
      await updatePendingCupMatchDate({
        db,
        competitionId: round.competitionId,
        cupRoundId: round.cupRoundId,
        date: round.date,
      });
    }
  }

  return { schedule, seasonEndsAt };
}
