import {
  Button,
  Datepicker,
  IconButton,
  Layout,
  MultiColumnList,
  MultiColumnListProps,
  TextField,
} from '@folio/stripes/components';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { Field, useField, useForm } from 'react-final-form';
import { FieldArrayRenderProps } from 'react-final-form-arrays';
import { FormattedMessage, useIntl } from 'react-intl';
import { FormValues } from '../../forms/CalendarForm/types';
import { ExceptionRowState, MCLContentsType } from './ExceptionFieldTypes';
import css from './HoursAndExceptionFields.css';
import HoursOfOperationFieldRowFormatter from './MCLRowFormatter';
import OpenClosedSelectExceptional from './OpenClosedSelectExceptional';
import RowType from './RowType';
import TimeField from './TimeField';
import cssHiddenErrorField from './hiddenErrorField.css';
import {
  getErrorDisplay,
  getMainConflictError,
  isInnerRowConflicted,
  isOuterRowConflicted,
} from './ExceptionFieldUtils';

export interface ExceptionFieldProps {
  values: FieldArrayRenderProps<ExceptionRowState, HTMLElement>['fields'];
}

export default function ExceptionField({ values }: ExceptionFieldProps) {
  const intl = useIntl();

  const form = useForm<FormValues>();
  const fieldState = useField<ExceptionRowState[]>('exceptions');

  const contents: MultiColumnListProps<MCLContentsType, never>['contentData'] =
    values.map((name, index) => ({
      name: (
        <Field
          component={TextField<string>}
          ariaLabel={intl.formatMessage({
            id: 'ui-calendar.calendarForm.exceptions.column.name',
          })}
          name={`${name}.name`}
          marginBottom0
          required
          fullWidth
          error={getErrorDisplay(fieldState.meta.error, index)}
        />
      ),
      status: (
        <OpenClosedSelectExceptional
          rowsName={`${name}.rows`}
          name={`${name}.type`}
        />
      ),
      startDate: (
        <Layout
          className={`full flex flex-direction-column ${css.fieldListWrapper}`}
        >
          {values.value[index].rows.map((_, innerIndex) => (
            <Field
              component={Datepicker}
              key={`${index}-${innerIndex}`}
              name={`${name}.rows[${innerIndex}].startDate`}
              className={classNames(
                {
                  [css.conflictCell]: isInnerRowConflicted(
                    fieldState.meta.error,
                    index,
                    innerIndex
                  ),
                },
                cssHiddenErrorField.hiddenErrorFieldWrapper
              )}
              backendDateStandard="YYYY-MM-DD"
              marginBottom0
              required
              usePortal
            />
          ))}
        </Layout>
      ),
      startTime: (
        <Layout
          className={`full flex flex-direction-column ${css.fieldListWrapper}`}
        >
          {values.value[index].rows.map((_, innerIndex) => (
            <TimeField
              key={`${index}-${innerIndex}`}
              name={`${name}.rows[${innerIndex}].startTime`}
              className={classNames({
                [css.conflictCell]: isInnerRowConflicted(
                  fieldState.meta.error,
                  index,
                  innerIndex
                ),
              })}
              display={values.value[index].type === RowType.Open}
            />
          ))}
        </Layout>
      ),
      endDate: (
        <Layout
          className={`full flex flex-direction-column ${css.fieldListWrapper}`}
        >
          {values.value[index].rows.map((_, innerIndex) => (
            <Field
              component={Datepicker}
              key={`${index}-${innerIndex}`}
              name={`${name}.rows[${innerIndex}].endDate`}
              className={classNames(
                {
                  [css.conflictCell]: isInnerRowConflicted(
                    fieldState.meta.error,
                    index,
                    innerIndex
                  ),
                },
                cssHiddenErrorField.hiddenErrorFieldWrapper
              )}
              backendDateStandard="YYYY-MM-DD"
              marginBottom0
              required
              usePortal
            />
          ))}
        </Layout>
      ),
      endTime: (
        <Layout
          className={`full flex flex-direction-column ${css.fieldListWrapper}`}
        >
          {values.value[index].rows.map((_, innerIndex) => (
            <TimeField
              key={`${index}-${innerIndex}`}
              name={`${name}.rows[${innerIndex}].endTime`}
              className={classNames({
                [css.conflictCell]: isInnerRowConflicted(
                  fieldState.meta.error,
                  index,
                  innerIndex
                ),
              })}
              display={values.value[index].type === RowType.Open}
            />
          ))}
        </Layout>
      ),
      actions: (
        <Layout className="full flex centerContent">
          <IconButton
            icon="plus-sign"
            aria-disabled={values.value[index].type === RowType.Closed}
            className={classNames({
              [css.disabledIconButton]:
                values.value[index].type === RowType.Closed,
            })}
            onClick={() => {
              if (values.value[index].type === RowType.Closed) return;
              form.mutators.push(`${name}.rows`, {
                startDate: undefined,
                startTime: undefined,
                endDate: undefined,
                endTime: undefined,
              });
            }}
          />
          <IconButton icon="trash" onClick={() => values.remove(index)} />
        </Layout>
      ),
      isConflicted: isOuterRowConflicted(fieldState.meta.error, index),
    }));

  contents.push({
    name: (
      <Button
        marginBottom0
        onClick={() => values.push({
          type: RowType.Open,
          name: '',
          rows: [
            {
              startDate: undefined,
              startTime: undefined,
              endDate: undefined,
              endTime: undefined,
            },
          ],
        })
        }
      >
        <FormattedMessage id="ui-calendar.calendarForm.addRowButton" />
      </Button>
    ),
    status: undefined,
    startDate: undefined,
    startTime: undefined,
    endDate: undefined,
    endTime: undefined,
    actions: undefined,
    isConflicted: false,
  });

  const conflictError: ReactNode = getMainConflictError(fieldState.meta.error);

  return (
    <>
      <MultiColumnList<MCLContentsType, 'isConflicted'>
        interactive={false}
        rowMetadata={['isConflicted']}
        columnIdPrefix="exceptions"
        columnMapping={{
          name: (
            <FormattedMessage id="ui-calendar.calendarForm.exceptions.column.name" />
          ),
          status: (
            <FormattedMessage id="ui-calendar.calendarForm.exceptions.column.status" />
          ),
          startDate: (
            <FormattedMessage id="ui-calendar.calendarForm.exceptions.column.startDate" />
          ),
          startTime: (
            <FormattedMessage id="ui-calendar.calendarForm.exceptions.column.startTime" />
          ),
          endDate: (
            <FormattedMessage id="ui-calendar.calendarForm.exceptions.column.endDate" />
          ),
          endTime: (
            <FormattedMessage id="ui-calendar.calendarForm.exceptions.column.endTime" />
          ),
          actions: (
            <FormattedMessage id="ui-calendar.calendarForm.exceptions.column.actions" />
          ),
        }}
        columnWidths={{
          name: '22%',
          status: '12%',
          startDate: '15%',
          startTime: '15%',
          endDate: '15%',
          endTime: '15%',
          actions: '6%',
        }}
        contentData={contents}
        getCellClass={(defaultClasses, rowData) => classNames(defaultClasses, css.cellWrapper, {
          [css.conflictCell]: rowData.isConflicted,
        })
        }
        rowFormatter={HoursOfOperationFieldRowFormatter}
      />
      {conflictError}
    </>
  );
}
