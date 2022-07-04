import dayjs, { Dayjs } from "dayjs";
import calendarPlugin from "dayjs/plugin/calendar";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import localizedFormat from "dayjs/plugin/localizedFormat";
import weekdayPlugin from "dayjs/plugin/weekday";
import memoizee from "memoizee";
import { IntlShape } from "react-intl";
import { CalendarOpening, Weekday } from "../types/types";
import { getLocalizedTime } from "./DateUtils";

dayjs.extend(customParseFormat);
dayjs.extend(calendarPlugin);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(localizedFormat);
dayjs.extend(weekdayPlugin);

export type RelativeWeekdayStatus =
  | {
      proximity: "sameDay" | "nextDay";
      weekday: undefined;
      date: undefined;
      time: string;
    }
  | {
      proximity: "otherWeekday";
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
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

/** Information about a weekday in the current locale */
interface LocaleWeekdayInfo {
  weekday: Weekday;
  short: string;
  long: string;
}

/** Get information for the days of the week, for the current locale */
export const getLocaleWeekdays: (intl: IntlShape) => LocaleWeekdayInfo[] =
  memoizee((intl: IntlShape) => {
    const weekdays: LocaleWeekdayInfo[] = [];
    for (let i = 0; i < 7; i++) {
      // TODO: ensure this is integrated properly
      const day = dayjs().weekday(i);
      weekdays.push({
        weekday: WEEKDAY_INDEX[day.day()],
        short: intl.formatDate(day.toDate(), { weekday: "short" }),
        long: intl.formatDate(day.toDate(), { weekday: "long" }),
      });
    }
    return weekdays;
  });

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

/** Get all weekdays covered by a calendar's opening */
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

/** Determine how close a weekday is relative to a given reference date */
export function getRelativeWeekdayStatus(
  intl: IntlShape,
  weekday: Weekday,
  time: string,
  referenceDate: Dayjs
): RelativeWeekdayStatus {
  if (referenceDate.day() === WEEKDAYS[weekday]) {
    return {
      proximity: "sameDay",
      weekday: undefined,
      date: undefined,
      time: getLocalizedTime(intl, time),
    };
  }
  if ((referenceDate.day() + 1) % 7 === WEEKDAYS[weekday]) {
    return {
      proximity: "nextDay",
      weekday: undefined,
      date: undefined,
      time: getLocalizedTime(intl, time),
    };
  }
  return {
    proximity: "otherWeekday",
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
