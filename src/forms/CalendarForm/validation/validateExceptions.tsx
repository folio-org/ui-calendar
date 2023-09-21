import type { Dayjs } from 'dayjs';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  ExceptionFieldErrors,
  ExceptionRowState
} from '../../../components/fields/ExceptionFieldTypes';
import RowType from '../../../components/fields/RowType';
import {
  dateFromYYYYMMDDAndHHMM,
  overlaps,
  overlapsDates
} from '../../../utils/DateUtils';
import dayjs from '../../../utils/dayjs';
import { InnerFieldRefs } from '../types';
import { isTimeProper } from './validateDateTime';

/** Validate that inner exception rows are not empty */
function validateExceptionInnerRowEmpty(
  row: ExceptionRowState,
  innerRow: ExceptionRowState['rows'][0],
  innerFieldRefs: InnerFieldRefs['exceptions'],
  emptyErrors: NonNullable<ExceptionFieldErrors['empty']>,
  _hasError: boolean
): boolean {
  let hasError = _hasError;
  if (
    innerRow.startDate === undefined ||
    innerRow.startDate === '' ||
    innerFieldRefs.startDate[row.i]?.[innerRow.i]?.value === undefined
  ) {
    emptyErrors.startDate[row.i][innerRow.i] = (
      <FormattedMessage id="stripes-core.label.missingRequiredField" />
    );
    hasError = true;
  }
  if (
    innerRow.endDate === undefined ||
    innerRow.endDate === '' ||
    innerFieldRefs.endDate[row.i]?.[innerRow.i]?.value === undefined
  ) {
    emptyErrors.endDate[row.i][innerRow.i] = (
      <FormattedMessage id="stripes-core.label.missingRequiredField" />
    );
    hasError = true;
  }
  if (row.type === RowType.Open) {
    if (innerRow.startTime === undefined) {
      emptyErrors.startTime[row.i][innerRow.i] = (
        <FormattedMessage id="stripes-core.label.missingRequiredField" />
      );
      hasError = true;
    }
    if (innerRow.endTime === undefined) {
      emptyErrors.endTime[row.i][innerRow.i] = (
        <FormattedMessage id="stripes-core.label.missingRequiredField" />
      );
      hasError = true;
    }
  }
  return hasError;
}

/** Validate that exception rows as a whole are not empty */
export function validateExceptionsEmpty(
  rows: ExceptionRowState[],
  innerFieldRefs: InnerFieldRefs['exceptions']
): ExceptionFieldErrors | undefined {
  const emptyErrors: ExceptionFieldErrors['empty'] = {
    name: {},
    startDate: {},
    startTime: {},
    endDate: {},
    endTime: {}
  };

  let hasError = false;

  rows.forEach((row) => {
    if (row.name === undefined || row.name.trim() === '') {
      emptyErrors.name[row.i] = (
        <FormattedMessage id="stripes-core.label.missingRequiredField" />
      );
      hasError = true;
    }
    emptyErrors.startDate[row.i] = {};
    emptyErrors.startTime[row.i] = {};
    emptyErrors.endDate[row.i] = {};
    emptyErrors.endTime[row.i] = {};
    row.rows.forEach((innerRow) => {
      hasError = validateExceptionInnerRowEmpty(
        row,
        innerRow,
        innerFieldRefs,
        emptyErrors,
        hasError
      );
    });
  });

  if (hasError) {
    return { empty: emptyErrors };
  }

  return undefined;
}

/** Validate that inner exception rows have proper dates/times */
function validateExceptionInnerRowDatesAndTimes(
  row: ExceptionRowState,
  innerRow: ExceptionRowState['rows'][0],
  innerFieldRefs: InnerFieldRefs['exceptions'],
  invalidErrors: NonNullable<ExceptionFieldErrors['invalid']>,
  localeDateFormat: string,
  localeTimeFormat: string,
  _hasError: boolean
) {
  let hasError = _hasError;
  if (
    dayjs(innerRow.startDate).format(localeDateFormat) !==
    innerFieldRefs.startDate[row.i]?.[innerRow.i]?.value
  ) {
    invalidErrors.startDate[row.i][innerRow.i] = (
      <FormattedMessage
        id="ui-calendar.calendarForm.error.dateFormat"
        values={{ localeDateFormat }}
      />
    );
    hasError = true;
  }
  if (
    dayjs(innerRow.endDate).format(localeDateFormat) !==
    innerFieldRefs.endDate[row.i]?.[innerRow.i]?.value
  ) {
    invalidErrors.endDate[row.i][innerRow.i] = (
      <FormattedMessage
        id="ui-calendar.calendarForm.error.dateFormat"
        values={{ localeDateFormat }}
      />
    );
    hasError = true;
  }
  if (dayjs(innerRow.startDate).isAfter(innerRow.endDate)) {
    invalidErrors.startDate[row.i][innerRow.i] = (
      <FormattedMessage id="ui-calendar.calendarForm.error.dateOrder" />
    );
    invalidErrors.endDate[row.i][innerRow.i] = (
      <FormattedMessage id="ui-calendar.calendarForm.error.dateOrder" />
    );
    hasError = true;
  }
  if (row.type === RowType.Open) {
    if (
      !isTimeProper(
        localeTimeFormat,
        innerRow.startTime as string,
        innerFieldRefs.startTime[row.i]?.[innerRow.i]?.value
      )
    ) {
      invalidErrors.startTime[row.i][innerRow.i] = (
        <FormattedMessage
          id="ui-calendar.calendarForm.error.timeFormat"
          values={{ localeTimeFormat }}
        />
      );
      hasError = true;
    }
    if (
      !isTimeProper(
        localeTimeFormat,
        innerRow.endTime as string,
        innerFieldRefs.endTime[row.i]?.[innerRow.i]?.value
      )
    ) {
      invalidErrors.endTime[row.i][innerRow.i] = (
        <FormattedMessage
          id="ui-calendar.calendarForm.error.timeFormat"
          values={{ localeTimeFormat }}
        />
      );
      hasError = true;
    }
    if (
      dayjs(`${innerRow.startDate} ${innerRow.startTime}`).isAfter(
        `${innerRow.endDate} ${innerRow.endTime}`
      )
    ) {
      invalidErrors.startTime[row.i][innerRow.i] = (
        <FormattedMessage id="ui-calendar.calendarForm.error.timeOrder" />
      );
      invalidErrors.endTime[row.i][innerRow.i] = (
        <FormattedMessage id="ui-calendar.calendarForm.error.timeOrder" />
      );
      hasError = true;
    }
  }
  return hasError;
}

