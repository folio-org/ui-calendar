import { Headline, Icon } from '@folio/stripes/components';
import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { Weekday } from '../../types/types';
import { getWeekdaySpan, LocaleWeekdayInfo, WEEKDAYS } from '../../utils/WeekdayUtils';
import css from './HoursAndExceptionFields.css';
import { HoursOfOperationErrors, HoursOfOperationRowState } from './HoursOfOperationFieldTypes';
import RowType from './RowType';

export function rowsToOpenings(
  providedRows: HoursOfOperationRowState[],
  localeWeekdays: LocaleWeekdayInfo[],
): Pick<Required<HoursOfOperationRowState>, 'startDay' | 'startTime' | 'endDay' | 'endTime'>[] {
  const providedOpenings = providedRows
    .filter((row): row is Required<HoursOfOperationRowState> => {
      return (
        row.startDay !== undefined &&
        row.startTime !== undefined &&
        row.endDay !== undefined &&
        row.endTime !== undefined
      );
    })
    .map((row) => ({
      startDay: row.startDay as Weekday,
      startTime: row.startTime,
      endDay: row.endDay as Weekday,
      endTime: row.endTime,
    }));

  const firstWeekday = WEEKDAYS[localeWeekdays[0].weekday];

  providedOpenings.sort((a, b) => {
    if (a.startDay !== b.startDay) {
      return (
        ((WEEKDAYS[a.startDay] - firstWeekday + 7) % 7) -
        ((WEEKDAYS[b.startDay] - firstWeekday + 7) % 7)
      );
    }
    return a.startTime![0].localeCompare(b.endTime![0]);
  });

  return providedOpenings;
}

export function calculateInitialRows(
  providedRows: HoursOfOperationRowState[],
  localeWeekdays: LocaleWeekdayInfo[],
) {
  const providedOpenings = rowsToOpenings(providedRows, localeWeekdays);
  let count = 0;

  // Find all weekdays
  const weekdaysTouched: Record<Weekday, boolean> = {
    SUNDAY: false,
    MONDAY: false,
    TUESDAY: false,
    WEDNESDAY: false,
    THURSDAY: false,
    FRIDAY: false,
    SATURDAY: false,
  };

  providedOpenings
    .map((o) => ({ ...o, startTime: o.startTime![0], endTime: o.endTime![0] }))
    .flatMap(getWeekdaySpan)
    .forEach((weekday) => {
      weekdaysTouched[weekday] = true;
    });

  const rows: HoursOfOperationRowState[] = [];

  const weekdays = localeWeekdays.map((weekday) => weekday.weekday);
  let openingIndex = 0;
  for (let weekdayIndex = 0; weekdayIndex < weekdays.length; weekdayIndex++) {
    if (weekdaysTouched[weekdays[weekdayIndex]]) {
      while (
        openingIndex < providedOpenings.length &&
        providedOpenings[openingIndex].startDay === weekdays[weekdayIndex]
      ) {
        rows.push({
          i: count,
          type: RowType.Open,
          ...providedOpenings[openingIndex],
        });
        openingIndex++;
        count++;
      }
    } else {
      let endingWeekdayIndex = weekdayIndex;
      // while the days after this one have not been touched
      while (
        endingWeekdayIndex + 1 < weekdays.length &&
        !weekdaysTouched[weekdays[endingWeekdayIndex + 1]]
      ) {
        endingWeekdayIndex++;
        // touch them to prevent double loops in future
        weekdaysTouched[weekdays[endingWeekdayIndex]] = true;
      }
      rows.push({
        type: RowType.Closed,
        i: count,
        startDay: weekdays[weekdayIndex],
        startTime: undefined,
        endDay: weekdays[endingWeekdayIndex],
        endTime: undefined,
      });

      count++;
    }
  }

  return { rows, count };
}

export function isRowConflicted(
  error: HoursOfOperationErrors | undefined,
  rowIndex: number,
): boolean {
  return !!error?.conflicts?.has(rowIndex);
}

export function getWeekdayError(
  key: 'startDay' | 'endDay',
  error: HoursOfOperationErrors | undefined,
  rowIndex: number,
  submitAttempted: boolean,
  touched: boolean | undefined,
): ReactNode {
  if (!submitAttempted && !touched) {
    return undefined;
  }
  return error?.empty?.[key]?.[rowIndex];
}

export function getTimeError(
  key: 'startTime' | 'endTime',
  error: HoursOfOperationErrors | undefined,
  rowIndex: number,
  submitAttempted: boolean,
  touched: boolean | undefined,
): ReactNode {
  if ((!submitAttempted && !touched) || error === undefined) {
    return undefined;
  }
  return error.empty?.[key]?.[rowIndex] || error.invalidTimes?.[key][rowIndex];
}

export function getConflictError(error: HoursOfOperationErrors | undefined): ReactNode {
  if (!error?.conflicts?.size) {
    return undefined;
  }
  return (
    <Headline margin="none" className={css.conflictMessage} weight="medium" size="medium">
      <Icon icon="exclamation-circle" status="error" />
      <FormattedMessage id="ui-calendar.calendarForm.error.openingConflictError" />
    </Headline>
  );
}
