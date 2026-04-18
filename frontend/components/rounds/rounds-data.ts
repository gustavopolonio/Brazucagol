export type ClubDefinition = {
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  imageUrl?: string;
};

export type CompetitionSchedule = {
  id: string;
  name: string;
  description: string;
  stageLabel: string;
  accentStart: string;
  accentEnd: string;
  textColor: string;
};

export type MatchStatus = "scheduled" | "live" | "finished";

export type RoundMatch = {
  id: string;
  competition: CompetitionSchedule;
  kickoffAt: Date;
  homeClub: ClubDefinition;
  awayClub: ClubDefinition;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  minuteLabel: string;
};

export type RoundSchedule = {
  roundKey: string;
  globalRoundNumber: number;
  roundStart: Date;
  roundEnd: Date;
  activeCompetitions: CompetitionSchedule[];
  matches: RoundMatch[];
  isCurrentRound: boolean;
};

type CompetitionId = "liga-brazucagol" | "copa-brazucagol" | "copa-do-brazil";

type CompetitionDefinition = {
  id: CompetitionId;
  name: string;
  description: string;
  accentStart: string;
  accentEnd: string;
  textColor: string;
  clubs: ClubDefinition[];
  featuredMatchCount: number;
  getStageLabel: (appearanceNumber: number) => string;
};

const clubBadgeImageUrls = {
  cruzeiro: "https://escudosfc.com.br/images/cruzeiro.png",
  atletico: "https://escudosfc.com.br/images/atletico.png",
  bahia: "https://escudosfc.com.br/images/bahia.png",
  botafogo: "https://escudosfc.com.br/images/botafogo.gif",
  fluminense: "https://escudosfc.com.br/images/fluminense.png",
  palmeiras: "https://escudosfc.com.br/images/palmeiras.png",
  internacional: "https://escudosfc.com.br/images/interrs.png",
  santos: "https://escudosfc.com.br/images/santos.png",
  saoPaulo: "https://escudosfc.com.br/images/saopaulo.png",
} as const;

const leagueClubs: ClubDefinition[] = [
  createClub("Palmeiras", "PAL", "#14532d", "#dcfce7", clubBadgeImageUrls.palmeiras),
  createClub("Flamengo", "FLA", "#991b1b", "#fee2e2"),
  createClub("Corinthians", "COR", "#111827", "#f3f4f6"),
  createClub("Sao Paulo", "SAO", "#7f1d1d", "#fee2e2", clubBadgeImageUrls.saoPaulo),
  createClub("Santos", "SAN", "#1f2937", "#f3f4f6", clubBadgeImageUrls.santos),
  createClub("Internacional", "INT", "#b91c1c", "#fee2e2", clubBadgeImageUrls.internacional),
  createClub("Gremio", "GRE", "#1d4ed8", "#dbeafe"),
  createClub("Bahia", "BAH", "#1d4ed8", "#fee2e2", clubBadgeImageUrls.bahia),
  createClub("Cruzeiro", "CRU", "#1e3a8a", "#dbeafe", clubBadgeImageUrls.cruzeiro),
  createClub("Botafogo", "BOT", "#111827", "#f9fafb", clubBadgeImageUrls.botafogo),
  createClub("Fluminense", "FLU", "#7c2d12", "#dcfce7", clubBadgeImageUrls.fluminense),
  createClub("Vasco", "VAS", "#7f1d1d", "#f8fafc"),
  createClub("Fortaleza", "FOR", "#1d4ed8", "#fee2e2"),
  createClub("Sport", "SPT", "#991b1b", "#fef3c7"),
  createClub("Goias", "GOI", "#166534", "#dcfce7"),
  createClub("Coritiba", "CFC", "#14532d", "#ecfccb"),
  createClub("Ceara", "CEA", "#111827", "#e5e7eb"),
  createClub("Athletico", "CAP", "#991b1b", "#fecaca"),
  createClub("Atletico MG", "CAM", "#1f2937", "#e5e7eb", clubBadgeImageUrls.atletico),
  createClub("Juventude", "JUV", "#166534", "#ecfccb"),
];

