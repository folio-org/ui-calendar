import {
  Datepicker as DateField,
  Headline,
  Icon
} from '@folio/stripes/components';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  ExceptionFieldProps,
  InnerFieldRefs
} from '../../forms/CalendarForm/types';
import { dateCompare, dateFromYYYYMMDD, minDate } from '../../utils/DateUtils';
import { ExceptionFieldErrors, ExceptionRowState } from './ExceptionFieldTypes';
import cssHiddenErrorField from './hiddenErrorField.css';
import css from './HoursAndExceptionFields.css';
import RowType from './RowType';
import TimeField from './TimeField';

export function updateRowState(
  rowStates: ExceptionRowState[],
  setRowStates: React.Dispatch<ExceptionRowState[]>,
  rowIndex: number,
  newState: Partial<ExceptionRowState>
) {
  const newRowState = [...rowStates];
  newRowState[rowIndex] = { ...newRowState[rowIndex], ...newState };
  setRowStates(newRowState);
}

export function updateInnerRowState(
  rowStates: ExceptionRowState[],
  setRowStates: React.Dispatch<ExceptionRowState[]>,
  outerRowIndex: number,
  innerRowIndex: number,
  newState: Partial<ExceptionRowState['rows'][0]>
) {
  const newRowList = [...rowStates[outerRowIndex].rows];
  newRowList[innerRowIndex] = {
    ...newRowList[innerRowIndex],
    ...newState
  };
  updateRowState(rowStates, setRowStates, outerRowIndex, { rows: newRowList });
}

export function isInnerRowConflicted(
  error: ExceptionFieldErrors | undefined,
  outerRowI: number,
  innerRowI: number
): boolean {
  return !!error?.intraConflicts?.[outerRowI]?.has(innerRowI);
}

export function isOuterRowConflicted(
  error: ExceptionFieldErrors | undefined,
  outerRowI: number
): boolean {
  return !!error?.interConflicts?.has(outerRowI);
}

export function getInnerRowError(
  isDirty: boolean,
  error: ExceptionFieldErrors | undefined,
  outerRowI: number,
  innerRowI: number,
  field: 'startDate' | 'startTime' | 'endDate' | 'endTime'
): ReactNode {
  if (!isDirty) return undefined;

  return (
    error?.empty?.[field]?.[outerRowI]?.[innerRowI] ||
    error?.invalid?.[field]?.[outerRowI]?.[innerRowI]
  );
}

export function outerRowSorter(a: ExceptionRowState, b: ExceptionRowState) {
  // start date is enough for equality as overlap on the same day is disallowed
  const aMin = minDate(
    a.rows
      .filter(({ startDate }) => startDate !== undefined)
      .map(({ startDate }) => dateFromYYYYMMDD(startDate as string))
  );
  const bMin = minDate(
    b.rows
      .filter(({ startDate }) => startDate !== undefined)
      .map(({ startDate }) => dateFromYYYYMMDD(startDate as string))
  );

  return dateCompare(aMin, bMin);
}

