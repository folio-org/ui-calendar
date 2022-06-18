import dayjs, { Dayjs } from "dayjs";
import calendarPlugin from "dayjs/plugin/calendar";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import localizedFormat from "dayjs/plugin/localizedFormat";
import memoizee from "memoizee";
import {
  Calendar,
  CalendarException,
  CalendarExceptionOpening,
  CalendarOpening,
  ServicePoint,
  Weekday,
} from "../types/types";

dayjs.extend(customParseFormat);
dayjs.extend(calendarPlugin);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(localizedFormat);

export const WEEKDAYS: Record<Weekday, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};
export const WEEKDAY_INDEX: Weekday[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];
export const WEEKDAY_STRINGS: Record<Weekday, string> = {
  SUNDAY: "Sunday",
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
};

interface LocaleWeekdayInfo {
  weekday: Weekday;
  short: string;
  long: string;
}
export const getLocaleWeekdays: () => LocaleWeekdayInfo[] = memoizee(() => {
  const weekdays: LocaleWeekdayInfo[] = [];
  for (let i = 0; i < 7; i++) {
    const day = dayjs().weekday(i);
    weekdays.push({
      weekday: WEEKDAY_INDEX[day.day()],
      short: day.format("ddd"),
      long: day.format("dddd"),
    });
  }
  return weekdays;
});

export function getWeekdayIndexRange(start: Weekday, end: Weekday): number[] {
  let startIndex = WEEKDAYS[start];
  const endIndex = WEEKDAYS[end];

  const days = [startIndex];
  while (startIndex !== endIndex) {
    startIndex = (startIndex + 1) % 7;
    days.push(startIndex);
  }

  return days;
}

export function getWeekdayRange(start: Weekday, end: Weekday): Weekday[] {
  return getWeekdayIndexRange(start, end).map((i) => WEEKDAY_INDEX[i]);
}

export function getWeekdaySpan(opening: CalendarOpening): Weekday[] {
  if (opening.startDay === opening.endDay) {
    // wraps around (starts after it sends, e.g. M 12:00 -> M 11:59)
    if (opening.startTime > opening.endTime) {
      return WEEKDAY_INDEX;
    }
    return [opening.startDay];
  }
  return getWeekdayRange(opening.startDay, opening.endDay);
}

export function getRelativeDateTime(
  date: string,
  referenceDate: Dayjs
): string {
  return dayjs(dayjs(date).toISOString()).calendar(referenceDate, {
    sameDay: "[at] LT",
    nextDay: "[tomorrow at] LT",
    nextWeek: "dddd [at] LT",
    sameElse: "L",
  });
}

export function getRelativeWeekdayTime(
  weekday: Weekday,
  time: string,
  referenceDate: Dayjs
): string {
  if (referenceDate.day() === WEEKDAYS[weekday]) {
    return `${time}`;
  }
  if ((referenceDate.day() + 1) % 7 === WEEKDAYS[weekday]) {
    return `tomorrow at ${time}`;
  }
  return `${WEEKDAY_STRINGS[weekday]} at ${time}`;
}

function weekdayIsBetween(
  testWeekdayNumber: number,
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
  if (startIndex > testWeekdayNumber) {
    startIndex -= 7;
    endIndex -= 7;
  }

  return startIndex <= testWeekdayNumber && testWeekdayNumber <= endIndex;
}

export function getDateMatches(
  testDate: Dayjs,
  calendar: Calendar
): {
  openings: CalendarOpening[];
  exceptions: CalendarException[];
} {
  return {
    openings: calendar.openings.filter((opening) =>
      weekdayIsBetween(testDate.day(), opening.startDay, opening.endDay)
    ),
    exceptions: calendar.exceptions.filter((exception) =>
      testDate.isBetween(
        dayjs(exception.startDate),
        dayjs(exception.endDate),
        "day",
        "[]"
      )
    ),
  };
}

function getCurrentExceptionalOpening(
  testDateTime: Dayjs,
  exception: CalendarException
): CalendarExceptionOpening | null {
  for (const opening of exception.openings) {
    if (
      testDateTime.isBetween(
        `${opening.startDate} ${opening.startTime}`,
        `${opening.endDate} ${opening.endTime}`,
        "minute",
        "[]"
      )
    ) {
      return opening;
    }
  }
  return null;
}