const cupClubs: ClubDefinition[] = [
  ...leagueClubs,
  createClub("Remo", "REM", "#1e3a8a", "#dbeafe"),
  createClub("Vila Nova", "VIL", "#dc2626", "#fee2e2"),
  createClub("Portuguesa", "LUS", "#dc2626", "#fef3c7"),
  createClub("Campinense", "CAM", "#ef4444", "#fff1f2"),
  createClub("Goiania", "GOE", "#374151", "#f3f4f6"),
  createClub("Ponte Preta", "PON", "#111827", "#f3f4f6"),
  createClub("Criciuma", "CRI", "#f59e0b", "#111827"),
  createClub("Cuiaba", "CUI", "#eab308", "#14532d"),
  createClub("Operario", "OPE", "#1f2937", "#f3f4f6"),
  createClub("America RN", "AME", "#dc2626", "#fef2f2"),
  createClub("Nautico", "NAU", "#dc2626", "#ffffff"),
  createClub("Paysandu", "PAY", "#1e3a8a", "#e0f2fe"),
  createClub("CSA", "CSA", "#2563eb", "#eff6ff"),
  createClub("Figueirense", "FIG", "#111827", "#e5e7eb"),
  createClub("Sampaio", "SAM", "#166534", "#fef3c7"),
  createClub("ABC", "ABC", "#111827", "#f3f4f6"),
];

const copaBrazucagolStages = [
  "1a fase",
  "2a fase",
  "16 avos",
  "oitavas",
  "quartas",
  "semi",
  "final",
] as const;

const copaDoBrazilStages = [
  "1a fase",
  "2a fase",
  "3a fase",
  "oitavas ida",
  "oitavas volta",
  "quartas ida",
  "quartas volta",
  "semi ida",
  "semi volta",
  "final",
] as const;

const competitionDefinitions: CompetitionDefinition[] = [
  {
    id: "liga-brazucagol",
    name: "Liga Brazucagol",
    description: "20 clubes · 38 rodadas",
    accentStart: "#d8ff68",
    accentEnd: "#8fd61a",
    textColor: "#1e3a03",
    clubs: leagueClubs,
    featuredMatchCount: 5,
    getStageLabel: (appearanceNumber) => `Rodada ${((appearanceNumber - 1) % 38) + 1}`,
  },
  {
    id: "copa-brazucagol",
    name: "Copa Brazucagol",
    description: "64 clubes · mata mata",
    accentStart: "#6ee7f9",
    accentEnd: "#2563eb",
    textColor: "#eff6ff",
    clubs: cupClubs,
    featuredMatchCount: 2,
    getStageLabel: (appearanceNumber) =>
      capitalizeLabel(copaBrazucagolStages[(appearanceNumber - 1) % copaBrazucagolStages.length]),
  },
  {
    id: "copa-do-brazil",
    name: "Copa do Brazil",
    description: "64 clubes · cruzamento nacional",
    accentStart: "#ffd36b",
    accentEnd: "#f97316",
    textColor: "#522100",
    clubs: cupClubs,
    featuredMatchCount: 3,
    getStageLabel: (appearanceNumber) =>
      capitalizeLabel(copaDoBrazilStages[(appearanceNumber - 1) % copaDoBrazilStages.length]),
  },
];

export function getCurrentRoundStart(referenceDate: Date) {
  const roundStart = new Date(referenceDate);
  roundStart.setHours(19, 0, 0, 0);

  if (referenceDate.getTime() < roundStart.getTime()) {
    roundStart.setDate(roundStart.getDate() - 1);
  }

  return roundStart;
}

