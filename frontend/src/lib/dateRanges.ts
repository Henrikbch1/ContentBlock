/** A calendar day; `year` is only set when the source text named a year. */
export type DayMonth = Readonly<{
  day: number;
  month: number;
  year?: number;
}>;

/** Inclusive range. Without years it repeats annually and may wrap the new year. */
export type DayMonthRange = Readonly<{ start: DayMonth; end: DayMonth }>;

const DATE = String.raw`(\d{1,2})\.\s?(\d{1,2})\.(?:\s?(\d{4}))?`;
const SEPARATOR = String.raw`\s*(?:[-\u2010-\u2015\u2212]|bis)\s*`;
// The leading group replaces a look-behind (unsupported in older Safari).
const RANGE_PATTERN = `(^|[^\\d.])${DATE}${SEPARATOR}${DATE}(?!\\d)`;

const isLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const daysInMonth = (month: number, year: number): number =>
  month === 2
    ? isLeapYear(year)
      ? 29
      : 28
    : [4, 6, 9, 11].includes(month)
      ? 30
      : 31;

// Year-less dates may name 29 February, so they are checked against a leap year.
const isValidDate = (day: number, month: number, year?: number): boolean =>
  month >= 1 &&
  month <= 12 &&
  day >= 1 &&
  day <= daysInMonth(month, year ?? 2000);

const monthDayKey = (day: number, month: number): number => month * 100 + day;

const dateKey = (date: DayMonth): number =>
  (date.year ?? 0) * 10000 + monthDayKey(date.day, date.month);

const toNumber = (value: string | undefined): number | undefined =>
  value === undefined ? undefined : Number(value);

/** A year on only one side applies to both; the other side wraps to the adjacent year. */
const resolveYears = (
  start: DayMonth,
  end: DayMonth,
): readonly [DayMonth, DayMonth] => {
  if (start.year === undefined && end.year !== undefined) {
    const wraps =
      monthDayKey(start.day, start.month) > monthDayKey(end.day, end.month);
    return [{ ...start, year: end.year - (wraps ? 1 : 0) }, end];
  }
  if (start.year !== undefined && end.year === undefined) {
    const wraps =
      monthDayKey(end.day, end.month) < monthDayKey(start.day, start.month);
    return [start, { ...end, year: start.year + (wraps ? 1 : 0) }];
  }
  return [start, end];
};

/** Finds all valid `day.month.` ranges (separators `-`, `–`, `—`, `bis`) in a text. */
export const parseDayMonthRanges = (text: string): DayMonthRange[] => {
  const ranges: DayMonthRange[] = [];
  for (const match of text.matchAll(new RegExp(RANGE_PATTERN, "gi"))) {
    const [, , startDay, startMonth, startYear, endDay, endMonth, endYear] =
      match;
    const first: DayMonth = {
      day: Number(startDay),
      month: Number(startMonth),
      year: toNumber(startYear),
    };
    const second: DayMonth = {
      day: Number(endDay),
      month: Number(endMonth),
      year: toNumber(endYear),
    };
    if (
      !isValidDate(first.day, first.month, first.year) ||
      !isValidDate(second.day, second.month, second.year)
    ) {
      continue;
    }
    const [start, end] = resolveYears(first, second);
    if (start.year !== undefined && dateKey(start) > dateKey(end)) continue;
    ranges.push({ start, end });
  }
  return ranges;
};

const isDateInRange = (range: DayMonthRange, today: Date): boolean => {
  const { start, end } = range;
  const month = today.getMonth() + 1;
  const day = today.getDate();
  if (start.year !== undefined) {
    const key = dateKey({ day, month, year: today.getFullYear() });
    return key >= dateKey(start) && key <= dateKey(end);
  }
  const key = monthDayKey(day, month);
  const from = monthDayKey(start.day, start.month);
  const to = monthDayKey(end.day, end.month);
  return from <= to ? key >= from && key <= to : key >= from || key <= to;
};

/** True when `today` (local time) lies within any day-month range of the text. */
export const isRangeTextActive = (
  text: string,
  today: Date = new Date(),
): boolean =>
  parseDayMonthRanges(text).some((range) => isDateInRange(range, today));
