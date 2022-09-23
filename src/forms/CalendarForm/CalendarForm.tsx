import {
  Accordion,
  AccordionSet,
  Col,
  Datepicker as DateField,
  DatepickerFieldRenderProps as DateFieldRenderProps,
  ExpandAllButton,
  getLocaleDateFormat,
  getLocalizedTimeFormatInfo,
  Headline,
  Icon,
  Row,
  TextField,
  TextFieldRenderProps,
} from '@folio/stripes/components';
import { CalloutContext } from '@folio/stripes/core';
import type { FormApi } from 'final-form';
import { FORM_ERROR } from 'final-form';
import type { FunctionComponent } from 'react';
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';
import { Field, Form } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import ExceptionField from '../../components/fields/ExceptionField';
import css from '../../components/fields/HoursAndExceptionFields.css';
import HoursOfOperationField from '../../components/fields/HoursOfOperationField';
import ServicePointAssignmentField from '../../components/fields/ServicePointAssignmentField';
import type DataRepository from '../../data/DataRepository';
import type { Calendar } from '../../types/types';
import calendarToInitialValues from '../calendarToInitialValues';
import onSubmit from './onSubmit';
import type { FormValues, InnerFieldRefs } from './types';
import validate from './validation/validate';

const TextFieldComponent = TextField<string, TextFieldRenderProps<string>>;
const DateFieldComponent = DateField<DateFieldRenderProps>;

export const FORM_ID = 'ui-calendar-create-calendar-form';

export interface CreateCalendarFormProps {
  closeParentLayer: (id?: string) => void;
  submitAttempted: boolean;
  dataRepository: DataRepository;
  setIsSubmitting: (isSaving: boolean) => void;
  submitter: (calendar: Calendar) => Promise<Calendar>;
  initialValues?: Calendar;
}

export const CreateCalendarForm: FunctionComponent<CreateCalendarFormProps> = (
  props: CreateCalendarFormProps
) => {
  const calloutContext = useContext(CalloutContext);
  const intl = useIntl();

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

  const localeDateFormat = getLocaleDateFormat({ intl });
  const localeTimeFormat = getLocalizedTimeFormatInfo(intl.locale).timeFormat;

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const innerFieldRefs = useRef<InnerFieldRefs>({
    hoursOfOperation: { startTime: {}, endTime: {} },
    exceptions: { startDate: {}, startTime: {}, endDate: {}, endTime: {} },
  });

  const validationFunction = useMemo(() => {
    return validate.bind(
      this,
      localeDateFormat,
      localeTimeFormat,
      { startDateRef, endDateRef },
      innerFieldRefs.current
    );
  }, [localeDateFormat, localeTimeFormat, startDateRef, endDateRef]);

  return (
    <Form<FormValues>
      onSubmit={onSubmitCallback}
      validate={validationFunction}
      validateOnBlur
      initialValues={calendarToInitialValues(
        props.dataRepository,
        props.initialValues
      )}
      render={(params) => {
        const {
          handleSubmit,
          errors,
          submitErrors,
          touched,
          dirtyFieldsSinceLastSubmit,
          active,
        } = params;

        let topErrorMessage = <></>;
        if (submitErrors?.[FORM_ERROR]) {
          topErrorMessage = (
            <Headline
              margin="none"
              className={css.conflictMessage}
              weight="medium"
              size="medium"
            >
              <Icon icon="exclamation-circle" status="error" />
              {submitErrors[FORM_ERROR]}
            </Headline>
          );
        }

        return (
          <form id={FORM_ID} onSubmit={handleSubmit}>
            {topErrorMessage}
            <AccordionSet>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton />
                </Col>
              </Row>
              <Accordion
                label={
                  <FormattedMessage id="ui-calendar.calendarForm.category.general" />
                }
              >
                <Row>
                  <Col xs={12} md={6}>
                    <Field
                      component={TextFieldComponent}
                      autoFocus
                      required
                      name="name"
                      label={
                        <FormattedMessage id="ui-calendar.calendarForm.field.name" />
                      }
                      error={
                        (!dirtyFieldsSinceLastSubmit?.name &&
                          submitErrors?.name) ||
                        ((props.submitAttempted || touched?.name) &&
                          active !== 'name' &&
                          errors?.name)
                      }
                    />
                  </Col>
                  <Col xs={12} md={3}>
                    <Field
                      component={DateFieldComponent}
                      inputRef={startDateRef}
                      backendDateStandard="YYYY-MM-DD"
                      required
                      usePortal
                      name="start-date"
                      label={
                        <FormattedMessage id="ui-calendar.calendarForm.field.startDate" />
                      }
                      error={
                        (!dirtyFieldsSinceLastSubmit?.['start-date'] &&
                          submitErrors?.['start-date']) ||
                        ((props.submitAttempted || touched?.['start-date']) &&
                          active !== 'start-date' &&
                          errors?.['start-date'])
                      }
                    />
                  </Col>
                  <Col xs={12} md={3}>
                    <Field
                      component={DateFieldComponent}
                      inputRef={endDateRef}
                      backendDateStandard="YYYY-MM-DD"
                      required
                      usePortal
                      name="end-date"
                      label={
                        <FormattedMessage id="ui-calendar.calendarForm.field.endDate" />
                      }
                      error={
                        (!dirtyFieldsSinceLastSubmit?.['end-date'] &&
                          submitErrors?.['end-date']) ||
                        ((props.submitAttempted || touched?.['end-date']) &&
                          active !== 'end-date' &&
                          errors?.['end-date'])
                      }
                    />
                  </Col>
                </Row>
                <ServicePointAssignmentField
                  servicePoints={props.dataRepository.getServicePoints()}
                  error={submitErrors?.['service-points']}
                />
              </Accordion>
              <Accordion
                label={
                  <FormattedMessage id="ui-calendar.calendarForm.category.hoursOfOperation" />
                }
              >
                <Field
                  name="hours-of-operation"
                  component={HoursOfOperationField}
                  timeFieldRefs={innerFieldRefs.current.hoursOfOperation}
                  error={errors?.['hours-of-operation']}
                  localeTimeFormat={localeTimeFormat}
                  submitAttempted={props.submitAttempted}
                  isNewCalendar={props.initialValues === undefined}
                />
              </Accordion>
              <Accordion
                label={
                  <FormattedMessage id="ui-calendar.calendarForm.category.exceptions" />
                }
              >
                <Field
                  name="exceptions"
                  component={ExceptionField}
                  fieldRefs={innerFieldRefs.current.exceptions}
                  error={errors?.exceptions}
                  localeTimeFormat={localeTimeFormat}
                  submitAttempted={props.submitAttempted}
                />
              </Accordion>
            </AccordionSet>
          </form>
        );
      }}
    />
  );
};

export default CreateCalendarForm;