export function buildRoundsTimeline(
  currentRoundStart: Date,
  referenceDate: Date,
  pastRoundCount = 180,
  futureRoundCount = 240
) {
  const rounds: RoundSchedule[] = [];

  for (let roundOffset = -pastRoundCount; roundOffset <= futureRoundCount; roundOffset += 1) {
    const roundStart = addDays(currentRoundStart, roundOffset);
    const roundEnd = addDays(roundStart, 1);
    const globalRoundNumber = pastRoundCount + roundOffset + 1;
    const activeCompetitions = getCompetitionIdsForRound(globalRoundNumber)
      .map((competitionId) =>
        competitionDefinitions.find((competitionDefinition) => competitionDefinition.id === competitionId)
      )
      .filter((competitionDefinition): competitionDefinition is CompetitionDefinition => Boolean(competitionDefinition))
      .map((competitionDefinition) => ({
        id: competitionDefinition.id,
        name: competitionDefinition.name,
        description: competitionDefinition.description,
        stageLabel: competitionDefinition.getStageLabel(
          getCompetitionAppearanceNumber(globalRoundNumber, competitionDefinition.id)
        ),
        accentStart: competitionDefinition.accentStart,
        accentEnd: competitionDefinition.accentEnd,
        textColor: competitionDefinition.textColor,
      }));

    const matches = createRoundMatches({
      activeCompetitions,
      globalRoundNumber,
      referenceDate,
      roundStart,
      roundEnd,
    });

    rounds.push({
      roundKey: roundStart.toISOString(),
      globalRoundNumber,
      roundStart,
      roundEnd,
      activeCompetitions,
      matches,
      isCurrentRound:
        referenceDate.getTime() >= roundStart.getTime() && referenceDate.getTime() < roundEnd.getTime(),
    });
  }

  return rounds;
}

function createRoundMatches({
  activeCompetitions,
  globalRoundNumber,
  referenceDate,
  roundStart,
  roundEnd,
}: {
  activeCompetitions: CompetitionSchedule[];
  globalRoundNumber: number;
  referenceDate: Date;
  roundStart: Date;
  roundEnd: Date;
}) {
  const roundMatches: RoundMatch[] = [];

  for (const competition of activeCompetitions) {
    const competitionDefinition = competitionDefinitions.find(
      (competitionDefinitionItem) => competitionDefinitionItem.id === competition.id
    );

    if (!competitionDefinition) {
      continue;
    }

    const usedClubIndexes = new Set<number>();

    for (
      let featuredMatchNumber = 0;
      featuredMatchNumber < competitionDefinition.featuredMatchCount;
      featuredMatchNumber += 1
    ) {
      const homeClubIndex = getUniqueClubIndex({
        clubs: competitionDefinition.clubs,
        preferredIndex:
          globalRoundNumber * (featuredMatchNumber + 2) +
          featuredMatchNumber * 5 +
          competitionDefinition.id.length,
        usedClubIndexes,
      });
      const awayClubIndex = getUniqueClubIndex({
        clubs: competitionDefinition.clubs,
        preferredIndex:
          globalRoundNumber * (featuredMatchNumber + 5) +
          featuredMatchNumber * 7 +
          competitionDefinition.name.length,
        usedClubIndexes,
      });
      const kickoffAt = roundStart;
      const matchStatus = getMatchStatus(referenceDate, roundStart, roundEnd);
      const homeScore =
        matchStatus === "scheduled"
          ? 0
          : (globalRoundNumber + featuredMatchNumber * 3 + competitionDefinition.id.length) % 6 + 99897;
      const awayScore =
        matchStatus === "scheduled"
          ? 0
          : (globalRoundNumber * 2 + featuredMatchNumber * 4 + competitionDefinition.name.length) % 5 + 2390;

      roundMatches.push({
        id: `${competition.id}-${globalRoundNumber}-${featuredMatchNumber}`,
        competition,
        kickoffAt,
        homeClub: competitionDefinition.clubs[homeClubIndex],
        awayClub: competitionDefinition.clubs[awayClubIndex],
        homeScore,
        awayScore,
        status: matchStatus,
        minuteLabel: getMinuteLabel(referenceDate, roundStart, roundEnd, matchStatus),
      });
    }
  }

  return roundMatches;
}

function getUniqueClubIndex({
  clubs,
  preferredIndex,
  usedClubIndexes,
}: {
  clubs: ClubDefinition[];
  preferredIndex: number;
  usedClubIndexes: Set<number>;
}) {
  let clubIndex = preferredIndex % clubs.length;

  while (usedClubIndexes.has(clubIndex)) {
    clubIndex = (clubIndex + 1) % clubs.length;
  }

  usedClubIndexes.add(clubIndex);

  return clubIndex;
}

