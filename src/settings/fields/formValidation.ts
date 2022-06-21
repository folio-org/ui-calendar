import dayjs, { Dayjs } from "dayjs";
import { ReactNode, RefObject } from "react";
import { CalendarOpening, ServicePoint, Weekday } from "../../types/types";
import { getWeekdaySpan, overlaps } from "../CalendarUtils";
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
}

export interface TimeFieldRefs {
  hoursOfOperation: {
    startTime: Record<number, HTMLInputElement>;
    endTime: Record<number, HTMLInputElement>;
  };
  exceptions: {
    startTime: Record<number, Record<number, HTMLInputElement>>;
    endTime: Record<number, Record<number, HTMLInputElement>>;
  };
}

export type SimpleErrorFormValues = Omit<FormValues, "hours-of-operation">;

function required(
  values: Partial<FormValues>,
  key: keyof SimpleErrorFormValues
): {
  [key in keyof SimpleErrorFormValues]?: ReactNode;
} {
  if (
    !(key in values) ||
    values[key] === undefined ||
    (typeof values[key] === "string" && values[key] === "") ||
    (Array.isArray(values[key]) && (values[key] as unknown[]).length === 0)
  ) {
    return {
      [key]: "Please fill this in to continue",
    };
  }
  return {};
}
function isTimeProper(
  localeTimeFormat: string,
  fieldValue: string,
  realInputValue: string
): boolean {
  const timeObject = dayjs(realInputValue, localeTimeFormat, true);
  return !timeObject.isValid() || timeObject.format("HH:mm") !== fieldValue;
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
      [key]: "Please fill this in to continue",
    };
  }

  const dateValue = values[key] as string;
  const inputValue = dateRef.current.value;

  if (dayjs(dateValue).format(localeDateFormat) !== inputValue) {
    return {
      [key]: `Please ender a date in the ${localeDateFormat} format`,
    };
  }

  return {};
}

// ensure start-date and end-date are in the proper order
// if improper, renders an error on `end-date`
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
      "end-date": "End date must not be before the start date",
    };
  }
  return {};
}

function validateHoursOfOperationEmpty(
  rows: HoursOfOperationRowState[],
  timeFieldRefs: TimeFieldRefs["hoursOfOperation"]
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
      emptyErrors.startDay[row.i] = "Please fill this in to continue";
      hasError = true;
    }
    if (row.endDay === undefined) {
      emptyErrors.endDay[row.i] = "Please fill this in to continue";
      hasError = true;
    }
    if (row.type === RowType.Open) {
      if (row.startTime === undefined || !(row.i in timeFieldRefs.startTime)) {
        emptyErrors.startTime[row.i] = "Please fill this in to continue";
        hasError = true;
      }
      if (row.endTime === undefined || !(row.i in timeFieldRefs.endTime)) {
        emptyErrors.endTime[row.i] = "Please fill this in to continue";
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
  timeFieldRefs: TimeFieldRefs["hoursOfOperation"],
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
      isTimeProper(
        localeTimeFormat,
        row.startTime as string,
        timeFieldRefs.startTime[row.i]?.value
      )
    ) {
      invalidTimeErrors.startTime[
        row.i
      ] = `Please ender a date in the ${localeTimeFormat} format`;
    }
    if (
      isTimeProper(
        localeTimeFormat,
        row.endTime as string,
        timeFieldRefs.endTime[row.i]?.value
      )
    ) {
      invalidTimeErrors.endTime[
        row.i
      ] = `Please ender a date in the ${localeTimeFormat} format`;
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

  rows.forEach((_row: HoursOfOperationRowState, rowIndex) => {
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
        row: rowIndex,
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
  timeFieldRefs: TimeFieldRefs["hoursOfOperation"],
  localeTimeFormat: string
): {
  "hours-of-operation"?: HoursOfOperationErrors;
} {
  if (rows === undefined) return {};

  const emptyError = validateHoursOfOperationEmpty(rows, timeFieldRefs);
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

export default function validate(
  localeDateFormat: string,
  localeTimeFormat: string,
  dateRefs: {
    startDateRef: RefObject<HTMLInputElement>;
    endDateRef: RefObject<HTMLInputElement>;
  },
  timeFieldRefs: TimeFieldRefs,
  values: Partial<FormValues>
): Partial<
  {
    "hours-of-operation": HoursOfOperationErrors;
  } & {
    [key in keyof SimpleErrorFormValues]: ReactNode;
  }
> {
  // in reverse order of priority, later objects will unpack on top of earlier ones
  // therefore, required should take precedence over any other errors
  return {
    ...validateHoursOfOperation(
      values["hours-of-operation"],
      timeFieldRefs.hoursOfOperation,
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
