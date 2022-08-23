import staticFirstWeekDay from '@folio/stripes-components/lib/Datepicker/staticFirstWeekDay';
import type { Dayjs } from 'dayjs';
import memoizee from 'memoizee';
import { useMemo } from 'react';
import { IntlShape } from 'react-intl';
import { CalendarOpening, Weekday } from '../types/types';
import { getLocalizedTime } from './DateUtils';
import dayjs from './dayjs';

export type RelativeWeekdayStatus =
  | {
      proximity: 'sameDay' | 'nextDay';
      weekday: undefined;
      date: undefined;
      time: string;
    }
  | {
      proximity: 'otherWeekday';
      weekday: Weekday;
      date: undefined;
      time: string;
    };

/**
 * Used for algorithmically relating weekdays to each other.  This MUST not be
 * used for any type of user display, only for relating weekdays to each other.
 * The only guarantees are that weekdays (when wrapped around) will be in the
 * typical order, such as Friday -> Saturday, and that .day() on dayjs will
 * correspond here as expected.
 * Additionally, the values here will correspond to {@link WEEKDAY_INDEX}
 */
export const WEEKDAYS: Record<Weekday, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};
/**
 * Used for algorithmically relating weekdays to each other.  This MUST not be
 * used for any type of user display, only for relating weekdays to each other.
 * The only guarantees are that weekdays (when wrapped around) will be in the
 * typical order, such as Friday -> Saturday, and that .day() on dayjs will
 * correspond here as expected.
 * Additionally, the values here will correspond to {@link WEEKDAY_INDEX}
 */
export const WEEKDAY_INDEX: Weekday[] = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

/** Information about a weekday in the current locale */
export interface LocaleWeekdayInfo {
  weekday: Weekday;
  short: string;
  long: string;
}

export const getFirstDayOfWeek: (locale: string) => number = memoizee(
  (locale: string) => {
    const region = locale.split('-')[1]?.toUpperCase() ?? 'US';
    const weekdayLookup = {
      sun: 0,
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6,
    };
    for (const [weekday, regions] of Object.entries(staticFirstWeekDay)) {
      if (regions.includes(region)) {
        return weekdayLookup[weekday as keyof typeof staticFirstWeekDay];
      }
    }
    return 0; // safe default
  }
);

/** Get information for the days of the week, for the current locale */
export const getLocaleWeekdays: (intl: IntlShape) => LocaleWeekdayInfo[] =
  memoizee((intl: IntlShape) => {
    const firstDay = getFirstDayOfWeek(intl.locale);

    const weekdays: LocaleWeekdayInfo[] = [];
    for (let i = 0; i < 7; i++) {
      const day = dayjs()
        .startOf('day')
        .tz(intl.timeZone, true)
        .day((firstDay + i) % 7);
      weekdays.push({
        weekday: WEEKDAY_INDEX[day.day()],
        short: intl.formatDate(day.toDate(), { weekday: 'short' }),
        long: intl.formatDate(day.toDate(), { weekday: 'long' }),
      });
    }
    return weekdays;
  });

export function useLocaleWeekdays(intl: IntlShape): LocaleWeekdayInfo[] {
  return useMemo(() => getLocaleWeekdays(intl), [intl]);
}

/** Get a range of weekdays between two, inclusive */
export function getWeekdayRange(start: Weekday, end: Weekday): Weekday[] {
  let startIndex = WEEKDAYS[start];
  const endIndex = WEEKDAYS[end];

  const days = [WEEKDAY_INDEX[startIndex]];
  while (startIndex !== endIndex) {
    startIndex = (startIndex + 1) % 7;
    days.push(WEEKDAY_INDEX[startIndex]);
  }

  return days;
}

/**
 * Get all weekdays covered by a calendar's opening.  Openings that wrap around onto the
 * same day (e.g. M 12:00 - M 11:59) will include that weekday on both sides
 * (e.g. M T W R F S N M)
 */
export function getWeekdaySpan(opening: CalendarOpening): Weekday[] {
  if (opening.startDay === opening.endDay) {
    // wraps around (starts after it sends, e.g. M 12:00 -> M 11:59)
    if (opening.startTime > opening.endTime) {
      return [
        opening.startDay,
        ...WEEKDAY_INDEX.slice(WEEKDAYS[opening.startDay] + 1),
        ...WEEKDAY_INDEX.slice(0, WEEKDAYS[opening.startDay] + 1),
      ];
    }
    return [opening.startDay];
  }
  return getWeekdayRange(opening.startDay, opening.endDay);
}

/**
 * Determine how close a weekday is relative to a given reference date.
 * For weekdays more than a day away, the weekday will be returned in the payload
 * for additional formatting.  It is not included for sameDay/nextDay
 */
export function getRelativeWeekdayStatus(
  intl: IntlShape,
  weekday: Weekday,
  time: string,
  referenceDate: Dayjs
): RelativeWeekdayStatus {
  if (referenceDate.day() === WEEKDAYS[weekday]) {
    return {
      proximity: 'sameDay',
      weekday: undefined,
      date: undefined,
      time: getLocalizedTime(intl, time),
    };
  }
  if ((referenceDate.day() + 1) % 7 === WEEKDAYS[weekday]) {
    return {
      proximity: 'nextDay',
      weekday: undefined,
      date: undefined,
      time: getLocalizedTime(intl, time),
    };
  }
  return {
    proximity: 'otherWeekday',
    weekday,
    date: undefined,
    time: getLocalizedTime(intl, time),
  };
}

/** Determine if a day is between two weekdays, inclusive */
export function weekdayIsBetween(
  testWeekday: Dayjs,
  start: Weekday,
  end: Weekday
): boolean {
  let startIndex = WEEKDAYS[start];
  let endIndex = WEEKDAYS[end];

  // handles wraparounds, eg FRI (5) -> MON (1) converts to FRI (5) -> MON (8)
  // ensures startIndex <= endIndex
  if (startIndex > endIndex) {
    endIndex += 7;
  }
  // potentially shifts the bounds by a week to handle examples like above, if SUN (0) is queried
  if (startIndex > testWeekday.day()) {
    startIndex -= 7;
    endIndex -= 7;
  }

  return startIndex <= testWeekday.day() && testWeekday.day() <= endIndex;
}
