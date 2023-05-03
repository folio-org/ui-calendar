import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { FormValues } from '../types';

/**
 * ensure start-date and end-date are in the proper order
 * if improper, renters an error on `end-date`
 */
export default function validateDateOrder(values: Partial<FormValues>): {
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
      'end-date': (
        <FormattedMessage id="ui-calendar.calendarForm.error.dateOrder" />
      ),
    };
  }
  return {};
}
