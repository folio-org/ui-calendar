import dayjs, { Dayjs } from "dayjs";
import React from "react";
import { FormattedMessage } from "react-intl";
import {
  HoursOfOperationErrors,
  HoursOfOperationRowState,
} from "../../../components/fields/HoursOfOperationFieldTypes";
import RowType from "../../../components/fields/RowType";
import { CalendarOpening, Weekday } from "../../../types/types";
import { overlaps } from "../../../utils/DateUtils";
import { getWeekdaySpan } from "../../../utils/WeekdayUtils";
import { isTimeProper } from "./validateDateTime";
import { InnerFieldRefs } from "../types";

/** Ensure normal openings have filled in times/days */
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

/** Ensure times are valid */
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

/** Split rows into weekday ranges */
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

/** Check for hours of operation overlaps */
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

/** Validate all parts of hours of operation */
export default function validateHoursOfOperation(
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
