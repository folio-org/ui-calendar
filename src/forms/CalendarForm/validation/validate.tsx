import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { ExceptionFieldErrors } from '../../../components/fields/ExceptionFieldTypes';
import { HoursOfOperationErrors } from '../../../components/fields/HoursOfOperationFieldTypes';
import { FormValues, SimpleErrorFormValues } from '../types';
import validateDateOrder from './validateDateTime';
import validateExceptions from './validateExceptions';
import validateHoursOfOperation from './validateHoursOfOperation';
import flattenObject from '../../../utils/flattenObject';

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
export default function validate(values: Partial<FormValues>): Partial<
  {
    'hours-of-operation'?: HoursOfOperationErrors[0][];
    exceptions?: ExceptionFieldErrors[0][];
  } & {
    [key in keyof SimpleErrorFormValues]: ReactNode;
  }
> {
  // in reverse order of priority, later objects will unpack on top of earlier ones
  // therefore, required should take precedence over any other errors
  const r = {
    ...{
      'hours-of-operation': flattenObject(
        validateHoursOfOperation(values['hours-of-operation'])
      ),
    },
    ...{
      exceptions: flattenObject(
        validateExceptions(
          values.exceptions,
          values['start-date'],
          values['end-date']
        )
      ),
    },
    ...validateDateOrder(values),
    ...required(values, 'name'),
  };
  return r;
}
