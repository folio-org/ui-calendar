import type { Dayjs } from 'dayjs';
import { IntlShape } from 'react-intl';
import dayjs from './dayjs';

/** Compare two dayjs objects */
export function dayjsCompare(a: Dayjs, b: Dayjs): number {
  if (a.isBefore(b)) return -1;
  if (a.isAfter(b)) return 1;
  return 0;
}

/** Compare two dayjs objects */
export function getDateRange(start: Date, end: Date): Date[] {
  const current = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const endMidnight = new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate()
  );
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

/**
 * Determine how close a given date is to a reference date.  Should only be
 * used when the date is >= the reference; will return `"sameDay"`, `"nextDay"`,
 * `"nextWeek"`, or `"sameElse"` (for more than a week away).
 */
export function getRelativeDateTimeProximity(
  date: Dayjs | string,
  referenceDate: Dayjs
): 'sameDay' | 'nextDay' | 'nextWeek' | 'sameElse' {
  return dayjs(dayjs(date).utc(true).toISOString()).calendar(referenceDate, {
    sameDay: '[sameDay]', // "[at] LT",
    nextDay: '[nextDay]', // "[tomorrow at] LT",
    nextWeek: '[nextWeek]', // "dddd [at] LT",
    sameElse: '[sameElse]' // "L",
  }) as 'sameDay' | 'nextDay' | 'nextWeek' | 'sameElse';
}

/** Localize time with `react-intl` */
export function getLocalizedTime(
  intl: IntlShape,
  time: string | Dayjs
): string {
  const obj = dayjs(time, 'HH:mm');
  if (
    (obj.tz(intl.timeZone).hour() === 23 &&
      obj.tz(intl.timeZone).minute() === 59) ||
    (obj.tz(intl.timeZone).hour() === 0 && obj.tz(intl.timeZone).minute() === 0)
  ) {
    return intl.formatMessage({ id: 'ui-calendar.midnight' });
  }
  return intl.formatTime(obj.utc(true).toDate());
}

/** Localize date with `react-intl` */
export function getLocalizedDate(
  intl: IntlShape,
  date: string | Dayjs
): string {
  return intl.formatDate(dayjs.tz(date, intl.timeZone).toDate());
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

export function dateToYYYYMMDD(d: Date): string {
  return [
    d.getFullYear(),
    ('0' + (d.getMonth() + 1)).slice(-2),
    ('0' + d.getDate()).slice(-2)
  ].join('-');
}
