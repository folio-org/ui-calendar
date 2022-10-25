import {
  Button,
  IconButton,
  Layout,
  MultiColumnList,
  MultiColumnListProps,
  TextField
} from '@folio/stripes/components';
import classNames from 'classnames';
import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useState
} from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ExceptionFieldProps } from '../../forms/CalendarForm/types';
import {
  dateFromYYYYMMDD,
  dateToYYYYMMDD,
  maxDate,
  minDate
} from '../../utils/DateUtils';
import { ExceptionRowState, MCLContentsType } from './ExceptionFieldTypes';
import {
  getDateTimeFields,
  getMainConflictError,
  getNameFieldError,
  isOuterRowConflicted,
  outerRowSorter,
  updateRowState
} from './ExceptionFieldUtils';
import cssHiddenErrorField from './hiddenErrorField.css';
import css from './HoursAndExceptionFields.css';
import HoursOfOperationFieldRowFormatter from './MCLRowFormatter';
import OpenClosedSelect from './OpenClosedSelect';
import RowType from './RowType';

export const ExceptionField: FunctionComponent<ExceptionFieldProps> = (
  props: ExceptionFieldProps
) => {
  /** Must add at least one empty row, or MCL will not render properly */
  const [rowStates, _setRowStates] = useState<ExceptionRowState[]>([]);

  const setRowStates = (newRowStates: ExceptionRowState[]) => {
    _setRowStates(newRowStates);
    props.input.onChange(newRowStates);
  };

  const intl = useIntl();

  const fieldRefs = props.fieldRefs;

  const _currentCountState = useState(0);
  let currentCount = _currentCountState[0];
  const setCurrentCount = _currentCountState[1];

  // Initially sort and use values as source of rows
  useEffect(() => {
    const rows = [...props.input.value];

    // do nothing if there are no openings to render/parse
    if (rows.length === 0) {
      return;
    }

    rows.sort(outerRowSorter);

    setRowStates(rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // controls whether empty/invalid error messages should be shown
  const isDirty = !!(props.submitAttempted || props.meta.touched);

  const contents: MultiColumnListProps<MCLContentsType, never>['contentData'] =
    rowStates.map((row, realIndex) => {
      if (!(row.i in fieldRefs.startDate)) {
        fieldRefs.startDate[row.i] = {};
        fieldRefs.startTime[row.i] = {};
        fieldRefs.endDate[row.i] = {};
        fieldRefs.endTime[row.i] = {};
      }
      const dateTimeFields = row.rows.map((innerRow, innerRowRealIndex) => {
        return getDateTimeFields({
          props,
          row,
          innerRow,
          realIndex,
          innerRowRealIndex,
          fieldRefs,
          isDirty,
          rowStates,
          setRowStates
        });
      });
      return {
        rowState: row,
        name: (
          <TextField
            ariaLabel={intl.formatMessage({ id: 'ui-calendar.calendarForm.exceptions.column.name' })}
            marginBottom0
            required
            fullWidth
            value={row.name}
            onBlur={() => props.input.onBlur()}
            onChange={(e) => {
              updateRowState(rowStates, setRowStates, realIndex, {
                name: e.target.value
              });
            }}
            className={cssHiddenErrorField.hiddenErrorFieldWrapper}
            error={getNameFieldError(props.meta.touched, props.error, row.i)}
          />
        ),
        status: (
          <OpenClosedSelect
            value={row.type}
            onBlur={props.input.onBlur}
            onChange={(newData: Partial<ExceptionRowState>) => {
              if (newData.type === RowType.Closed) {
                const min = minDate(
                  row.rows
                    .filter(({ startDate }) => startDate !== undefined)
                    .map(({ startDate }) => dateFromYYYYMMDD(startDate as string))
                );
                const max = maxDate(
                  row.rows
                    .filter(({ endDate }) => endDate !== undefined)
                    .map(({ endDate }) => dateFromYYYYMMDD(endDate as string))
                );
                newData.rows = [
                  {
                    i: row.lastRowI + 1,
                    startDate: min === null ? undefined : dateToYYYYMMDD(min),
                    startTime: undefined,
                    endDate: max === null ? undefined : dateToYYYYMMDD(max),
                    endTime: undefined
                  }
                ];
              }
              updateRowState(rowStates, setRowStates, realIndex, newData);
            }}
          />
        ),
        startDate: (
          <Layout
            className={`full flex flex-direction-column ${css.fieldListWrapper}`}
          >
            {dateTimeFields.map((r) => r.startDate)}
          </Layout>
        ),
        startTime: (
          <Layout
            className={`full flex flex-direction-column ${css.fieldListWrapper}`}
          >
            {dateTimeFields.map((r) => r.startTime)}
          </Layout>
        ),
        endDate: (
          <Layout
            className={`full flex flex-direction-column ${css.fieldListWrapper}`}
          >
            {dateTimeFields.map((r) => r.endDate)}
          </Layout>
        ),
        endTime: (
          <Layout
            className={`full flex flex-direction-column ${css.fieldListWrapper}`}
          >
            {dateTimeFields.map((r) => r.endTime)}
          </Layout>
        ),
        actions: (
          <Layout className="full flex centerContent">
            <IconButton
              icon="plus-sign"
              aria-disabled={row.type === RowType.Closed}
              className={classNames({
                [css.disabledIconButton]: row.type === RowType.Closed
              })}
              onClick={() => {
                if (row.type === RowType.Closed) return;
                const newRows = [
                  ...row.rows,
                  {
                    i: row.lastRowI + 1,
                    startDate: undefined,
                    startTime: undefined,
                    endDate: undefined,
                    endTime: undefined
                  }
                ];
                updateRowState(rowStates, setRowStates, realIndex, {
                  rows: newRows,
                  lastRowI: row.lastRowI + 1
                });
              }}
            />
            <IconButton
              icon="trash"
              onClick={() => {
                const newRowStates = [...rowStates];
                newRowStates.splice(realIndex, 1);
                setRowStates(newRowStates);
                props.input.onBlur();
              }}
            />
          </Layout>
        ),
        isConflicted: isOuterRowConflicted(props.error, row.i)
      };
    });

  contents.push({
    rowState: {
      i: -1,
      name: '',
      type: RowType.Open,
      lastRowI: 0,
      rows: []
    },
    name: (
      <Button
        marginBottom0
        onClick={() => {
          const newRowStates = [...rowStates];
          newRowStates.push({
            i: currentCount,
            type: RowType.Open,
            name: '',
            lastRowI: 0,
            rows: [
              {
                i: 0,
                startDate: undefined,
                startTime: undefined,
                endDate: undefined,
                endTime: undefined
              }
            ]
          });
          currentCount++;
          setCurrentCount(currentCount);
          setRowStates(newRowStates);
        }}
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
    isConflicted: false
  });

  const conflictError: ReactNode = getMainConflictError(props.error);

  return (
    <>
      <MultiColumnList<MCLContentsType, 'isConflicted' | 'rowState'>
        interactive={false}
        rowMetadata={['isConflicted', 'rowState']}
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
          )
        }}
        columnWidths={{
          name: '22%',
          status: '12%',
          startDate: '15%',
          startTime: '15%',
          endDate: '15%',
          endTime: '15%',
          actions: '6%'
        }}
        contentData={contents}
        getCellClass={(defaultClasses, rowData) => classNames(defaultClasses, css.cellWrapper, {
          [css.conflictCell]: rowData.isConflicted
        })
        }
        rowFormatter={HoursOfOperationFieldRowFormatter}
      />
      {conflictError}
    </>
  );
};

export default ExceptionField;
