import dayjs, { Dayjs } from "dayjs";
import React, { ReactNode, RefObject } from "react";
import { FormattedMessage } from "react-intl";
import { CalendarOpening, ServicePoint, Weekday } from "../../types/types";
import { overlaps } from "../../utils/DateUtils";
import { getWeekdaySpan } from "../../utils/WeekdayUtils";
import { ExceptionFieldErrors, ExceptionRowState } from "./ExceptionFieldTypes";
import {
  HoursOfOperationErrors,
  HoursOfOperationRowState,
} from "./HoursOfOperationFieldTypes";
import RowType from "./RowType";

export interface FormValues {
  name: string;
  "start-date": string;
  "end-date": string;
  "service-points": ServicePoint[];
  "hours-of-operation": HoursOfOperationRowState[];
  exceptions: ExceptionRowState[];
}

export interface InnerFieldRefs {
  hoursOfOperation: {
    startTime: Record<number, HTMLInputElement>;
    endTime: Record<number, HTMLInputElement>;
  };
  exceptions: {
    startDate: Record<number, Record<number, HTMLInputElement>>;
    startTime: Record<number, Record<number, HTMLInputElement>>;
    endDate: Record<number, Record<number, HTMLInputElement>>;
    endTime: Record<number, Record<number, HTMLInputElement>>;
  };
}

export type SimpleErrorFormValues = Omit<
  FormValues,
  "hours-of-operation" | "exceptions"
>;

function required(
  values: Partial<FormValues>,
  key: keyof SimpleErrorFormValues
): {
  [key in keyof SimpleErrorFormValues]?: ReactNode;
} {
  if (
    !(key in values) ||
    values[key] === undefined ||
    (typeof values[key] === "string" &&
      (values[key] as string).trim() === "") ||
    (Array.isArray(values[key]) && (values[key] as unknown[]).length === 0)
  ) {
    return {
      [key]: <FormattedMessage id="stripes-core.label.missingRequiredField" />,
    };
  }
  return {};
}
function isTimeProper(
  localeTimeFormat: string,
  fieldValue: string,
  realInputValue: string
): boolean {
  if (realInputValue === undefined) {
    return true;
  }

  let timeObject = dayjs(realInputValue, localeTimeFormat, true);
  if (!timeObject.isValid()) {
    // the picker has a tendency to remove leading zeroes
    timeObject = dayjs(
      realInputValue,
      localeTimeFormat.replace("HH", "H").replace("hh", "h"),
      true
    );
  }

  return (
    timeObject.isValid() &&
    (timeObject.format("HH:mm") === fieldValue ||
      timeObject.format("HH:mm:ss") === fieldValue ||
      timeObject.format("H:mm") === fieldValue ||
      timeObject.format("H:mm:ss") === fieldValue)
  );
}

// ensure manually-typed dates match the proper format
function validateDate(
  values: Partial<FormValues>,
  key: keyof SimpleErrorFormValues,
  dateRef: RefObject<HTMLInputElement>,
  localeDateFormat: string
): Partial<{
  [key in keyof SimpleErrorFormValues]?: ReactNode;
}> {
  if (dateRef.current === null) {
    return {};
  }

  if (
    dateRef.current.value === "" &&
    (!(key in values) || typeof values[key] !== "string")
  ) {
    return {
      [key]: <FormattedMessage id="stripes-core.label.missingRequiredField" />,
    };
  }

  const dateValue = values[key] as string;
  const inputValue = dateRef.current.value;

  if (dayjs(dateValue).format(localeDateFormat) !== inputValue) {
    return {
      [key]: (
        <FormattedMessage
          id="ui-calendar.calendarForm.error.dateFormat"
          values={{ localeDateFormat }}
        />
      ),
    };
  }

  return {};
}

