import type { Dayjs } from 'dayjs';
import memoizee from 'memoizee';
import {
  Calendar,
  CalendarException,
  CalendarExceptionOpening,
  CalendarOpening
} from '../types/types';
import { isSameMonthOrBefore } from './DateUtils';
import dayjs from './dayjs';
import { getFirstDayOfWeek, weekdayIsBetween, WEEKDAYS } from './WeekdayUtils';

/** Get all openings and exceptions which apply to this date */
export function getDateMatches(
  testDate: Dayjs,
  calendar: Calendar
): {
  openings: CalendarOpening[];
  exceptions: CalendarException[];
} {
  return {
    openings: calendar.normalHours.filter((opening) => {
      return weekdayIsBetween(testDate, opening.startDay, opening.endDay);
    }),
    exceptions: calendar.exceptions.filter((exception) => {
      return testDate.isBetween(
        dayjs(exception.startDate),
        dayjs(exception.endDate),
        'day',
        '[]'
      );
    })
  };
}

/** Get the current exceptional opening, if any */
export function getCurrentExceptionalOpening(
  testDateTime: Dayjs,
  exception: CalendarException
): CalendarExceptionOpening | null {
  for (const opening of exception.openings) {
    if (
      testDateTime.isBetween(
        `${opening.startDate} ${opening.startTime}`,
        `${opening.endDate} ${opening.endTime}`,
        'minute',
        '[]'
      )
    ) {
      return opening;
    }
  }
  return null;
}

/** Get the next exceptional opening on the same date, if any */
export function getNextExceptionalOpening(
  testDateTime: Dayjs,
  exception: CalendarException
): CalendarExceptionOpening | null {
  let min: CalendarExceptionOpening | null = null;
  let minDate: Dayjs | null = null;
  for (const opening of exception.openings) {
    if (
      testDateTime.isBefore(
        `${opening.startDate} ${opening.startTime}`,
        'minute'
      ) &&
      (minDate === null ||
        minDate.isAfter(`${opening.startDate} ${opening.startTime}`))
    ) {
      min = opening;
      minDate = dayjs(`${opening.startDate} ${opening.startTime}`);
    }
  }
  return min;
}

function isInSingleDayNormalOpening(
  weekday: number,
  testWeekday: number,
  testDateTime: Dayjs,
  startTimeRel: Dayjs,
  endTimeRel: Dayjs
): boolean {
  // really only spans one day
  if (startTimeRel.isSameOrBefore(endTimeRel)) {
    return (
      testWeekday === weekday &&
      testDateTime.isSameOrAfter(startTimeRel) &&
      testDateTime.isSameOrBefore(endTimeRel)
    );
  }
  // wraps around the week
  return (
    weekday !== testWeekday ||
    testDateTime.isSameOrBefore(endTimeRel) ||
    testDateTime.isSameOrAfter(startTimeRel)
  );
}

function isMiddleDayInRange(
  startWeekday: number,
  endWeekday: number,
  testWeekday: number
): boolean {
  const endWeekdayAdjusted =
    startWeekday > endWeekday ? endWeekday + 7 : endWeekday;
  const currentWeekdayAdjusted =
    startWeekday > testWeekday ? testWeekday + 7 : testWeekday;

  // between both ends
  return (
    startWeekday < currentWeekdayAdjusted &&
    currentWeekdayAdjusted < endWeekdayAdjusted
  );
}

