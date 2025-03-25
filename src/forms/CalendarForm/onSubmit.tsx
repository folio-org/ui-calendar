import { CalloutContextType } from '@folio/stripes/core';
import { FormApi, FORM_ERROR, SubmissionErrors } from 'final-form';
import { HTTPError } from 'ky';
import React, { ReactNode } from 'react';
import { FormattedMessage, IntlShape } from 'react-intl';
import { Optional } from 'utility-types';
import RowType from '../../components/fields/RowType';
import DataRepository from '../../data/DataRepository';
import { Calendar, ErrorCode, ErrorResponse, Weekday } from '../../types/types';
import { dateFromYYYYMMDD, dateToYYYYMMDD, maxDate, minDate } from '../../utils/DateUtils';
import { formatList } from '../../utils/I18nUtils';
import { FormValues } from './types';

export default async function onSubmit(
  props: {
    closeParentLayer: (id?: string) => void;
    dataRepository: DataRepository;
    setIsSubmitting: (isSaving: boolean) => void;
    submitter: (calendar: Calendar) => Promise<Calendar>;
  },
  calloutContext: CalloutContextType,
  intl: IntlShape,

  values: Optional<FormValues, 'service-points' | 'hours-of-operation' | 'exceptions'>,
  form: FormApi<FormValues>,
): Promise<SubmissionErrors> {
  if (form.getState().hasValidationErrors) {
    return undefined;
  }

  props.setIsSubmitting(true);

  const newCalendar: Calendar = {
    id: null,
    name: values.name,
    startDate: values['start-date'],
    endDate: values['end-date'],
    assignments: [],
    normalHours: [],
    exceptions: [],
  };

  values['service-points']?.forEach((servicePoint) => {
    return newCalendar.assignments.push(servicePoint.id);
  });

  values['hours-of-operation']?.forEach((opening) => {
    if (opening.type === RowType.Closed) return;

    newCalendar.normalHours.push({
      startDay: opening.startDay as Weekday,
      startTime: opening.startTime![0].substring(0, 5),
      endDay: opening.endDay as Weekday,
      endTime: opening.endTime![0].substring(0, 5),
    });
  });

  values.exceptions?.forEach((exception) => {
    if (exception.type === RowType.Closed) {
      newCalendar.exceptions.push({
        name: exception.name,
        startDate: exception.rows[0].startDate as string,
        endDate: exception.rows[0].endDate as string,
        openings: [],
      });
    } else {
      // validated to not be empty as part of pre-submission
      // therefore, we know they will all be defined and non-empty
      // so assertion `as Date` is valid
      const min = dateToYYYYMMDD(
        minDate(
          exception.rows
            .filter(({ startDate }) => startDate !== undefined)
            .map(({ startDate }) => dateFromYYYYMMDD(startDate as string)),
        ) as Date,
      );
      const max = dateToYYYYMMDD(
        maxDate(
          exception.rows
            .filter(({ endDate }) => endDate !== undefined)
            .map(({ endDate }) => dateFromYYYYMMDD(endDate as string)),
        ) as Date,
      );

      newCalendar.exceptions.push({
        name: exception.name,
        startDate: min,
        endDate: max,
        openings: exception.rows.map((row) => ({
          startDate: row.startDate as string,
          startTime: row.startTime![0].substring(0, 5),
          endDate: row.endDate as string,
          endTime: row.endTime![0].substring(0, 5),
        })),
      });
    }
  });

  const submissionErrors: Partial<Record<keyof FormValues | typeof FORM_ERROR, ReactNode>> = {};

  try {
    const cal = await props.submitter(newCalendar);

    props.closeParentLayer(cal.id as string);
  } catch (e) {
    const response = (e as HTTPError).response;
    const errors = (await response.json()) as ErrorResponse;

    errors.errors.forEach((error) => {
      switch (error.code) {
        case ErrorCode.CALENDAR_DATE_OVERLAP:
          calloutContext.sendCallout({
            message: error.message,
            type: 'error',
          });
          submissionErrors['service-points'] = (
            <>
              <FormattedMessage
                id="ui-calendar.calendarForm.error.servicePointConflict"
                values={{
                  list: formatList(
                    intl,
                    props.dataRepository.getServicePointNamesFromIds(
                      error.data.conflictingServicePointIds,
                    ),
                  ),
                  num: props.dataRepository.getServicePointNamesFromIds(
                    error.data.conflictingServicePointIds,
                  ).length,
                }}
              />{' '}
              {error.message}
            </>
          );
          break;

        case ErrorCode.CALENDAR_NO_NAME:
        case ErrorCode.CALENDAR_INVALID_DATE_RANGE:
        case ErrorCode.CALENDAR_INVALID_NORMAL_OPENINGS:
        case ErrorCode.CALENDAR_INVALID_EXCEPTIONS:
        case ErrorCode.CALENDAR_INVALID_EXCEPTION_DATE_ORDER:
        case ErrorCode.CALENDAR_INVALID_EXCEPTION_DATE_BOUNDARY:
        case ErrorCode.CALENDAR_INVALID_EXCEPTION_NAME:
        case ErrorCode.CALENDAR_INVALID_EXCEPTION_OPENINGS:
          submissionErrors[FORM_ERROR] = <>{error.message}</>;
          break;

        case ErrorCode.INTERNAL_SERVER_ERROR:
        case ErrorCode.INVALID_REQUEST:
        case ErrorCode.INVALID_PARAMETER:
        case ErrorCode.CALENDAR_NOT_FOUND: // not applicable
        case ErrorCode.CALENDAR_INVALID_EXCEPTION_OPENING_BOUNDARY: // bounds are auto-generated
        default:
          calloutContext.sendCallout({
            message: <FormattedMessage id="ui-calendar.calendarForm.error.internalServerError" />,
            type: 'error',
          });
          submissionErrors[FORM_ERROR] = error.message;
      }
    });
  }

  props.setIsSubmitting(false);

  return submissionErrors;
}
