import React, { ReactNode, RefObject } from 'react';
import { FormattedMessage } from 'react-intl';
import { ExceptionFieldErrors } from '../../../components/fields/ExceptionFieldTypes';
import { HoursOfOperationErrors } from '../../../components/fields/HoursOfOperationFieldTypes';
import { validateDateOrder, validateDate } from './validateDateTime';
import { FormValues, InnerFieldRefs, SimpleErrorFormValues } from '../types';
import validateHoursOfOperation from './validateHoursOfOperation';
import validateExceptions from './validateExceptions';

/** Require a given key */
function required(
  values: Partial<FormValues>,
  key: keyof SimpleErrorFormValues
): {
  [key in keyof SimpleErrorFormValues]?: ReactNode;
} {
  if (
    !(key in values) ||
    values[key] === undefined ||
    (typeof values[key] === 'string' &&
      (values[key] as string).trim() === '') ||
    (Array.isArray(values[key]) &&
      (values[key] as unknown[]).filter((a) => a).length === 0)
  ) {
    return {
      [key]: <FormattedMessage id="stripes-core.label.missingRequiredField" />,
    };
  }
  return {};
}

/** Run all validation functions */
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
    'hours-of-operation': HoursOfOperationErrors;
    exceptions: ExceptionFieldErrors;
  } & {
    [key in keyof SimpleErrorFormValues]: ReactNode;
  }
> {
  // in reverse order of priority, later objects will unpack on top of earlier ones
  // therefore, required should take precedence over any other errors
  return {
    ...validateHoursOfOperation(
      values['hours-of-operation'],
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
    ...required(values, 'name'),
    ...validateDate(
      values,
      'start-date',
      dateRefs.startDateRef,
      localeDateFormat
    ),
    ...validateDate(values, 'end-date', dateRefs.endDateRef, localeDateFormat),
  };
}
