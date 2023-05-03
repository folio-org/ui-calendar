import { CalloutContext } from '@folio/stripes/core';
import { FormApi } from 'final-form';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import { useIntl } from 'react-intl';
import DataRepository from '../../data/DataRepository';
import { Calendar } from '../../types/types';
import { useLocaleWeekdays } from '../../utils/WeekdayUtils';
import calendarToInitialValues from '../calendarToInitialValues';
import CalendarForm from './CalendarForm';
import onSubmit from './onSubmit';
import { FormValues } from './types';

export { FORM_ID } from './CalendarForm';

export interface CalendarFormWrapperProps {
  closeParentLayer: (id?: string) => void;
  dataRepository: DataRepository;
  setIsSubmitting: (isSaving: boolean) => void;
  submitter: (calendar: Calendar) => Promise<Calendar>;
  initialValues?: Calendar;
}

export const CalendarFormWrapper: FunctionComponent<
  CalendarFormWrapperProps
> = (props: CalendarFormWrapperProps) => {
  const calloutContext = useContext(CalloutContext);
  const intl = useIntl();
  const localeWeekdays = useLocaleWeekdays(intl);

  const onSubmitCallback = useCallback(
    (values: FormValues, form: FormApi<FormValues>) => {
      return onSubmit(
        {
          closeParentLayer: props.closeParentLayer,
          dataRepository: props.dataRepository,
          setIsSubmitting: props.setIsSubmitting,
          submitter: props.submitter,
        },
        calloutContext,
        intl,
        values,
        form
      );
    },
    [props, calloutContext, intl]
  );

  return (
    <CalendarForm
      onSubmit={onSubmitCallback}
      initialValues={calendarToInitialValues(
        props.dataRepository,
        localeWeekdays,
        props.initialValues
      )}
      dataRepository={props.dataRepository}
    />
  );
};

export default CalendarFormWrapper;