function getNextExceptionalOpening(
  testDateTime: Dayjs,
  exception: CalendarException
): CalendarExceptionOpening | null {
  let min: CalendarExceptionOpening | null = null;
  let minDate: Dayjs | null = null;
  for (const opening of exception.openings) {
    if (
      testDateTime.isSame(`${opening.startDate}`, "day") &&
      testDateTime.isBefore(
        `${opening.startDate} ${opening.startTime}`,
        "minute"
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

function getExceptionalStatus(
  testDateTime: Dayjs,
  exception: CalendarException
): string {
  // fully closed exception
  if (exception.openings.length === 0) {
    return `Closed (${exception.name})`;
  }

  const currentOpening = getCurrentExceptionalOpening(testDateTime, exception);
  // not currently open
  if (currentOpening === null) {
    const nextOpening = getNextExceptionalOpening(testDateTime, exception);
    // no future openings in exception
    if (nextOpening === null) {
      return `Closed (${exception.name})`;
    } else {
      // future opening found
      return `Closed (${exception.name}), opening ${getRelativeDateTime(
        `${nextOpening.startDate} ${nextOpening.startTime}`,
        testDateTime
      )}`;
    }
  } else {
    // currently open
    return `Open (${exception.name}), closing ${getRelativeDateTime(
      `${currentOpening.endDate} ${currentOpening.endTime}`,
      testDateTime
    )}`;
  }
}

function getCurrentNormalOpening(
  testDateTime: Dayjs,
  openings: CalendarOpening[]
): CalendarOpening | null {
  const currentWeekday = testDateTime.day();
  for (const opening of openings) {
    const startWeekday = WEEKDAYS[opening.startDay];
    const endWeekday = WEEKDAYS[opening.endDay];

    const startTimeRel = dayjs(
      `${testDateTime.format("YYYY-MM-DD")} ${opening.startTime}`
    );
    const endTimeRel = dayjs(
      `${testDateTime.format("YYYY-MM-DD")} ${opening.endTime}`
    );

    // between both ends
    if (currentWeekday !== startWeekday && currentWeekday !== endWeekday) {
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

    // single-day interval
    if (
      currentWeekday === startWeekday &&
      currentWeekday === endWeekday &&
      testDateTime.isSameOrAfter(startTimeRel) &&
      testDateTime.isSameOrBefore(endTimeRel)
    ) {
      return opening;
    }
  }
  return null;
}

export function isOpen247(openings: CalendarOpening[]): boolean {
  if (openings.length !== 1) {
    return false;
  }
  const opening = openings[0];
  // same day
  if (opening.startDay === opening.endDay) {
    // M 00:00 to M 23:59 should NOT wrap around in this case
    // cases like M 08:00 -> M 07:59 should wrap
    const shifted = dayjs(opening.endTime, "HH:mm").add(1, "minute");
    return (
      shifted.format("HH:mm") === opening.startTime &&
      opening.startTime !== "00:00"
    );
  }
  // across day boundary
  return (
    (WEEKDAYS[opening.endDay] + 1) % 7 === WEEKDAYS[opening.startDay] &&
    opening.endTime === "23:59" &&
    opening.startTime === "00:00"
  );
}

function getNextNormalOpening(
  testDateTime: Dayjs,
  openings: CalendarOpening[]
): CalendarOpening | null {
  let min: CalendarOpening | null = null;
  let minDate: Dayjs | null = null;

  // no need to handle the potential for the next one being before the current day
  // therefore, we only check startDay = current day and minimize startDay within that subset
  for (const opening of openings) {
    if (
      WEEKDAYS[opening.startDay] === testDateTime.day() &&
      (minDate === null ||
        minDate.isAfter(
          `${testDateTime.format("YYYY-MM-DD")} ${opening.startTime}`
        ))
    ) {
      min = opening;
      minDate = dayjs(
        `${testDateTime.format("YYYY-MM-DD")} ${opening.startTime}`
      );
    }
  }

  return min;
}

function getNormalOpeningStatus(
  testDateTime: Dayjs,
  openings: CalendarOpening[]
): string {
  // no openings on that day
  if (openings.length === 0) {
    return "Closed";
  }

  const currentOpening = getCurrentNormalOpening(testDateTime, openings);
  // not currently open
  if (currentOpening === null) {
    const nextOpening = getNextNormalOpening(testDateTime, openings);
    // no future openings that day
    if (nextOpening === null) {
      return "Closed";
    } else {
      // future opening found
      return `Closed, opening ${getRelativeWeekdayTime(
        nextOpening.startDay,
        nextOpening.startTime,
        testDateTime
      )}`;
    }
  } else {
    // currently open
    return `Open until ${getRelativeWeekdayTime(
      currentOpening.endDay,
      currentOpening.endTime,
      testDateTime
    )}`;
  }
}

// this function will not consider things more than one day away, unless currently in an opening
export function getStatus(testDateTime: Dayjs, calendar: Calendar): string {
  const { openings, exceptions } = getDateMatches(testDateTime, calendar);

  if (exceptions.length !== 0) {
    return getExceptionalStatus(testDateTime, exceptions[0]);
  }
  if (isOpen247(calendar.openings)) {
    return "Open";
  }
  return getNormalOpeningStatus(testDateTime, openings);
}

export function servicePointIdsToNames(
  servicePoints: ServicePoint[],
  ids: string[]
): string[] {
  return ids
    .map<string | undefined>((id) => {
      const matched = servicePoints.filter(
        (servicePoint) => servicePoint.id === id
      );
      if (matched.length) {
        return matched[0].name;
      } else {
        return undefined;
      }
    })
    .filter<string>((name): name is string => name !== undefined);
}
