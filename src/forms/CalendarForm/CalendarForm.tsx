import {
  Accordion,
  AccordionSet,
  Col,
  Datepicker,
  ExpandAllButton,
  Headline,
  Icon,
  Row,
  TextField,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import { FORM_ERROR } from 'final-form';
import React, { FunctionComponent } from 'react';
import { Field, FormRenderProps } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';
import ExceptionField from '../../components/fields/ExceptionField';
import { ExceptionRowState } from '../../components/fields/ExceptionFieldTypes';
import css from '../../components/fields/HoursAndExceptionFields.css';
import HoursOfOperationField from '../../components/fields/HoursOfOperationField';
import { HoursOfOperationRowState } from '../../components/fields/HoursOfOperationFieldTypes';
import RowType from '../../components/fields/RowType';
import ServicePointAssignmentField from '../../components/fields/ServicePointAssignmentField';
import DataRepository from '../../data/DataRepository';
import { FormValues } from './types';
import validate from './validation/validate';

export const FORM_ID = 'ui-calendar-create-calendar-form';

export interface CalendarFormProps {
  dataRepository: DataRepository;
}

export const CalendarForm: FunctionComponent<
  FormRenderProps<FormValues> & CalendarFormProps
> = ({
  handleSubmit,
  submitErrors,
  dataRepository,
}: FormRenderProps<FormValues> & CalendarFormProps) => {
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
    <form
      id={FORM_ID}
      onSubmit={async (e) => {
        await handleSubmit(e);
      }}
    >
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
                component={TextField<string>}
                autoFocus
                required
                name="name"
                label={
                  <FormattedMessage id="ui-calendar.calendarForm.field.name" />
                }
              />
            </Col>
            <Col xs={12} md={3}>
              <Field
                component={Datepicker}
                backendDateStandard="YYYY-MM-DD"
                required
                usePortal
                name="start-date"
                label={
                  <FormattedMessage id="ui-calendar.calendarForm.field.startDate" />
                }
              />
            </Col>
            <Col xs={12} md={3}>
              <Field
                component={Datepicker}
                backendDateStandard="YYYY-MM-DD"
                required
                usePortal
                name="end-date"
                label={
                  <FormattedMessage id="ui-calendar.calendarForm.field.endDate" />
                }
              />
            </Col>
          </Row>
          <ServicePointAssignmentField
            servicePoints={dataRepository.getServicePoints()}
            error={submitErrors?.['service-points']}
          />
        </Accordion>
        <Accordion
          label={
            <FormattedMessage id="ui-calendar.calendarForm.category.hoursOfOperation" />
          }
        >
          <FieldArray<HoursOfOperationRowState>
            name="hours-of-operation"
            defaultValue={[
              {
                type: RowType.Open,
                startDay: undefined,
                startTime: undefined,
                endDay: undefined,
                endTime: undefined,
              },
            ]}
          >
            {({ fields: values }) => <HoursOfOperationField values={values} />}
          </FieldArray>
        </Accordion>
        <Accordion
          label={
            <FormattedMessage id="ui-calendar.calendarForm.category.exceptions" />
          }
        >
          <FieldArray<ExceptionRowState> name="exceptions">
            {({ fields: values }) => <ExceptionField values={values} />}
          </FieldArray>
        </Accordion>
      </AccordionSet>
    </form>
  );
};

export default stripesFinalForm<CalendarFormProps, FormValues>({
  validateOnBlur: true,
  validate,
})(CalendarForm);