export function getMainConflictError(
  error: ExceptionFieldErrors | undefined
): ReactNode {
  if (
    error?.interConflicts?.size !== undefined &&
    error.interConflicts.size > 0
  ) {
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

export function getNameFieldError(
  touched: boolean | undefined,
  error: ExceptionFieldErrors | undefined,
  outerRowI: number
): ReactNode {
  if (!touched) return undefined;

  return error?.empty?.name?.[outerRowI];
}

export function getDateField(
  key: 'startDate' | 'endDate',
  row: ExceptionRowState,
  innerRow: ExceptionRowState['rows'][0],
  isDirty: boolean,
  { error, fieldRefs, input }: ExceptionFieldProps,
  onChange: (dateString: string) => void
) {
  return (
    <DateField
      key={`sd-${innerRow.i}`}
      className={classNames(
        {
          [css.conflictCell]: isInnerRowConflicted(error, row.i, innerRow.i)
        },
        cssHiddenErrorField.hiddenErrorFieldWrapper
      )}
      backendDateStandard="YYYY-MM-DD"
      marginBottom0
      required
      usePortal
      placement="auto"
      value={innerRow[key]}
      inputRef={(el) => {
        fieldRefs[key][row.i][innerRow.i] = el;
      }}
      error={getInnerRowError(isDirty, error, row.i, innerRow.i, 'startDate')}
      onBlur={() => input.onBlur()}
      onChange={(_e, _formattedString, dateString) => onChange(dateString)}
    />
  );
}

export function getDateTimeFields({
  props,
  row,
  innerRow,
  realIndex,
  innerRowRealIndex,
  fieldRefs,
  isDirty,
  rowStates,
  setRowStates
}: {
  props: ExceptionFieldProps;
  row: ExceptionRowState;
  innerRow: ExceptionRowState['rows'][0];
  realIndex: number;
  innerRowRealIndex: number;
  fieldRefs: InnerFieldRefs['exceptions'];
  isDirty: boolean;
  rowStates: ExceptionRowState[];
  setRowStates: (newRowStates: ExceptionRowState[]) => void;
}): {
  startDate: ReactNode;
  startTime: ReactNode;
  endDate: ReactNode;
  endTime: ReactNode;
} {
  return {
    startDate: getDateField(
      'startDate',
      row,
      innerRow,
      isDirty,
      props,
      (dateString) => {
        updateInnerRowState(
          rowStates,
          setRowStates,
          realIndex,
          innerRowRealIndex,
          { startDate: dateString }
        );
        props.input.onBlur();
      }
    ),
    startTime: (
      <TimeField
        key={`st-${innerRow.i}`}
        className={classNames({
          [css.conflictCell]: isInnerRowConflicted(
            props.error,
            row.i,
            innerRow.i
          )
        })}
        display={row.type === RowType.Open}
        value={innerRow.startTime}
        localeTimeFormat={props.localeTimeFormat}
        inputRef={(el) => {
          fieldRefs.startTime[row.i][innerRow.i] = el;
        }}
        error={getInnerRowError(
          isDirty,
          props.error,
          row.i,
          innerRow.i,
          'startTime'
        )}
        onBlur={props.input.onBlur}
        onChange={(newValue) => {
          updateInnerRowState(
            rowStates,
            setRowStates,
            realIndex,
            innerRowRealIndex,
            { startTime: newValue }
          );
        }}
      />
    ),
    endDate: (
      <DateField
        key={`ed-${innerRow.i}`}
        className={classNames(
          {
            [css.conflictCell]: isInnerRowConflicted(
              props.error,
              row.i,
              innerRow.i
            )
          },
          cssHiddenErrorField.hiddenErrorFieldWrapper
        )}
        backendDateStandard="YYYY-MM-DD"
        marginBottom0
        required
        usePortal
        placement="auto"
        value={innerRow.endDate}
        inputRef={(el) => {
          fieldRefs.endDate[row.i][innerRow.i] = el;
        }}
        error={getInnerRowError(
          isDirty,
          props.error,
          row.i,
          innerRow.i,
          'endDate'
        )}
        onBlur={() => props.input.onBlur()}
        onChange={(_e, _formattedString, dateString) => {
          updateInnerRowState(
            rowStates,
            setRowStates,
            realIndex,
            innerRowRealIndex,
            { endDate: dateString }
          );
          props.input.onBlur();
        }}
      />
    ),
    endTime: (
      <TimeField
        key={`et-${innerRow.i}`}
        className={classNames({
          [css.conflictCell]: isInnerRowConflicted(
            props.error,
            row.i,
            innerRow.i
          )
        })}
        display={row.type === RowType.Open}
        value={innerRow.endTime}
        localeTimeFormat={props.localeTimeFormat}
        inputRef={(el) => {
          fieldRefs.endTime[row.i][innerRow.i] = el;
        }}
        error={getInnerRowError(
          isDirty,
          props.error,
          row.i,
          innerRow.i,
          'endTime'
        )}
        onBlur={props.input.onBlur}
        onChange={(newValue) => {
          updateInnerRowState(
            rowStates,
            setRowStates,
            realIndex,
            innerRowRealIndex,
            { endTime: newValue }
          );
        }}
      />
    )
  };
}
