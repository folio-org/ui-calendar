import {
  Button,
  Datepicker as DateField,
  Headline,
  Icon,
  IconButton,
  Layout,
  MultiColumnList,
  TextField,
} from "@folio/stripes-components";
import { MultiColumnListProps } from "@folio/stripes-components/types/lib/MultiColumnList/MultiColumnList";
import classNames from "classnames";
import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";
import { InnerFieldRefs } from "../../forms/CalendarForm/types";
import dayjs from "../../utils/dayjs";
import {
  ExceptionFieldErrors,
  ExceptionRowState,
  MCLContentsType,
} from "./ExceptionFieldTypes";
import cssHiddenErrorField from "./hiddenErrorField.css";
import css from "./HoursAndExceptionFields.css";
import HoursOfOperationFieldRowFormatter from "./MCLRowFormatter";
import OpenClosedSelect from "./OpenClosedSelect";
import RowType from "./RowType";
import TimeField from "./TimeField";

function updateRowState(
  rowStates: ExceptionRowState[],
  setRowStates: React.Dispatch<ExceptionRowState[]>,
  rowIndex: number,
  newState: Partial<ExceptionRowState>
) {
  const newRowState = [...rowStates];
  newRowState[rowIndex] = { ...newRowState[rowIndex], ...newState };
  setRowStates(newRowState);
}

function updateInnerRowState(
  rowStates: ExceptionRowState[],
  setRowStates: React.Dispatch<ExceptionRowState[]>,
  outerRowIndex: number,
  innerRowIndex: number,
  newState: Partial<ExceptionRowState["rows"][0]>
) {
  const newRowList = [...rowStates[outerRowIndex].rows];
  newRowList[innerRowIndex] = {
    ...newRowList[innerRowIndex],
    ...newState,
  };
  updateRowState(rowStates, setRowStates, outerRowIndex, { rows: newRowList });
}

export interface ExceptionFieldProps
  extends FieldRenderProps<ExceptionRowState[]> {
  fieldRefs: InnerFieldRefs["exceptions"];
  error?: ExceptionFieldErrors;
  // used in getDateTimeFields
  // eslint-disable-next-line react/no-unused-prop-types
  localeTimeFormat: string;
  submitAttempted: boolean;
}

function getDateTimeFields({
  props,
  row,
  innerRow,
  realIndex,
  innerRowRealIndex,
  fieldRefs,
  isDirty,
  rowStates,
  setRowStates,
}: {
  props: ExceptionFieldProps;
  row: ExceptionRowState;
  innerRow: ExceptionRowState["rows"][0];
  realIndex: number;
  innerRowRealIndex: number;
  fieldRefs: InnerFieldRefs["exceptions"];
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
    startDate: (
      <DateField
        key={`sd-${innerRow.i}`}
        className={classNames(
          {
            [css.conflictCell]:
              props.error?.intraConflicts?.[row.i]?.[innerRow.i],
          },
          cssHiddenErrorField.hiddenErrorFieldWrapper
        )}
        backendDateStandard="YYYY-MM-DD"
        marginBottom0
        required
        usePortal
        placement="auto"
        value={innerRow.startDate}
        inputRef={(el) => {
          fieldRefs.startDate[row.i][innerRow.i] = el;
        }}
        error={
          isDirty &&
          (props.error?.empty?.startDate?.[row.i]?.[innerRow.i] ||
            props.error?.invalid?.startDate?.[row.i]?.[innerRow.i])
        }
        onBlur={() => props.input.onBlur()}
        onChange={(_e, _formattedString, dateString) => {
          updateInnerRowState(
            rowStates,
            setRowStates,
            realIndex,
            innerRowRealIndex,
            { startDate: dateString }
          );
          props.input.onBlur();
        }}
      />
    ),
    startTime: (
      <TimeField
        key={`st-${innerRow.i}`}
        className={classNames({
          [css.conflictCell]:
            props.error?.intraConflicts?.[row.i]?.[innerRow.i],
        })}
        display={row.type === RowType.Open}
        value={innerRow.startTime}
        localeTimeFormat={props.localeTimeFormat}
        inputRef={(el) => {
          fieldRefs.startTime[row.i][innerRow.i] = el;
        }}
        error={
          isDirty &&
          (props.error?.empty?.startTime?.[row.i]?.[innerRow.i] ||
            props.error?.invalid?.startTime?.[row.i]?.[innerRow.i])
        }
        onBlur={props.input.onBlur}
        onChange={(newValue) =>
          updateInnerRowState(
            rowStates,
            setRowStates,
            realIndex,
            innerRowRealIndex,
            { startTime: newValue }
          )
        }
      />
    ),
    endDate: (
      <DateField
        key={`ed-${innerRow.i}`}
        className={classNames(
          {
            [css.conflictCell]:
              props.error?.intraConflicts?.[row.i]?.[innerRow.i],
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
        error={
          isDirty &&
          (props.error?.empty?.endDate?.[row.i]?.[innerRow.i] ||
            props.error?.invalid?.endDate?.[row.i]?.[innerRow.i])
        }
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
          [css.conflictCell]:
            props.error?.intraConflicts?.[row.i]?.[innerRow.i],
        })}
        display={row.type === RowType.Open}
        value={innerRow.endTime}
        localeTimeFormat={props.localeTimeFormat}
        inputRef={(el) => {
          fieldRefs.endTime[row.i][innerRow.i] = el;
        }}
        error={
          isDirty &&
          (props.error?.empty?.endTime?.[row.i]?.[innerRow.i] ||
            props.error?.invalid?.endTime?.[row.i]?.[innerRow.i])
        }
        onBlur={props.input.onBlur}
        onChange={(newValue) =>
          updateInnerRowState(
            rowStates,
            setRowStates,
            realIndex,
            innerRowRealIndex,
            { endTime: newValue }
          )
        }
      />
    ),
  };
}