// ensure start-date and end-date are in the proper order
// if improper, renters an error on `end-date`
function validateDateOrder(values: Partial<FormValues>): {
  "end-date"?: ReactNode;
} {
  if (
    typeof values["start-date"] === "string" &&
    values["start-date"] !== "" &&
    typeof values["end-date"] === "string" &&
    values["end-date"] !== "" &&
    values["end-date"] < values["start-date"]
  ) {
    return {
      "end-date": <FormattedMessage id="calendarForm.error.dateOrder" />,
    };
  }
  return {};
}

function validateHoursOfOperationEmpty(
  rows: HoursOfOperationRowState[]
): HoursOfOperationErrors | undefined {
  const emptyErrors: HoursOfOperationErrors["empty"] = {
    startDay: {},
    startTime: {},
    endDay: {},
    endTime: {},
  };

  let hasError = false;

  rows.forEach((row) => {
    if (row.startDay === undefined) {
      emptyErrors.startDay[row.i] = (
        <FormattedMessage id="stripes-core.label.missingRequiredField" />
      );
      hasError = true;
    }
    if (row.endDay === undefined) {
      emptyErrors.endDay[row.i] = (
        <FormattedMessage id="stripes-core.label.missingRequiredField" />
      );
      hasError = true;
    }
    if (row.type === RowType.Open) {
      if (row.startTime === undefined) {
        emptyErrors.startTime[row.i] = (
          <FormattedMessage id="stripes-core.label.missingRequiredField" />
        );
        hasError = true;
      }
      if (row.endTime === undefined) {
        emptyErrors.endTime[row.i] = (
          <FormattedMessage id="stripes-core.label.missingRequiredField" />
        );
        hasError = true;
      }
    }
  });

  if (hasError) {
    return { empty: emptyErrors };
  }

  return undefined;
}

function validateHoursOfOperationTimes(
  rows: HoursOfOperationRowState[],
  timeFieldRefs: InnerFieldRefs["hoursOfOperation"],
  localeTimeFormat: string
): HoursOfOperationErrors | undefined {
  const invalidTimeErrors: HoursOfOperationErrors["invalidTimes"] = {
    startTime: {},
    endTime: {},
  };

  rows.forEach((row) => {
    if (row.type === RowType.Closed) {
      return;
    }
    if (
      !isTimeProper(
        localeTimeFormat,
        row.startTime as string,
        timeFieldRefs.startTime?.[row.i]?.value
      )
    ) {
      invalidTimeErrors.startTime[row.i] = (
        <FormattedMessage
          id="ui-calendar.calendarForm.error.timeFormat"
          values={{ localeTimeFormat }}
        />
      );
    }
    if (
      !isTimeProper(
        localeTimeFormat,
        row.endTime as string,
        timeFieldRefs.endTime?.[row.i]?.value
      )
    ) {
      invalidTimeErrors.endTime[row.i] = (
        <FormattedMessage
          id="ui-calendar.calendarForm.error.timeFormat"
          values={{ localeTimeFormat }}
        />
      );
    }
  });

  if (
    Object.values(invalidTimeErrors.startTime).length ||
    Object.values(invalidTimeErrors.endTime).length
  ) {
    return { invalidTimes: invalidTimeErrors };
  }

  return undefined;
}

function splitRowsIntoWeekdays(
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
  const baseStart = baseDay.startOf("day");
  const baseEnd = baseDay.endOf("day");

  rows.forEach((_row: HoursOfOperationRowState) => {
    const row: HoursOfOperationRowState = { ..._row };

    if (row.type === RowType.Closed) {
      row.startTime = "00:00";
      row.endTime = "23:59";
    }
    const opening: CalendarOpening = {
      startDay: row.startDay as Weekday,
      startTime: row.startTime as string,
      endDay: row.endDay as Weekday,
      endTime: row.endTime as string,
    };

    const span = getWeekdaySpan(opening);
    span.forEach((weekday, i) => {
      let start = baseStart;
      let end = baseEnd;

      const startTime = opening.startTime
        .split(":")
        .map((num) => parseInt(num, 10)) as [number, number];
      const endTime = opening.endTime
        .split(":")
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
        row: row.i,
      });
    });
  });

  return split;
}

