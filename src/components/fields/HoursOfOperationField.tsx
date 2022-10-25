import {
  Button,
  IconButton,
  Layout,
  MultiColumnList,
  MultiColumnListProps
} from '@folio/stripes/components';
import classNames from 'classnames';
import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useState
} from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { InnerFieldRefs } from '../../forms/CalendarForm/types';
import { useLocaleWeekdays } from '../../utils/WeekdayUtils';
import css from './HoursAndExceptionFields.css';
import {
  HoursOfOperationErrors,
  HoursOfOperationRowState,
  MCLContentsType
} from './HoursOfOperationFieldTypes';
import {
  calculateInitialRows,
  getConflictError,
  getTimeError,
  getWeekdayError,
  isRowConflicted
} from './HoursOfOperationFieldUtils';
import MCLRowFormatter from './MCLRowFormatter';
import OpenClosedSelect from './OpenClosedSelect';
import RowType from './RowType';
import TimeField from './TimeField';
import WeekdayPicker from './WeekdayPicker';

function updateRowState(
  rowStates: HoursOfOperationRowState[],
  setRowStates: React.Dispatch<HoursOfOperationRowState[]>,
  rowIndex: number,
  newState: Partial<HoursOfOperationRowState>
) {
  const newRowState = [...rowStates];
  newRowState[rowIndex] = { ...newRowState[rowIndex], ...newState };
  setRowStates(newRowState);
}

export interface HoursOfOperationFieldProps
  extends FieldRenderProps<HoursOfOperationRowState[]> {
  timeFieldRefs: InnerFieldRefs['hoursOfOperation'];
  error?: HoursOfOperationErrors;
  localeTimeFormat: string;
  submitAttempted: boolean;
  isNewCalendar: boolean;
}

export const HoursOfOperationField: FunctionComponent<
  HoursOfOperationFieldProps
