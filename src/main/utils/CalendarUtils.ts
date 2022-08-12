import dayjs, { Dayjs } from "dayjs";
import calendarPlugin from "dayjs/plugin/calendar";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import localizedFormat from "dayjs/plugin/localizedFormat";
import weekdayPlugin from "dayjs/plugin/weekday";
import {
  Calendar,
  CalendarException,
  CalendarExceptionOpening,
  CalendarOpening,
} from "../types/types";
import { weekdayIsBetween, WEEKDAYS } from "./WeekdayUtils";

dayjs.extend(customParseFormat);
dayjs.extend(calendarPlugin);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(localizedFormat);
dayjs.extend(weekdayPlugin);

/** Get all openings and exceptions which apply to this date */
export function getDateMatches(
  testDate: Dayjs,
  calendar: Calendar
): {
  openings: CalendarOpening[];
  exceptions: CalendarException[];
} {
  return {
    openings: calendar.normalHours.filter((opening) =>
      weekdayIsBetween(testDate, opening.startDay, opening.endDay)
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
        "minute",
        "[]"
      )
    ) {
      return opening;
    }
  }
  return null;
}

/** Get the next exceptional opening, if any */
export function getNextExceptionalOpening(
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
    const shifted = dayjs(opening.endTime, "HH:mm").add(1, "minute");
    return (
      shifted.format("HH:mm") === opening.startTime.substring(0, 5) &&
      opening.startTime.substring(0, 5) !== "00:00"
    );
  }
  // across day boundary
  return (
    (WEEKDAYS[opening.endDay] + 1) % 7 === WEEKDAYS[opening.startDay] &&
    opening.endTime.substring(0, 5) === "23:59" &&
    opening.startTime.substring(0, 5) === "00:00"
  );
}

/** Get the next normal opening, if applicable */
export function getNextNormalOpening(
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
