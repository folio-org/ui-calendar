import React, { ReactNode } from 'react';
import { FormattedMessage, IntlShape } from 'react-intl';
import { CalendarException, CalendarOpening, Weekday } from '../types/types';
import css from '../views/panes/InfoPane.css';
import { getLocalizedDate, getLocalizedTime } from './DateUtils';
import { getWeekdaySpan, LocaleWeekdayInfo } from './WeekdayUtils';

/**
 * Used for comparison to ensure hours are properly sorted.
 * Used for when an opening spans multiple days; this will fully replace an opening or closing
 * for a given day
 */
export const NEXT_DAY_FULL_WRAPAROUND = '-';

/**
 * Used for when an opening spans part of a night (as determined by {@code OVERNIGHT_THRESHOLD}),
 * such as if something is open until 1AM.  Instead of a full replacement, this is appended
 * to an end time (will be parsed out in rendering).
 */
export const NEXT_DAY_OVERNIGHT = '*';

/**
 * The time at which a closure is considered the next day, rather than the current day
 * This will be compared lexicographically.
 *
 * For example, with threshold of "04:00", if an opening is Monday 13:00 - Tuesday 02:00
 * then it will show:
 *   Monday: 13:00 to 02:00* (with * denoting next day)
 *   Tuesday: closed
 *
 * If it was Monday 13:00 - Tuesday 06:00, then:
 *   Monday: 13:00 to -- (with -- denoting it does not close on Monday)
 *   Tuesday: -- to 06:00 (with -- denoting it was already open)
 *
 * The idea of this is to reduce confusion with instances where, for example, a library
 * is frequently open until 1am the next morning.
 */
export const OVERNIGHT_THRESHOLD = '04:00';

export type OpenCloseTimeTuple = [string, string];
export type HoursType = Record<Weekday, OpenCloseTimeTuple[]>;

/**
 * Used for sorting a series of opening tuples for a day.  These tuples may contain
 * {@code NEXT_DAY_FULL_WRAPAROUND} as appropriate
 * @param a A tuple of open/close times
 * @param b A tuple of open/close times
 * @return -1, 0, or 1 depending on comparison result
 */
export function openingSorter(a: OpenCloseTimeTuple, b: OpenCloseTimeTuple) {
  // A wrapped from previous day or B wraps to next day
  if (a[0] === NEXT_DAY_FULL_WRAPAROUND || b[1] === NEXT_DAY_FULL_WRAPAROUND) {
    return -1;
  }
  // B wrapped from previous day or A wraps to next day
  if (b[0] === NEXT_DAY_FULL_WRAPAROUND || a[1] === NEXT_DAY_FULL_WRAPAROUND) {
    return 1;
  }
  return a[0].localeCompare(b[0]);
}

/**
 * Split an array of openings into a record of weekdays mapped to arrays of
 * `OpenCloseTimeTuple`s
 */
export function splitOpeningsIntoDays(openings: CalendarOpening[]): HoursType {
  const hours: HoursType = {
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  };

  openings.forEach((opening) => {
    const { startTime } = opening;
    let { endTime } = opening;
    const span = getWeekdaySpan(opening);

    // if the closing time should be considered overnight on the previous day,
    // rather than a full additional day of opening
    if (span.length > 1 && endTime <= OVERNIGHT_THRESHOLD) {
      span.pop();
      endTime += NEXT_DAY_OVERNIGHT; // append to denote next day
    }

    span.forEach((day, i) => {
      const bounds: OpenCloseTimeTuple = [
        NEXT_DAY_FULL_WRAPAROUND,
        NEXT_DAY_FULL_WRAPAROUND,
      ];
      if (i === 0) {
        bounds[0] = startTime;
      }
      if (i === span.length - 1) {
        bounds[1] = endTime;
      }

      hours[day].push(bounds);
    });
  });

  (Object.keys(hours) as Weekday[]).forEach((day) => {
    hours[day].sort(openingSorter);
  });

  return hours;
}

export function get247Rows(
  intl: IntlShape,
  localeWeekdays: LocaleWeekdayInfo[],
) {
  return localeWeekdays.map((weekday, i) => ({
    day: weekday.long,
    startTime: (
      <p
        key={i}
        title={intl.formatMessage({ id: 'ui-calendar.infoPane.247HelpText' })}
      >
        &ndash;
      </p>
    ),
    endTime: (
      <p
        key={i}
        title={intl.formatMessage({ id: 'ui-calendar.infoPane.247HelpText' })}
      >
        &ndash;
      </p>
    ),
  }));
}

