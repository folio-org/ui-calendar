import type { Dayjs } from 'dayjs';
import { IntlShape } from 'react-intl';

export function dateCompare(
  a: Date | undefined | null,
  b: Date | undefined | null
): number {
  // return undefined first, if applicable
  if ((a === undefined || a === null) && (b === undefined || b === null)) return 0;
  if (a === undefined || a === null) return -1;
  if (b === undefined || b === null) return 1;
  return Math.sign(a.getTime() - b.getTime());
}

export function toStartOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function getDateRange(start: Date, end: Date): Date[] {
  const current = toStartOfDay(start);
  const endMidnight = toStartOfDay(end);
  const offset = start.getTime() - current.getTime();
  const result: Date[] = [];

  do {
    result.push(new Date(current.getTime() + offset));
    current.setDate(current.getDate() + 1);
  } while (current <= endMidnight);

  return result;
}

/** Determine if two date ranges overlap each other */
export function overlaps(
  start1: Dayjs,
  end1: Dayjs,
  start2: Dayjs,
  end2: Dayjs
): boolean {
  // False if: 2 starts after 1 OR 2 ends before 1 starts
  return !(start2.isAfter(end1) || end2.isBefore(start1));
}

/** Determine if two date ranges overlap each other */
export function overlapsDates(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  // Does not overlap if one ends before the other starts
  return !(end1 < start2 || end2 < start1);
}

/**
 * Determine how close a given date is to a reference date.  Should only be
 * used when the date is >= the reference; will return `"sameDay"`, `"nextDay"`,
 * `"nextWeek"`, or `"sameElse"` (for more than a week away).
 */
export function getRelativeDateProximity(
  test: Date,
  referenceDate: Date
): 'sameDay' | 'nextDay' | 'nextWeek' | 'sameElse' {
  // ensure every time is midnight
  const testDate = toStartOfDay(test);
  // same day
  const testSameDayReference = toStartOfDay(referenceDate);
  if (testDate <= testSameDayReference) return 'sameDay';

  // check day after (for tomorrow)
  const testNextDayReference = new Date(
    toStartOfDay(referenceDate).setDate(testSameDayReference.getDate() + 1)
  );
  if (testDate <= testNextDayReference) return 'nextDay';

  // check next six days
  // does not check 7 as, for example, saying "closing Monday at 5:00"
  // is ambiguous if it currently is Monday.
  const testNextWeekReference = new Date(
    toStartOfDay(referenceDate).setDate(testSameDayReference.getDate() + 6)
  );
  if (testDate <= testNextWeekReference) return 'nextWeek';

  return 'sameElse';
}

/** Ensure a <= b, based on months */
export function isSameUTCMonthOrBefore(a: Date, b: Date): boolean {
  return (
    (a.getUTCFullYear() === b.getUTCFullYear() &&
      a.getUTCMonth() <= b.getUTCMonth()) ||
    a.getUTCFullYear() < b.getUTCFullYear()
  );
}

/** Ensure a <= b, based on months */
export function isSameMonthOrBefore(a: Date, b: Date): boolean {
  return (
    (a.getFullYear() === b.getFullYear() && a.getMonth() <= b.getMonth()) ||
    a.getFullYear() < b.getFullYear()
  );
}

/** Ensure a == b, based on months */
export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** Ensure a == b, based on months */
export function isSameUTCMonth(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth()
  );
}

export function dateUTCToYYYYMMDD(d: Date): string {
  return [
    d.getUTCFullYear(),
    ('0' + (d.getUTCMonth() + 1)).slice(-2),
    ('0' + d.getUTCDate()).slice(-2)
  ].join('-');
}

export function dateToYYYYMMDD(d: Date): string {
  return [
    d.getFullYear(),
    ('0' + (d.getMonth() + 1)).slice(-2),
    ('0' + d.getDate()).slice(-2)
  ].join('-');
}

export function dateFromYYYYMMDD(d: string): Date {
  const parts = d.split('-').map((n) => parseInt(n, 10));
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

export function dateUTCFromYYYYMMDD(d: string): Date {
  const parts = d.split('-').map((n) => parseInt(n, 10));
  return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
}

export function dateFromYYYYMMDDAndHHMM(d: string, t: string): Date {
  const dateParts = d.split('-').map((n) => parseInt(n, 10));
  const timeParts = t.split(':').map((n) => parseInt(n, 10));
  return new Date(
    dateParts[0],
    dateParts[1] - 1,
    dateParts[2],
    timeParts[0],
    timeParts[1]
  );
}

export function dateFromDateAndHHMM(d: Date, t: string): Date {
  const timeParts = t.split(':').map((n) => parseInt(n, 10));
  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    timeParts[0],
    timeParts[1]
  );
}

export function dateFromHHMM(t: string): Date {
  const timeParts = t.split(':').map((n) => parseInt(n, 10));
  return new Date(0, 0, 0, timeParts[0], timeParts[1]);
}

export function dateUTCFromHHMM(t: string): Date {
  const timeParts = t.split(':').map((n) => parseInt(n, 10));
  return new Date(Date.UTC(0, 0, 0, timeParts[0], timeParts[1]));
}

export function dateToTimeOnly(d: Date): Date {
  return new Date(0, 0, 0, d.getHours(), d.getMinutes());
}

export function minDate(dates: Date[]): Date | null {
  if (dates.length === 0) return null;
  return new Date(Math.min(...dates.map((d) => d.getTime())));
}

export function maxDate(dates: Date[]): Date | null {
  if (dates.length === 0) return null;
  return new Date(Math.max(...dates.map((d) => d.getTime())));
}

export function isBetweenDatesByDay(
  test: Date,
  left: Date,
  right: Date
): boolean {
  const testStart = toStartOfDay(test);
  const leftStart = toStartOfDay(left);
  const rightStart = toStartOfDay(right);

  return leftStart <= testStart && testStart <= rightStart;
}

/** Localize time with `react-intl` */
export function getLocalizedTime(intl: IntlShape, time: string): string {
  // forcibly use UTC for local time-ness
  const date = dateUTCFromHHMM(time);

  if (
    (date.getUTCHours() === 23 && date.getUTCMinutes() === 59) ||
    (date.getUTCHours() === 0 && date.getUTCMinutes() === 0)
  ) {
    return intl.formatMessage({ id: 'ui-calendar.midnight' });
  }

  return intl.formatTime(date, { timeZone: 'UTC' });
}

/** Localize date with `react-intl` */
export function getLocalizedDate(intl: IntlShape, date: string): string {
  return intl.formatDate(dateUTCFromYYYYMMDD(date), { timeZone: 'UTC' });
}
