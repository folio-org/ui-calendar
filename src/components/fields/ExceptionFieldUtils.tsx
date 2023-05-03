import { Headline, Icon } from '@folio/stripes/components';
import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { ExceptionFieldErrors } from './ExceptionFieldTypes';
import css from './HoursAndExceptionFields.css';

export function isInnerRowConflicted(
  error: { conflict?: true; rows?: { conflict?: true }[] }[] | undefined,
  outerIndex: number,
  innerIndex: number
): boolean {
  return !!error?.[outerIndex]?.rows?.[innerIndex]?.conflict;
}

export function isOuterRowConflicted(
  error: { conflict?: true; rows?: { conflict?: true }[] }[] | undefined,
  index: number
): boolean {
  return !!error?.[index]?.conflict;
}

export function getErrorDisplay(
  errors:
    | Record<
        number,
        { rows?: { startDate?: ReactNode; endDate?: ReactNode }[] } | undefined
      >
    | undefined,
  index: number
) {
  const error = errors?.[index]?.rows;
  if (error === undefined) {
    return undefined;
  }
  for (const row of error) {
    if (row.startDate) {
      return row.startDate;
    }
    if (row.endDate) {
      return row.endDate;
    }
  }
  return undefined;
}

export function getMainConflictError(
  error: ExceptionFieldErrors | undefined
): ReactNode {
  if (error && Object.values(error).some((e) => e.conflict)) {
    return (
      <Headline
        margin="none"
        className={css.conflictMessage}
        weight="medium"
        size="medium"
      >
        <Icon icon="exclamation-circle" status="error" />
        <FormattedMessage id="ui-calendar.calendarForm.error.exceptionConflictError" />
      </Headline>
    );
  }

  return undefined;
}
