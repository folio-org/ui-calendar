import type { Dayjs } from 'dayjs';
import {
  HoursOfOperationErrors,
  HoursOfOperationRowState,
} from '../../../components/fields/HoursOfOperationFieldTypes';
import RowType from '../../../components/fields/RowType';
import { CalendarOpening, Weekday } from '../../../types/types';
import { overlaps } from '../../../utils/DateUtils';
import { getWeekdaySpan } from '../../../utils/WeekdayUtils';
import dayjs from '../../../utils/dayjs';

/** Split rows into weekday ranges */
export function splitRowsIntoWeekdays(
  rows: HoursOfOperationRowState[]
): Record<Weekday, { start: Dayjs; end: Dayjs; row: number }[]> {
  const split: Record<Weekday, { start: Dayjs; end: Dayjs; row: number }[]> = {
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  };
  const baseDay = dayjs();
  const baseStart = baseDay.startOf('day');
  const baseEnd = baseDay.endOf('day');

  rows.forEach((_row: HoursOfOperationRowState, rowIndex) => {
    // don't pollute original row
    const row: HoursOfOperationRowState = { ..._row };

    if (row.type === RowType.Closed) {
      row.startTime = '00:00';
      row.endTime = '23:59';
    }

    if (
      row.startDay === undefined ||
      row.endDay === undefined ||
      row.startTime === undefined ||
      row.endTime === undefined
    ) {
      return;
    }

    const opening: CalendarOpening = {
      startDay: row.startDay,
      startTime: row.startTime,
      endDay: row.endDay,
      endTime: row.endTime,
    };

    const span = getWeekdaySpan(opening);
    span.forEach((weekday, i) => {
      let start = baseStart;
      let end = baseEnd;

      const startTime = opening.startTime
        .split(':')
        .map((num) => parseInt(num, 10)) as [number, number];
      const endTime = opening.endTime
        .split(':')
        .map((num) => parseInt(num, 10)) as [number, number];

      if (i === 0) {
        start = start.hour(startTime[0]).minute(startTime[1]);
      }
      if (i === span.length - 1) {
        end = end.hour(endTime[0]).minute(endTime[1]);
      }

      split[weekday].push({
        start,
        end,
        row: rowIndex,
      });
    });
  });

  return split;
}

/** Check for hours of operation overlaps */
export function validateHoursOfOperationOverlaps(
  split: Record<Weekday, { start: Dayjs; end: Dayjs; row: number }[]>
): HoursOfOperationErrors {
  const conflicts: HoursOfOperationErrors = {};

  Object.values(split).forEach((timeRanges) => {
    for (let i = 0; i < timeRanges.length - 1; i++) {
      for (let j = i + 1; j < timeRanges.length; j++) {
        if (
          overlaps(
            timeRanges[i].start,
            timeRanges[i].end,
            timeRanges[j].start,
            timeRanges[j].end
          )
        ) {
          conflicts[timeRanges[i].row] = { conflict: true };
          conflicts[timeRanges[j].row] = { conflict: true };
        }
      }
    }
  });

  return conflicts;
}

/** Validate all parts of hours of operation */
export default function validateHoursOfOperation(
  rows: HoursOfOperationRowState[] | undefined
): HoursOfOperationErrors {
  if (rows === undefined) return {};

  return validateHoursOfOperationOverlaps(splitRowsIntoWeekdays(rows));
}