/** Get the current normal opening, if any */
export function getCurrentNormalOpening(
  testDateTime: Dayjs,
  openings: CalendarOpening[]
): CalendarOpening | null {
  const currentWeekday = testDateTime.day();
  for (const opening of openings) {
    const startWeekday = WEEKDAYS[opening.startDay];
    const endWeekday = WEEKDAYS[opening.endDay];

    const startTimeRel = dayjs(
      `${testDateTime.format('YYYY-MM-DD')} ${opening.startTime}`
    ).utc(true);
    const endTimeRel = dayjs(
      `${testDateTime.format('YYYY-MM-DD')} ${opening.endTime}`
    ).utc(true);

    // single-day interval
    if (
      startWeekday === endWeekday &&
      isInSingleDayNormalOpening(
        startWeekday,
        currentWeekday,
        testDateTime.utc(true),
        startTimeRel,
        endTimeRel
      )
    ) {
      return opening;
    }

    // between both ends
    if (isMiddleDayInRange(startWeekday, endWeekday, currentWeekday)) {
      return opening;
    }

    // first day of interval
    if (
      currentWeekday === startWeekday &&
      currentWeekday !== endWeekday &&
      testDateTime.isSameOrAfter(startTimeRel)
    ) {
      return opening;
    }

    // last day of interval
    if (
      currentWeekday !== startWeekday &&
      currentWeekday === endWeekday &&
      testDateTime.isSameOrBefore(endTimeRel)
    ) {
      return opening;
    }
  }
  return null;
}

/** Get the next normal opening within the same day */
export function getNextNormalOpening(
  testDateTime: Dayjs,
  openings: CalendarOpening[]
): CalendarOpening | null {
  let min: CalendarOpening | null = null;
  let minDate: Dayjs | null = null;

  // no need to handle the potential for the next one being before the current day
  // therefore, we only check startDay = current day and minimize startDay within that subset
  for (const opening of openings) {
    const openingTime = dayjs(
      `${testDateTime.format('YYYY-MM-DD')} ${opening.startTime}`
    );
    if (
      WEEKDAYS[opening.startDay] === testDateTime.day() &&
      testDateTime.isBefore(openingTime) &&
      (minDate === null || minDate.isAfter(openingTime))
    ) {
      min = opening;
      minDate = openingTime;
    }
  }

  return min;
}
/**
 * Determine if a calendar is open 24/7
 * This will not check for 24/7 calendars that have more than a single opening,
 * even if it would be 24/7.
 */
export function isOpen247(openings: CalendarOpening[]): boolean {
  if (openings.length !== 1) {
    return false;
  }
  const opening = openings[0];
  // same day
  if (opening.startDay === opening.endDay) {
    // M 00:00 to M 23:59 should NOT wrap around in this case
    // cases like M 08:00 -> M 07:59 should wrap
    const shifted = dayjs(opening.endTime, 'HH:mm').add(1, 'minute');
    return (
      shifted.format('HH:mm') === opening.startTime.substring(0, 5) &&
      opening.startTime.substring(0, 5) !== '00:00'
    );
  }
  // across day boundary
  return (
    (WEEKDAYS[opening.endDay] + 1) % 7 === WEEKDAYS[opening.startDay] &&
    opening.endTime.substring(0, 5) === '23:59' &&
    opening.startTime.substring(0, 5) === '00:00'
  );
}

/** Get an array of dates to use for a calendar */
export const getDateArray = memoizee(
  (locale: string, monthBasis: Date): Date[] => {
    // start of the month
    const date = new Date(monthBasis.getFullYear(), monthBasis.getMonth(), 1);
    // if the month starts at the beginning of the week, add a full row above of the previous month
    if (date.getDay() === getFirstDayOfWeek(locale)) {
      date.setDate(date.getDate() - 7);
    }

    const firstWeekday = getFirstDayOfWeek(locale);

    // ensure startDate starts at the beginning of a week
    date.setDate(date.getDate() - ((date.getDay() - firstWeekday + 7) % 7));

    // at this point, date must be in a month before `month`.

    // generate this month to the next
    const displayDates = [];
    let week = [];
    do {
      week.push(new Date(date));
      date.setDate(date.getDate() + 1);
      if (week.length === 7) {
        displayDates.push(...week);
        week = [];
      }
    } while (isSameMonthOrBefore(date, monthBasis));

    while (week.length < 7) {
      week.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    displayDates.push(...week);

    return displayDates;
  }
);