/** Validate all inner dates/times within each overall row */
export function validateExceptionsDatesAndTimes(
  rows: ExceptionRowState[],
  innerFieldRefs: InnerFieldRefs['exceptions'],
  localeDateFormat: string,
  localeTimeFormat: string
): ExceptionFieldErrors | undefined {
  const invalidErrors: ExceptionFieldErrors['invalid'] = {
    startDate: {},
    startTime: {},
    endDate: {},
    endTime: {}
  };

  let hasError = false;

  rows.forEach((row) => {
    invalidErrors.startDate[row.i] = {};
    invalidErrors.startTime[row.i] = {};
    invalidErrors.endDate[row.i] = {};
    invalidErrors.endTime[row.i] = {};
    row.rows.forEach((innerRow) => {
      hasError = validateExceptionInnerRowDatesAndTimes(
        row,
        innerRow,
        innerFieldRefs,
        invalidErrors,
        localeDateFormat,
        localeTimeFormat,
        hasError
      );
    });
  });

  if (hasError) {
    return { invalid: invalidErrors };
  }

  return undefined;
}

/** Check overlaps between exception rows */
export function validateExceptionInterOverlaps(
  rows: ExceptionRowState[]
): ExceptionFieldErrors | undefined {
  const interConflicts: ExceptionFieldErrors['interConflicts'] =
    new Set<number>();

  const rowMinMaxes: { i: number; startDate: Dayjs; endDate: Dayjs }[] =
    rows.map((row) => ({
      i: row.i,
      startDate: dayjs
        .min(row.rows.map(({ startDate }) => dayjs(startDate)))
        ?.startOf('day') ?? dayjs(0),
      endDate: dayjs
        .max(row.rows.map(({ endDate }) => dayjs(endDate)))
        ?.endOf('day') ?? dayjs(0)
    }));

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
        interConflicts.add(rowMinMaxes[i].i);
        interConflicts.add(rowMinMaxes[j].i);
      }
    }
  }

  if (interConflicts.size) {
    return { interConflicts };
  }

  return undefined;
}

/** Check overlaps between inner exception rows */
export function getExceptionRowIntraOverlap(
  row: ExceptionRowState
): Set<number> {
  const overlappingRows = new Set<number>();

  for (let i = 0; i < row.rows.length - 1; i++) {
    for (let j = i + 1; j < row.rows.length; j++) {
      if (
        overlapsDates(
          dateFromYYYYMMDDAndHHMM(
            row.rows[i].startDate as string,
            row.rows[i].startTime as string
          ),
          dateFromYYYYMMDDAndHHMM(
            row.rows[i].endDate as string,
            row.rows[i].endTime as string
          ),
          dateFromYYYYMMDDAndHHMM(
            row.rows[j].startDate as string,
            row.rows[j].startTime as string
          ),
          dateFromYYYYMMDDAndHHMM(
            row.rows[j].endDate as string,
            row.rows[j].endTime as string
          )
        )
      ) {
        overlappingRows.add(row.rows[i].i);
        overlappingRows.add(row.rows[j].i);
      }
    }
  }

  return overlappingRows;
}

/** Validate overlaps between inside exception rows */
export function validateExceptionIntraOverlaps(
  rows: ExceptionRowState[]
): ExceptionFieldErrors | undefined {
  const intraConflicts: ExceptionFieldErrors['intraConflicts'] = {};
  let hasError = false;

  rows.forEach((row) => {
    if (row.type === RowType.Closed) return;

    const innerOverlaps = getExceptionRowIntraOverlap(row);
    if (innerOverlaps.size) {
      intraConflicts[row.i] = new Set<number>();
      hasError = true;

      innerOverlaps.forEach((innerI) => {
        intraConflicts[row.i].add(innerI);
      });
    }
  });

  if (hasError) {
    return { intraConflicts };
  }

  return undefined;
}
/** Validate all parts of exceptions */
export default function validateExceptions(
  rows: ExceptionRowState[] | undefined,
  innerFieldRefs: InnerFieldRefs['exceptions'],
  localeDateFormat: string,
  localeTimeFormat: string
): { exceptions?: ExceptionFieldErrors } {
  if (rows === undefined) {
    return {};
  }

  const emptyErrors = validateExceptionsEmpty(rows, innerFieldRefs);
  if (emptyErrors !== undefined) {
    return { exceptions: emptyErrors };
  }

  const invalidErrors = validateExceptionsDatesAndTimes(
    rows,
    innerFieldRefs,
    localeDateFormat,
    localeTimeFormat
  );
  if (invalidErrors !== undefined) {
    return { exceptions: invalidErrors };
  }

  const interOverlaps = validateExceptionInterOverlaps(rows);
  if (interOverlaps !== undefined) {
    return { exceptions: interOverlaps };
  }

  return {
    // can be undefined but that is acceptable here
    // as no other cases to check
    exceptions: validateExceptionIntraOverlaps(rows)
  };
}