export const ExceptionField: FunctionComponent<ExceptionFieldProps> = (
  props: ExceptionFieldProps
) => {
  /** Must add at least one empty row, or MCL will not render properly */
  const [rowStates, _setRowStates] = useState<ExceptionRowState[]>([]);

  const setRowStates = (newRowStates: ExceptionRowState[]) => {
    _setRowStates(newRowStates);
    props.input.onChange(newRowStates);
  };

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

    rows.sort((a, b) => {
      // start date is enough for equality as overlap on the same day is disallowed
      const aMin = dayjs.min(a.rows.map(({ startDate }) => dayjs(startDate)));
      const bMin = dayjs.min(b.rows.map(({ startDate }) => dayjs(startDate)));
      // don't care about == as that's an issue regardless, so order can be undefined there
      return aMin.isBefore(bMin) ? -1 : 1;
    });

    setRowStates(rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // controls whether empty/invalid error messages should be shown
  const isDirty = !!(props.submitAttempted || props.meta.touched);

  const contents: MultiColumnListProps<MCLContentsType, never>["contentData"] =
    rowStates.map((row, realIndex) => {
      if (!(row.i in fieldRefs.startDate)) {
        fieldRefs.startDate[row.i] = {};
        fieldRefs.startTime[row.i] = {};
        fieldRefs.endDate[row.i] = {};
        fieldRefs.endTime[row.i] = {};
      }
      const dateTimeFields = row.rows.map((innerRow, innerRowRealIndex) =>
        getDateTimeFields({
          props,
          row,
          innerRow,
          realIndex,
          innerRowRealIndex,
          fieldRefs,
          isDirty,
          rowStates,
          setRowStates,
        })
      );
      return {
        rowState: row,
        name: (
          <TextField
            marginBottom0
            required
            fullWidth
            value={row.name}
            onBlur={() => props.input.onBlur()}
            onChange={(e) =>
              updateRowState(rowStates, setRowStates, realIndex, {
                name: e.target.value,
              })
            }
            className={cssHiddenErrorField.hiddenErrorFieldWrapper}
            error={props.meta.touched && props.error?.empty?.name?.[row.i]}
          />
        ),
        status: (
          <OpenClosedSelect
            value={row.type}
            onBlur={props.input.onBlur}
            onChange={(newData: Partial<ExceptionRowState>) => {
              if (newData.type === RowType.Closed) {
                const minDate = dayjs.min(
                  row.rows.map(({ startDate }) => dayjs(startDate))
                );
                const maxDate = dayjs.max(
                  row.rows.map(({ endDate }) => dayjs(endDate))
                );
                newData.rows = [
                  {
                    i: row.lastRowI + 1,
                    startDate:
                      minDate === null
                        ? undefined
                        : minDate.format("YYYY-MM-DD"),
                    startTime: undefined,
                    endDate:
                      maxDate === null
                        ? undefined
                        : maxDate.format("YYYY-MM-DD"),
                    endTime: undefined,
                  },
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
                [css.disabledIconButton]: row.type === RowType.Closed,
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
                    endTime: undefined,
                  },
                ];
                updateRowState(rowStates, setRowStates, realIndex, {
                  rows: newRows,
                  lastRowI: row.lastRowI + 1,
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
        isConflicted: !!props.error?.interConflicts?.has(row.i),
      };
    });

  contents.push({
    rowState: {
      i: -1,
      name: "",
      type: RowType.Open,
      lastRowI: 0,
      rows: [],
    },
    name: (
      <Button
        marginBottom0
        onClick={() => {
          const newRowStates = [...rowStates];
          newRowStates.push({
            i: currentCount,
            type: RowType.Open,
            name: "",
            lastRowI: 0,
            rows: [
              {
                i: 0,
                startDate: undefined,
                startTime: undefined,
                endDate: undefined,
                endTime: undefined,
              },
            ],
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
    isConflicted: false,
  });

  let conflictError: ReactNode = null;
  if (
    props.error?.interConflicts?.size !== undefined &&
    props.error.interConflicts.size > 0
  ) {
    conflictError = (
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

  return (
    <>
      <MultiColumnList<MCLContentsType, "isConflicted" | "rowState">
        interactive={false}
        rowMetadata={["isConflicted", "rowState"]}
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
          name: "22%",
          status: "12%",
          startDate: "15%",
          startTime: "15%",
          endDate: "15%",
          endTime: "15%",
          actions: "6%",
        }}
        contentData={contents}
        getCellClass={(defaultClasses, rowData) =>
          classNames(defaultClasses, css.cellWrapper, {
            [css.conflictCell]: rowData.isConflicted,
          })
        }
        rowFormatter={HoursOfOperationFieldRowFormatter}
      />
      {conflictError}
    </>
  );
};

export default ExceptionField;