> = (props: HoursOfOperationFieldProps) => {
  const intl = useIntl();
  const localeWeekdays = useLocaleWeekdays(intl);

  /** Must add at least one empty row, or MCL will not render properly */
  const [rowStates, _setRowStates] = useState<HoursOfOperationRowState[]>([
    {
      i: -1,
      type: RowType.Open,
      startDay: undefined,
      startTime: undefined,
      endDay: undefined,
      endTime: undefined
    }
  ]);

  const setRowStates = (newRowStates: HoursOfOperationRowState[]) => {
    _setRowStates(newRowStates);
    props.input.onChange(newRowStates);
  };

  // destructured separately as one is re-assignable
  const [currentCount, setCurrentCount] = useState<number>(0);

  // Initially sort and use values as source of rows
  useEffect(() => {
    // do nothing if there are no openings to render/parse
    if (props.isNewCalendar) {
      return;
    }

    const { rows, count } = calculateInitialRows(
      props.input.value,
      localeWeekdays
    );

    setRowStates(rows);
    setCurrentCount(count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localeWeekdays]);

  const contents: MultiColumnListProps<MCLContentsType, never>['contentData'] =
    rowStates.map((row, realIndex) => {
      return {
        rowState: row,
        status: (
          <OpenClosedSelect
            value={row.type}
            onBlur={props.input.onBlur}
            onChange={(newData: Partial<HoursOfOperationRowState>) => {
              if (newData.type === RowType.Closed) {
                newData.startTime = undefined;
                newData.endTime = undefined;
              }
              updateRowState(rowStates, setRowStates, realIndex, newData);
            }}
          />
        ),
        startDay: (
          <WeekdayPicker
            ariaLabel={intl.formatMessage({
              id: 'ui-calendar.calendarForm.openings.column.startDay'
            })}
            value={row.startDay}
            onChange={(newWeekday) => {
              updateRowState(rowStates, setRowStates, realIndex, {
                startDay: newWeekday
              });
              props.input.onBlur();
            }}
            error={getWeekdayError(
              'startDay',
              props.error,
              row.i,
              props.submitAttempted,
              props.meta.touched
            )}
          />
        ),
        startTime: (
          <TimeField
            display={row.type === RowType.Open}
            value={row.startTime}
            localeTimeFormat={props.localeTimeFormat}
            inputRef={(el) => {
              props.timeFieldRefs.startTime[row.i] = el;
            }}
            error={getTimeError(
              'startTime',
              props.error,
              row.i,
              props.submitAttempted,
              props.meta.touched
            )}
            onBlur={props.input.onBlur}
            onChange={(newValue) => updateRowState(rowStates, setRowStates, realIndex, {
              startTime: newValue
            })
            }
          />
        ),
        endDay: (
          <WeekdayPicker
            ariaLabel={intl.formatMessage({
              id: 'ui-calendar.calendarForm.openings.column.endDay'
            })}
            value={row.endDay}
            onChange={(newWeekday) => {
              updateRowState(rowStates, setRowStates, realIndex, {
                endDay: newWeekday
              });
              props.input.onBlur();
            }}
            error={getWeekdayError(
              'endDay',
              props.error,
              row.i,
              props.submitAttempted,
              props.meta.touched
            )}
          />
        ),
        endTime: (
          <TimeField
            display={row.type === RowType.Open}
            value={row.endTime}
            localeTimeFormat={props.localeTimeFormat}
            inputRef={(el) => {
              props.timeFieldRefs.endTime[row.i] = el;
            }}
            error={getTimeError(
              'endTime',
              props.error,
              row.i,
              props.submitAttempted,
              props.meta.touched
            )}
            onBlur={props.input.onBlur}
            onChange={(newValue) => {
              return updateRowState(rowStates, setRowStates, realIndex, {
                endTime: newValue
              });
            }}
          />
        ),
        actions: (
          <Layout className="full flex centerContent">
            <IconButton
              icon="trash"
              onClick={() => {
                const newRowStates = [...rowStates];
                newRowStates.splice(realIndex, 1);
                delete props.timeFieldRefs.startTime[row.i];
                delete props.timeFieldRefs.endTime[row.i];
                setRowStates(newRowStates);
                props.input.onBlur();
              }}
            />
          </Layout>
        ),
        isConflicted: isRowConflicted(props.error, row.i)
      };
    });

  contents.push({
    rowState: {
      i: -1,
      type: RowType.Open,
      startDay: undefined,
      startTime: undefined,
      endDay: undefined,
      endTime: undefined
    },
    status: (
      <Button
        marginBottom0
        onClick={() => {
          const newRowStates = [...rowStates];
          newRowStates.push({
            i: currentCount,
            type: RowType.Open,
            startDay: undefined,
            startTime: undefined,
            endDay: undefined,
            endTime: undefined
          });
          setCurrentCount(currentCount + 1);
          setRowStates(newRowStates);
        }}
      >
        <FormattedMessage id="ui-calendar.calendarForm.addRowButton" />
      </Button>
    ),
    startDay: undefined,
    startTime: undefined,
    endDay: undefined,
    endTime: undefined,
    actions: undefined,
    isConflicted: false
  });

  const conflictError: ReactNode = getConflictError(props.error);

  return (
    <>
      <MultiColumnList<MCLContentsType, 'isConflicted' | 'rowState'>
        interactive={false}
        rowMetadata={['isConflicted', 'rowState']}
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
          )
        }}
        columnWidths={{
          status: '14%',
          startDay: '20%',
          startTime: '20%',
          endDay: '20%',
          endTime: '20%',
          actions: '6%'
        }}
        contentData={contents}
        getCellClass={(defaultClasses, rowData) => {
          return classNames(defaultClasses, css.cellWrapper, {
            [css.conflictCell]: rowData.isConflicted
          });
        }}
        rowFormatter={MCLRowFormatter<MCLContentsType>}
      />
      {conflictError}
    </>
  );
};

export default HoursOfOperationField;
