import React, { ReactNode, RefObject } from 'react';
import { FormattedMessage } from 'react-intl';
import dayjs from '../../../utils/dayjs';
import { FormValues, SimpleErrorFormValues } from '../types';

/** Ensure a time's format is correct */
export function isTimeProper(
  fieldValue: string | null | undefined, // from onchange/similar. null if untouched in edit mode; undefined if we don't have a value
  realInputValue: string | undefined, // from ref
): boolean {
  return (
    realInputValue === undefined || // we never got the ref
    fieldValue === null || // field was never touched so never had onChange called
    fieldValue === realInputValue
  );
}

/** ensure manually-typed dates match the proper format */
export function validateDate(
  values: Partial<FormValues>,
  key: keyof SimpleErrorFormValues,
  dateRef: RefObject<HTMLInputElement>,
  localeDateFormat: string,
): Partial<{
  [key in keyof SimpleErrorFormValues]?: ReactNode;
}> {
  if (dateRef.current === null) {
    return {};
  }

  if (dateRef.current.value === '' && (!(key in values) || typeof values[key] !== 'string')) {
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
  'end-date'?: ReactNode;
} {
  if (
    typeof values['start-date'] === 'string' &&
    values['start-date'] !== '' &&
    typeof values['end-date'] === 'string' &&
    values['end-date'] !== '' &&
    values['end-date'] < values['start-date']
  ) {
    return {
      'end-date': <FormattedMessage id="ui-calendar.calendarForm.error.dateOrder" />,
    };
  }
  return {};
}
