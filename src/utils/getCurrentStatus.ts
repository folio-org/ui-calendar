import { IntlShape } from 'react-intl';
import {
  Calendar,
  CalendarException,
  CalendarOpening,
  Weekday
} from '../types/types';
import {
  getCurrentExceptionalOpening,
  getCurrentNormalOpening,
  getDateMatches,
  getNextExceptionalOpening,
  getNextNormalOpening,
  isOpen247
} from './CalendarUtils';
import {
  dateFromYYYYMMDD,
  dateFromYYYYMMDDAndHHMM,
  getLocalizedDate,
  getLocalizedTime,
  getRelativeDateProximity
} from './DateUtils';
import {
  getRelativeWeekdayStatus,
  LocaleWeekdayInfo,
  RelativeWeekdayStatus,
  WEEKDAY_INDEX
} from './WeekdayUtils';

type Status =
  | {
      open: boolean;
      exceptional: true;
      exceptionName: string;
      nextEvent?: {
        proximity: 'sameDay' | 'nextDay' | 'nextWeek' | 'sameElse';
        weekday: Weekday;
        date: string;
        time: string;
      };
    }
  | {
      open: boolean;
      exceptional: false;
      exceptionName?: never;
      nextEvent?: RelativeWeekdayStatus;
    };

function getExceptionalStatus(
  intl: IntlShape,
  testDateTime: Date,
  exception: CalendarException
): Status {
  // fully closed exception
  if (exception.openings.length === 0) {
    return {
      open: false,
      exceptional: true,
      exceptionName: exception.name
    };
  }

  const currentOpening = getCurrentExceptionalOpening(testDateTime, exception);
  // not currently open
  if (currentOpening === null) {
    const nextOpening = getNextExceptionalOpening(testDateTime, exception);
    // no future openings in exception
    if (nextOpening === null) {
      return {
        open: false,
        exceptional: true,
        exceptionName: exception.name
      };
    } else {
      // future opening found
      return {
        open: false,
        exceptional: true,
        exceptionName: exception.name,
        nextEvent: {
          proximity: getRelativeDateProximity(
            dateFromYYYYMMDD(nextOpening.startDate),
            testDateTime
          ),
          date: getLocalizedDate(intl, nextOpening.startDate),
          time: getLocalizedTime(intl, nextOpening.startTime),
          weekday:
            WEEKDAY_INDEX[
              dateFromYYYYMMDDAndHHMM(
                nextOpening.startDate,
                nextOpening.startTime
              ).getDay()
            ]
        }
      };
    }
  } else {
    // currently open
    return {
      open: true,
      exceptional: true,
      exceptionName: exception.name,
      nextEvent: {
        proximity: getRelativeDateProximity(
          dateFromYYYYMMDD(currentOpening.endDate),
          testDateTime
        ),
        date: getLocalizedDate(intl, currentOpening.endDate),
        time: getLocalizedTime(intl, currentOpening.endTime),
        weekday:
          WEEKDAY_INDEX[dateFromYYYYMMDD(currentOpening.endDate).getDay()]
      }
    };
  }
}

function getNormalOpeningStatus(
  intl: IntlShape,
  testDateTime: Date,
  openings: CalendarOpening[]
): Status {
  // no openings on that day
  if (openings.length === 0) {
    return {
      open: false,
      exceptional: false
    };
  }

  const currentOpening = getCurrentNormalOpening(testDateTime, openings);
  // not currently open
  if (currentOpening === null) {
    const nextOpening = getNextNormalOpening(testDateTime, openings);
    // no future openings that day
    if (nextOpening === null) {
      return {
        open: false,
        exceptional: false
      };
    } else {
      // future opening found
      return {
        open: false,
        exceptional: false,
        nextEvent: getRelativeWeekdayStatus(
          intl,
          nextOpening.startDay,
          nextOpening.startTime,
          testDateTime
        )
      };
    }
  } else {
    // currently open
    return {
      open: true,
      exceptional: false,
      nextEvent: getRelativeWeekdayStatus(
        intl,
        currentOpening.endDay,
        currentOpening.endTime,
        testDateTime
      )
    };
  }
}

// this function will not consider things more than one day away, unless currently in an opening
export function getCurrentStatusNonFormatted(
  intl: IntlShape,
  testDateTime: Date,
  calendar: Calendar
): Status {
  const { openings, exceptions } = getDateMatches(testDateTime, calendar);

  if (exceptions.length !== 0) {
    return getExceptionalStatus(intl, testDateTime, exceptions[0]);
  }
  if (isOpen247(calendar.normalHours)) {
    return { open: true, exceptional: false };
  }
  return getNormalOpeningStatus(intl, testDateTime, openings);
}

/**
 * Gets the current status, as a translated string.
 * Available formats:
 * ui-calendar.currentStatus.(open | closed)
 * [.exceptional]
 * .(noNext | sameDay | nextDay | nextWeek | sameElse | otherWeekday)
 *
 * Note: sameElse is for exception events more than a week out
 * Available values:
 * - exceptionName (when exceptional is true)
 * - nextWeekday (when otherWeekday)
 * - nextDate (for any exceptional)
 * - nextTime (any of the last option)
 */
// this function will not consider things more than one day away, unless currently in an opening
export default function getCurrentStatus(
  intl: IntlShape,
  localeWeekdays: LocaleWeekdayInfo[],
  testDateTime: Date,
  calendar: Calendar
): string {
  const status = getCurrentStatusNonFormatted(intl, testDateTime, calendar);

  let translationKey = 'ui-calendar.currentStatus';

  if (status.open) {
    translationKey += '.open';
  } else {
    translationKey += '.closed';
  }

  if (status.exceptional) {
    translationKey += '.exceptional';
  }

  if (status.nextEvent !== undefined) {
    translationKey += '.' + status.nextEvent.proximity;
  } else {
    translationKey += '.noNext';
  }

  const nextWeekday = status.nextEvent?.weekday;
  let nextWeekdayString = '';
  if (nextWeekday !== undefined) {
    localeWeekdays.forEach(({ weekday, long }) => {
      if (weekday === nextWeekday) {
        nextWeekdayString = long;
      }
    });
  }

  return intl.formatMessage(
    {
      id: translationKey
    },
    {
      exceptionName: status.exceptionName,
      nextWeekday: nextWeekdayString,
      nextDate: status.nextEvent?.date,
      nextTime: status.nextEvent?.time
    }
  );
}