function validateHoursOfOperationOverlaps(
  split: Record<Weekday, { start: Dayjs; end: Dayjs; row: number }[]>
): HoursOfOperationErrors | undefined {
  const conflicts = new Set<number>();

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
          conflicts.add(timeRanges[i].row);
          conflicts.add(timeRanges[j].row);
        }
      }
    }
  });

  if (conflicts.size) {
    return { conflicts };
  }

  return undefined;
}

function validateHoursOfOperation(
  rows: HoursOfOperationRowState[] | undefined,
  timeFieldRefs: InnerFieldRefs["hoursOfOperation"],
  localeTimeFormat: string
): {
  "hours-of-operation"?: HoursOfOperationErrors;
} {
  if (rows === undefined) return {};

  const emptyError = validateHoursOfOperationEmpty(rows);
  if (emptyError !== undefined) {
    return { "hours-of-operation": emptyError };
  }

  const timeError = validateHoursOfOperationTimes(
    rows,
    timeFieldRefs,
    localeTimeFormat
  );
  if (timeError !== undefined) {
    return { "hours-of-operation": timeError };
  }

  const split = splitRowsIntoWeekdays(rows);

  return {
    // can be undefined but that is acceptable here
    // as no other cases to check
    "hours-of-operation": validateHoursOfOperationOverlaps(split),
  };
}

