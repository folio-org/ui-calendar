import { CalloutContextType } from '@folio/stripes/core';
import { FormApi, FORM_ERROR, SubmissionErrors } from 'final-form';
import React, { ReactNode } from 'react';
import { FormattedMessage, IntlShape } from 'react-intl';
import RowType from '../../components/fields/RowType';
import DataRepository from '../../data/DataRepository';
import { Calendar, ErrorCode, ErrorResponse, Weekday } from '../../types/types';
import dayjs from '../../utils/dayjs';
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

  values: FormValues,
  form: FormApi<FormValues>
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
      startTime: opening.startTime as string,
      endDay: opening.endDay as Weekday,
      endTime: opening.endTime as string,
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
      const minDate = dayjs
        .min(exception.rows.map(({ startDate }) => dayjs(startDate)))
        .format('YYYY-MM-DD');
      const maxDate = dayjs
        .max(exception.rows.map(({ endDate }) => dayjs(endDate)))
        .format('YYYY-MM-DD');

      newCalendar.exceptions.push({
        name: exception.name,
        startDate: minDate,
        endDate: maxDate,
        openings: exception.rows.map((row) => ({
          startDate: row.startDate as string,
          startTime: row.startTime as string,
          endDate: row.endDate as string,
          endTime: row.endTime as string,
        })),
      });
    }
  });

  const submissionErrors: Partial<
    Record<keyof FormValues | typeof FORM_ERROR, ReactNode>
  > = {};

  try {
    const cal = await props.submitter(newCalendar);

    props.closeParentLayer(cal.id as string);
  } catch (e: unknown) {
    const response = e as Response;
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
                      error.data.conflictingServicePointIds
                    )
                  ),
                }}
              />
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
          // eslint-disable-next-line no-alert
          alert(error.message);
          // eslint-disable-next-line no-console
          console.error(
            'The following error should have been caught by form validation!',
            error
          );
          submissionErrors[FORM_ERROR] = <>{error.message}</>;
          break;
        case ErrorCode.INTERNAL_SERVER_ERROR:
        case ErrorCode.INVALID_REQUEST:
        case ErrorCode.INVALID_PARAMETER:
        case ErrorCode.CALENDAR_NOT_FOUND: // not applicable
        case ErrorCode.CALENDAR_INVALID_EXCEPTION_OPENING_BOUNDARY: // bounds are auto-generated
        default:
          // eslint-disable-next-line no-alert
          alert(error.message);
          calloutContext.sendCallout({
            message: (
              <FormattedMessage id="ui-calendar.calendarForm.error.internalServerError" />
            ),
            type: 'error',
          });
          submissionErrors[FORM_ERROR] = error.message;
      }
    });
  }

  props.setIsSubmitting(false);

  return submissionErrors;
}