function getMatchStatus(referenceDate: Date, roundStart: Date, roundEnd: Date): MatchStatus {
  const kickoffTimestamp = roundStart.getTime();
  const finishTimestamp = roundEnd.getTime();
  const referenceTimestamp = referenceDate.getTime();

  if (referenceTimestamp < kickoffTimestamp) {
    return "scheduled";
  }

  if (referenceTimestamp <= finishTimestamp) {
    return "live";
  }

  return "finished";
}

function getMinuteLabel(referenceDate: Date, roundStart: Date, roundEnd: Date, matchStatus: MatchStatus) {
  if (matchStatus === "scheduled") {
    return `Abre ${formatRoundWindow(roundStart, roundEnd)}`;
  }

  if (matchStatus === "finished") {
    return `Encerrada ${formatRoundWindow(roundStart, roundEnd)}`;
  }

  const elapsedHours = Math.floor((referenceDate.getTime() - roundStart.getTime()) / (1000 * 60 * 60));

  return `Janela em andamento · ${Math.max(0, elapsedHours)}h / 24h`;
}

function addDays(referenceDate: Date, dayCount: number) {
  const nextDate = new Date(referenceDate);
  nextDate.setDate(nextDate.getDate() + dayCount);
  return nextDate;
}

function formatRoundWindow(roundStart: Date, roundEnd: Date) {
  return `${formatHour(roundStart)} -> ${formatHour(roundEnd)}`;
}

function formatHour(referenceDate: Date) {
  return referenceDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function capitalizeLabel(label: string) {
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function getCompetitionIdsForRound(roundNumber: number): CompetitionId[] {
  const rotationByRound = [
    "liga-brazucagol",
    "liga-brazucagol",
    "copa-do-brazil",
    "liga-brazucagol",
    "liga-brazucagol",
    "copa-brazucagol",
    "liga-brazucagol",
    "liga-brazucagol",
  ] as const;

  return [rotationByRound[(roundNumber - 1) % rotationByRound.length]];
}

function getCompetitionAppearanceNumber(roundNumber: number, competitionId: CompetitionId) {
  let appearanceCount = 0;

  for (let currentRoundNumber = 1; currentRoundNumber <= roundNumber; currentRoundNumber += 1) {
    if (getCompetitionIdsForRound(currentRoundNumber).includes(competitionId)) {
      appearanceCount += 1;
    }
  }

  return appearanceCount;
}

function createClub(
  name: string,
  shortName: string,
  primaryColor: string,
  secondaryColor: string,
  imageUrl?: string
): ClubDefinition {
  return {
    name,
    shortName,
    primaryColor,
    secondaryColor,
    imageUrl,
  };
}

export function startOfMonth(referenceDate: Date) {
  return new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
}

export function addMonths(referenceDate: Date, monthCount: number) {
  return new Date(referenceDate.getFullYear(), referenceDate.getMonth() + monthCount, 1);
}

export function buildMonthGrid(referenceMonth: Date) {
  const monthStart = startOfMonth(referenceMonth);
  const firstGridDate = addDays(monthStart, -monthStart.getDay());
  const calendarDays: Date[] = [];

  for (let dayOffset = 0; dayOffset < 42; dayOffset += 1) {
    calendarDays.push(addDays(firstGridDate, dayOffset));
  }

  return calendarDays;
}

export function getRoundKeyFromDate(referenceDate: Date) {
  const roundStart = new Date(referenceDate);
  roundStart.setHours(19, 0, 0, 0);
  return roundStart.toISOString();
}

export function isSameMonth(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth()
  );
}

export function isSameDay(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

export const weekdayLabels = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"] as const;
export const roundStartsAtLabel = "19:00";
export const roundEndsAtLabel = "19:00";
export const roundDurationDescription = `Cada rodada abre às 19:00 e fecha às 19:00 do dia seguinte, no horário de Brasília`;