export function validateExceptionInnerRowEmpty(
  row: ExceptionRowState,
  innerRow: ExceptionRowState["rows"][0],
  innerFieldRefs: InnerFieldRefs["exceptions"],
  emptyErrors: NonNullable<ExceptionFieldErrors["empty"]>,
  _hasError: boolean
): boolean {
  let hasError = _hasError;
  if (
    innerRow.startDate === undefined ||
    innerRow.startDate === "" ||
    !(innerFieldRefs.startDate?.[row.i]?.[innerRow.i] instanceof HTMLElement)
  ) {
    emptyErrors.startDate[row.i][innerRow.i] = (
      <FormattedMessage id="stripes-core.label.missingRequiredField" />
    );
    hasError = true;
  }
  if (
    innerRow.endDate === undefined ||
    innerRow.endDate === "" ||
    !(innerFieldRefs.endDate?.[row.i]?.[innerRow.i] instanceof HTMLElement)
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

export function validateExceptionsEmpty(
  rows: ExceptionRowState[],
  innerFieldRefs: InnerFieldRefs["exceptions"]
): ExceptionFieldErrors | undefined {
  const emptyErrors: ExceptionFieldErrors["empty"] = {
    name: {},
    startDate: {},
    startTime: {},
    endDate: {},
    endTime: {},
  };

  let hasError = false;

  rows.forEach((row) => {
    if (row.name === undefined || row.name.trim() === "") {
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

export function validateExceptionInnerRowDatesAndTimes(
  row: ExceptionRowState,
  innerRow: ExceptionRowState["rows"][0],
  innerFieldRefs: InnerFieldRefs["exceptions"],
  invalidErrors: NonNullable<ExceptionFieldErrors["invalid"]>,
  localeDateFormat: string,
  localeTimeFormat: string,
  _hasError: boolean
) {
  let hasError = _hasError;
  if (
    dayjs(innerRow.startDate).format(localeDateFormat) !==
    innerFieldRefs.startDate?.[row.i]?.[innerRow.i]?.value
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
    innerFieldRefs.endDate?.[row.i]?.[innerRow.i]?.value
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
        innerFieldRefs.startTime?.[row.i]?.[innerRow.i]?.value
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
        innerFieldRefs.endTime?.[row.i]?.[innerRow.i]?.value
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

export function validateExceptionsDatesAndTimes(
  rows: ExceptionRowState[],
  innerFieldRefs: InnerFieldRefs["exceptions"],
  localeDateFormat: string,
  localeTimeFormat: string
): ExceptionFieldErrors | undefined {
  const invalidErrors: ExceptionFieldErrors["invalid"] = {
    startDate: {},
    startTime: {},
    endDate: {},
    endTime: {},
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

export function validateExceptionInterOverlaps(
  rows: ExceptionRowState[]
): ExceptionFieldErrors | undefined {
  const interConflicts: ExceptionFieldErrors["interConflicts"] =
    new Set<number>();

  const rowMinMaxes: { i: number; startDate: Dayjs; endDate: Dayjs }[] =
    rows.map((row) => ({
      i: row.i,
      startDate: dayjs
        .min(row.rows.map(({ startDate }) => dayjs(startDate)))
        .startOf("day"),
      endDate: dayjs
        .max(row.rows.map(({ endDate }) => dayjs(endDate)))
        .endOf("day"),
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

export function getExceptionRowIntraOverlap(
  row: ExceptionRowState
): Set<number> {
  const overlappingRows = new Set<number>();

  for (let i = 0; i < row.rows.length - 1; i++) {
    for (let j = i + 1; j < row.rows.length; j++) {
      if (
        overlaps(
          dayjs(`${row.rows[i].startDate} ${row.rows[i].startTime}`),
          dayjs(`${row.rows[i].endDate} ${row.rows[i].endTime}`),
          dayjs(`${row.rows[j].startDate} ${row.rows[j].startTime}`),
          dayjs(`${row.rows[j].endDate} ${row.rows[j].endTime}`)
        )
      ) {
        overlappingRows.add(row.rows[i].i);
        overlappingRows.add(row.rows[j].i);
      }
    }
  }

  return overlappingRows;
}

export function validateExceptionIntraOverlaps(
  rows: ExceptionRowState[]
): ExceptionFieldErrors | undefined {
  const intraConflicts: ExceptionFieldErrors["intraConflicts"] = {};
  let hasError = false;

  rows.forEach((row) => {
    if (row.type === RowType.Closed) return;

    const innerOverlaps = getExceptionRowIntraOverlap(row);
    if (innerOverlaps.size) {
      intraConflicts[row.i] = {};
      hasError = true;

      innerOverlaps.forEach((innerI) => {
        intraConflicts[row.i][innerI] = true;
      });
    }
  });

  if (hasError) {
    return { intraConflicts };
  }

  return undefined;
}

export function validateExceptions(
  rows: ExceptionRowState[] | undefined,
  innerFieldRefs: InnerFieldRefs["exceptions"],
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
    exceptions: validateExceptionIntraOverlaps(rows),
  };
}

export default function validate(
  localeDateFormat: string,
  localeTimeFormat: string,
  dateRefs: {
    startDateRef: RefObject<HTMLInputElement>;
    endDateRef: RefObject<HTMLInputElement>;
  },
  innerFieldRefs: InnerFieldRefs,
  values: Partial<FormValues>
): Partial<
  {
    "hours-of-operation": HoursOfOperationErrors;
    exceptions: ExceptionFieldErrors;
  } & {
    [key in keyof SimpleErrorFormValues]: ReactNode;
  }
> {
  // in reverse order of priority, later objects will unpack on top of earlier ones
  // therefore, required should take precedence over any other errors
  return {
    ...validateHoursOfOperation(
      values["hours-of-operation"],
      innerFieldRefs.hoursOfOperation,
      localeTimeFormat
    ),
    ...validateExceptions(
      values.exceptions,
      innerFieldRefs.exceptions,
      localeDateFormat,
      localeTimeFormat
    ),
    ...validateDateOrder(values),
    ...required(values, "name"),
    ...validateDate(
      values,
      "start-date",
      dateRefs.startDateRef,
      localeDateFormat
    ),
    ...validateDate(values, "end-date", dateRefs.endDateRef, localeDateFormat),
  };
}
