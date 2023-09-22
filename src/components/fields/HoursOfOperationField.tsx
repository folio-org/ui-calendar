import {
  Button,
  IconButton,
  Layout,
  MultiColumnList,
  MultiColumnListProps,
} from '@folio/stripes/components';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { useField } from 'react-final-form';
import { FieldArrayRenderProps } from 'react-final-form-arrays';
import { FormattedMessage, useIntl } from 'react-intl';
import css from './HoursAndExceptionFields.css';
import {
  HoursOfOperationRowState,
  MCLContentsType,
} from './HoursOfOperationFieldTypes';
import {
  getConflictError,
  isRowConflicted,
} from './HoursOfOperationFieldUtils';
import MCLRowFormatter from './MCLRowFormatter';
import OpenClosedSelect from './OpenClosedSelect';
import RowType from './RowType';
import TimeField from './TimeField';
import WeekdayPicker from './WeekdayPicker';

export interface HoursOfOperationFieldProps {
  values: FieldArrayRenderProps<
    HoursOfOperationRowState,
    HTMLElement
  >['fields'];
}

export default function HoursOfOperationField({
  values,
}: HoursOfOperationFieldProps) {
  const intl = useIntl();

  const fieldState = useField<HoursOfOperationRowState[]>('hours-of-operation');

  const contents: MultiColumnListProps<MCLContentsType, never>['contentData'] =
    values.map((name, index) => ({
      status: <OpenClosedSelect name={`${name}.type`} />,
      startDay: (
        <WeekdayPicker
          name={`${name}.startDay`}
          ariaLabel={intl.formatMessage({
            id: 'ui-calendar.calendarForm.openings.column.startDay',
          })}
        />
      ),
      startTime: (
        <TimeField
          name={`${name}.startTime`}
          display={values.value[index].type === RowType.Open}
        />
      ),
      endDay: (
        <WeekdayPicker
          name={`${name}.endDay`}
          ariaLabel={intl.formatMessage({
            id: 'ui-calendar.calendarForm.openings.column.endDay',
          })}
        />
      ),
      endTime: (
        <TimeField
          name={`${name}.endTime`}
          display={values.value[index].type === RowType.Open}
        />
      ),
      actions: (
        <Layout className="full flex centerContent">
          <IconButton icon="trash" onClick={() => values.remove(index)} />
        </Layout>
      ),
      isConflicted: isRowConflicted(fieldState.meta.error, index),
    }));

  contents.push({
    status: (
      <Button
        marginBottom0
        onClick={() => values.push({
          type: RowType.Open,
          startDay: undefined,
          startTime: undefined,
          endDay: undefined,
          endTime: undefined,
        })}
      >
        <FormattedMessage id="ui-calendar.calendarForm.addRowButton" />
      </Button>
    ),
    startDay: undefined,
    startTime: undefined,
    endDay: undefined,
    endTime: undefined,
    actions: undefined,
    isConflicted: false,
  });

  const conflictError: ReactNode = getConflictError(fieldState.meta.error);

  return (
    <>
      <MultiColumnList<MCLContentsType, 'isConflicted'>
        interactive={false}
        rowMetadata={['isConflicted']}
        columnIdPrefix="hours-of-operation"
        columnMapping={{
          status: (
            <FormattedMessage id="ui-calendar.calendarForm.openings.column.status" />
          ),
          startDay: (
            <FormattedMessage id="ui-calendar.calendarForm.openings.column.startDay" />
          ),
          startTime: (
            <FormattedMessage id="ui-calendar.calendarForm.openings.column.startTime" />
          ),
          endDay: (
            <FormattedMessage id="ui-calendar.calendarForm.openings.column.endDay" />
          ),
          endTime: (
            <FormattedMessage id="ui-calendar.calendarForm.openings.column.endTime" />
          ),
          actions: (
            <FormattedMessage id="ui-calendar.calendarForm.openings.column.actions" />
          ),
        }}
        columnWidths={{
          status: '14%',
          startDay: '20%',
          startTime: '20%',
          endDay: '20%',
          endTime: '20%',
          actions: '6%',
        }}
        contentData={contents}
        getCellClass={(defaultClasses, rowData) => {
          return classNames(defaultClasses, css.cellWrapper, {
            [css.conflictCell]: rowData.isConflicted,
          });
        }}
        rowFormatter={MCLRowFormatter<MCLContentsType>}
      />
      {conflictError}
    </>
  );
}
