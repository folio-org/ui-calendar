import { Headline, Icon } from '@folio/stripes/components';
import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import css from './HoursAndExceptionFields.css';

export function isRowConflicted(
  error: { conflict?: true }[] | undefined,
  index: number
): boolean {
  return !!error?.[index]?.conflict;
}

export function getConflictError(
  error: { conflict?: true }[] | undefined
): ReactNode {
  if (error?.length) {
    return (
      <Headline
        margin="none"
        className={css.conflictMessage}
        weight="medium"
        size="medium"
      >
        <Icon icon="exclamation-circle" status="error" />
        <FormattedMessage id="ui-calendar.calendarForm.error.openingConflictError" />
      </Headline>
    );
  }

  return undefined;
}
