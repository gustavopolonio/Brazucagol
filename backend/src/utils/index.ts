export function isFiniteNumber(value: number) {
  return Number.isFinite(value);
}

export const ROUND_START_HOUR_LOCAL = 18;
export const ROUND_TIME_ZONE = "America/Sao_Paulo";

const DATE_TIME_PARTS_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: ROUND_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function getZonedParts(date: Date): ZonedParts {
  const parts = DATE_TIME_PARTS_FORMATTER.formatToParts(date);

  let year = 0;
  let month = 0;
  let day = 0;
  let hour = 0;
  let minute = 0;
  let second = 0;

  for (const part of parts) {
    if (part.type === "year") year = Number(part.value);
    if (part.type === "month") month = Number(part.value);
    if (part.type === "day") day = Number(part.value);
    if (part.type === "hour") hour = Number(part.value);
    if (part.type === "minute") minute = Number(part.value);
    if (part.type === "second") second = Number(part.value);
  }

  return { year, month, day, hour, minute, second };
}

function getTimeZoneOffsetMs(date: Date) {
  const zoned = getZonedParts(date);
  const asUtc = Date.UTC(
    zoned.year,
    zoned.month - 1,
    zoned.day,
    zoned.hour,
    zoned.minute,
    zoned.second
  );

  return asUtc - date.getTime();
}

function zonedTimeToUtcDate(parts: ZonedParts) {
  const desiredAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );

  let utcMs = desiredAsUtc;

  for (let i = 0; i < 3; i += 1) {
    const offsetMs = getTimeZoneOffsetMs(new Date(utcMs));
    const nextUtcMs = desiredAsUtc - offsetMs;
    if (nextUtcMs === utcMs) break;
    utcMs = nextUtcMs;
  }

  return new Date(utcMs);
}

// Returns -> YYYY-MM-DD
export function toZonedDayKey(date: Date) {
  const { year, month, day } = getZonedParts(date);

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function toRoundStartDate(date: Date) {
  const { year, month, day } = getZonedParts(date);

  return zonedTimeToUtcDate({
    year,
    month,
    day,
    hour: ROUND_START_HOUR_LOCAL,
    minute: 0,
    second: 0,
  });
}

interface AddDaysKeepingRoundStartProps {
  date: Date;
  daysToAdd: number;
}

export function addDaysKeepingRoundStart({ date, daysToAdd }: AddDaysKeepingRoundStartProps) {
  const { year, month, day } = getZonedParts(date);
  const utcDay = new Date(Date.UTC(year, month - 1, day));
  utcDay.setUTCDate(utcDay.getUTCDate() + daysToAdd);

  return zonedTimeToUtcDate({
    year: utcDay.getUTCFullYear(),
    month: utcDay.getUTCMonth() + 1,
    day: utcDay.getUTCDate(),
    hour: ROUND_START_HOUR_LOCAL,
    minute: 0,
    second: 0,
  });
}

export function nearestPowerOfTwoCeil(number: number) {
  return Math.pow(2, Math.ceil(Math.log2(number)));
}

export function isPowerOfTwo(number: number) {
  if (number <= 0) return false;

  while (number % 2 === 0) {
    number = number / 2;
  }

  return number === 1;
}

export function ceilHalf(number: number) {
  return Math.ceil(number / 2);
}

export function sortByDateAsc<T extends { date: Date }>(items: T[]) {
  return items.sort((a, b) => a.date.getTime() - b.date.getTime());
}
