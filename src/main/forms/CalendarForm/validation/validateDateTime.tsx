import React, { ReactNode, RefObject } from "react";
import { FormattedMessage } from "react-intl";
import dayjs from "../../../utils/dayjs";
import { FormValues, SimpleErrorFormValues } from "../types";

/** Ensure a time's format is correct */
export function isTimeProper(
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

/** ensure manually-typed dates match the proper format */
export function validateDate(
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

/**
 * ensure start-date and end-date are in the proper order
 * if improper, renters an error on `end-date`
 */
export function validateDateOrder(values: Partial<FormValues>): {
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