/** Generate rows to display, based on hours from `splitOpeningsIntoDays` */
export function generateDisplayRows(
  intl: IntlShape,
  localeWeekdays: LocaleWeekdayInfo[],
  hours: HoursType,
) {
  return localeWeekdays.map((weekday, weekdayNum) => {
    const tuples = hours[weekday.weekday];
    const times: {
      startTime: ReactNode[];
      endTime: ReactNode[];
    } = {
      startTime: [],
      endTime: [],
    };

    if (tuples.length === 0) {
      times.startTime.push(
        <p className={css.closed} key={`${weekdayNum}-s`}>
          <FormattedMessage id="ui-calendar.infoPane.display.closed" />
        </p>,
      );
    }

    tuples.forEach(([open, close], i) => {
      if (open === NEXT_DAY_FULL_WRAPAROUND) {
        times.startTime.push(
          <p
            key={`${weekdayNum}-${i}-s`}
            title={intl.formatMessage({
              id: 'ui-calendar.infoPane.display.wrappedOpening',
            })}
          >
            &ndash;
          </p>,
        );
      } else {
        times.startTime.push(
          <p key={`${weekdayNum}-${i}-s`}>{getLocalizedTime(intl, open)}</p>,
        );
      }
      if (close === NEXT_DAY_FULL_WRAPAROUND) {
        times.endTime.push(
          <p
            key={`${weekdayNum}-${i}-e`}
            title={intl.formatMessage({
              id: 'ui-calendar.infoPane.display.wrappedClosed',
            })}
          >
            &ndash;
          </p>,
        );
      } else if (close.endsWith(NEXT_DAY_OVERNIGHT)) {
        times.endTime.push(
          <p
            key={`${weekdayNum}-${i}-e`}
            title={intl.formatMessage({
              id: 'ui-calendar.infoPane.display.closesAfterMidnight',
            })}
          >
            <FormattedMessage
              id="ui-calendar.infoPane.display.closesAfterMidnightTime"
              values={{
                time: getLocalizedTime(
                  intl,
                  close.replace(NEXT_DAY_OVERNIGHT, '').trim(),
                ),
              }}
            />
          </p>,
        );
      } else {
        times.endTime.push(
          <p key={`${weekdayNum}-${i}-e`}>{getLocalizedTime(intl, close)}</p>,
        );
      }
    });

    return {
      day: weekday.long,
      startTime: <>{times.startTime}</>,
      endTime: <>{times.endTime}</>,
    };
  });
}

/** Display rows for exceptional information */
export function generateExceptionalOpeningRows(
  intl: IntlShape,
  exceptions: CalendarException[],
) {
  return exceptions.map((exception) => {
    const times: {
      start: ReactNode[];
      end: ReactNode[];
    } = {
      start: [],
      end: [],
    };

    exception.openings.forEach(
      ({ startDate, startTime, endDate, endTime }, i) => {
        times.start.push(
          <p key={i}>
            {getLocalizedDate(intl, startDate)}
            <br />
            {getLocalizedTime(intl, startTime)}
          </p>,
        );
        times.end.push(
          <p key={i}>
            {getLocalizedDate(intl, endDate)}
            <br />
            {getLocalizedTime(intl, endTime)}
          </p>,
        );
      },
    );

    return {
      name: exception.name,
      start: <>{times.start}</>,
      end: <>{times.end}</>,
    };
  });
}

/**
 * Used to detect when help text for * should be rendered.
 */
export function containsNextDayOvernight(hours: HoursType) {
  for (const tuples of Object.values(hours)) {
    for (const tuple of tuples) {
      if (
        tuple[0].endsWith(NEXT_DAY_OVERNIGHT) ||
        tuple[1].endsWith(NEXT_DAY_OVERNIGHT)
      ) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Used to detect when help text for -- should be rendered.
 */
export function containsFullOvernightSpans(hours: HoursType) {
  for (const tuples of Object.values(hours)) {
    for (const tuple of tuples) {
      if (
        tuple[0] === NEXT_DAY_FULL_WRAPAROUND ||
        tuple[1] === NEXT_DAY_FULL_WRAPAROUND
      ) {
        return true;
      }
    }
  }
  return false;
}
