import type { Dayjs } from 'dayjs';
import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  ExceptionFieldErrors,
  ExceptionRowState,
} from '../../../components/fields/ExceptionFieldTypes';
import RowType from '../../../components/fields/RowType';
import {
  dateFromYYYYMMDD,
  dateFromYYYYMMDDAndHHMM,
  overlaps,
  overlapsDates,
} from '../../../utils/DateUtils';
import dayjs from '../../../utils/dayjs';
import flattenObject from '../../../utils/flattenObject';

export function isExceptionFilled(exception: ExceptionRowState): exception is {
  name: string;
  type: RowType;
  rows: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  }[];
} {
  for (const row of exception.rows) {
    if (row.startDate === undefined || row.endDate === undefined) {
      return false;
    }
    if (exception.type === RowType.Open) {
      if (row.startTime === undefined || row.endTime === undefined) {
        return false;
      }
    }
  }
  return true;
}

/** Check overlaps between inner exception rows */
export function getExceptionRowIntraOverlap(
  row: ExceptionRowState
): Record<number, { conflict?: true }> {
  if (row.type === RowType.Closed || !isExceptionFilled(row)) {
    return {};
  }

  const conflicts: Record<number, { conflict?: true }> = {};

  for (let i = 0; i < row.rows.length - 1; i++) {
    for (let j = i + 1; j < row.rows.length; j++) {
      if (
        overlapsDates(
          dateFromYYYYMMDDAndHHMM(row.rows[i].startDate, row.rows[i].startTime),
          dateFromYYYYMMDDAndHHMM(row.rows[i].endDate, row.rows[i].endTime),
          dateFromYYYYMMDDAndHHMM(row.rows[j].startDate, row.rows[j].startTime),
          dateFromYYYYMMDDAndHHMM(row.rows[j].endDate, row.rows[j].endTime)
        )
      ) {
        conflicts[i] = { conflict: true };
        conflicts[j] = { conflict: true };
      }
    }
  }

  return conflicts;
}
/** Check overlaps between exception rows */
export function validateExceptionOverlaps(
  rows: ExceptionRowState[]
): ExceptionFieldErrors {
  const conflicts: ExceptionFieldErrors = {};

  const rowMinMaxes: { i: number; startDate: Dayjs; endDate: Dayjs }[] = rows
    .map((row, i) => ({
      i,
      startDate: dayjs
        .min(row.rows.map(({ startDate }) => dayjs(startDate)))
        ?.startOf('day') ?? dayjs(0),
      endDate: dayjs
        .max(row.rows.map(({ endDate }) => dayjs(endDate)))
        ?.endOf('day') ?? dayjs(0),
    }))
    .filter(({ i }) => isExceptionFilled(rows[i]));

  for (let i = 0; i < rowMinMaxes.length - 1; i++) {
    for (let j = i + 1; j < rowMinMaxes.length; j++) {
      if (
        overlaps(
          rowMinMaxes[i].startDate,
          rowMinMaxes[i].endDate,
          rowMinMaxes[j].startDate,
          rowMinMaxes[j].endDate
        )
      ) {
        conflicts[rowMinMaxes[i].i] = { conflict: true };
        conflicts[rowMinMaxes[j].i] = { conflict: true };
      }
    }
  }

  rows.forEach((row, i) => {
    if (Object.values(getExceptionRowIntraOverlap(row)).length) {
      conflicts[i] = { rows: flattenObject(getExceptionRowIntraOverlap(row)) };
    }
  });

  return conflicts;
}

export function validateDateOrder(
  rows: ExceptionRowState[]
): ExceptionFieldErrors {
  const errors: ExceptionFieldErrors = {};

  rows.forEach((exception, i) => {
    if (!isExceptionFilled(exception)) {
      return;
    }

    let hasError = false;
    const rowErrors = exception.rows.map<{ endDate?: ReactNode }>((row) => {
      if (
        exception.type === RowType.Open &&
        dateFromYYYYMMDDAndHHMM(row.startDate, row.startTime) >
          dateFromYYYYMMDDAndHHMM(row.endDate, row.endTime)
      ) {
        hasError = true;
        return {
          endDate: (
            <FormattedMessage id="ui-calendar.calendarForm.error.timeOrder" />
          ),
        };
      } else if (
        exception.type === RowType.Closed &&
        row.startDate > row.endDate
      ) {
        hasError = true;
        return {
          endDate: (
            <FormattedMessage id="ui-calendar.calendarForm.error.dateOrder" />
          ),
        };
      }
      return {};
    });

    if (hasError) {
      errors[i] = { rows: rowErrors };
    }
  });

  return errors;
}

export function validateDateBounds(
  rows: ExceptionRowState[],
  startDate: Date,
  endDate: Date
): ExceptionFieldErrors {
  const errors: ExceptionFieldErrors = {};

  rows.forEach((exception, i) => {
    if (!isExceptionFilled(exception)) {
      return;
    }

    let hasError = false;
    const rowErrors = exception.rows.map<{ endDate?: ReactNode }>((row) => {
      if (dateFromYYYYMMDD(row.startDate) < startDate) {
        hasError = true;
        return {
          startDate: (
            <FormattedMessage id="ui-calendar.calendarForm.error.dateRange" />
          ),
        };
      }
      if (dateFromYYYYMMDD(row.endDate) > endDate) {
        hasError = true;
        return {
          endDate: (
            <FormattedMessage id="ui-calendar.calendarForm.error.dateRange" />
          ),
        };
      }
      return {};
    });

    if (hasError) {
      errors[i] = { rows: rowErrors };
    }
  });

  return errors;
}

export default function validateExceptions(
  rows: ExceptionRowState[] | undefined,
  startDate: string | undefined,
  endDate: string | undefined
): ExceptionFieldErrors {
  if (rows === undefined) {
    return {};
  }

  return {
    ...validateExceptionOverlaps(rows),
    ...(startDate && endDate
      ? validateDateBounds(
        rows,
        dateFromYYYYMMDD(startDate),
        dateFromYYYYMMDD(endDate)
      )
      : {}),
    ...validateDateOrder(rows),
  };
}
