import {
  Button,
  Headline,
  Icon,
  IconButton,
  Layout,
  MultiColumnList,
  Select,
  Timepicker as TimeField,
} from "@folio/stripes-components";
import { MultiColumnListProps } from "@folio/stripes-components/types/lib/MultiColumnList/MultiColumnList";
import { RequireExactlyOne } from "@folio/stripes-components/types/utils";
import classNames from "classnames";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { FieldRenderProps } from "react-final-form";
import { CalendarOpening, Weekday } from "../types/types";
import { getLocaleWeekdays, getWeekdaySpan, WEEKDAYS } from "./CalendarUtils";
import css from "./HoursOfOperationField.css";
import WeekdayPicker from "./WeekdayPicker";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

interface MCLContentsType {
  status: ReactNode;
  startDay: ReactNode;
  startTime: ReactNode;
  endDay: ReactNode;
  endTime: ReactNode;
  actions: ReactNode;
  isConflicted: boolean;
}

export enum RowType {
  Open = "open",
  Closed = "closed",
}

export interface RowState {
  type: RowType;
  startDay: Weekday | undefined;
  startTime: string | undefined;
  endDay: Weekday | undefined;
  endTime: string | undefined;
}

function updateRowState(
  rowStates: RowState[],
  setRowStates: React.Dispatch<RowState[]>,
  rowIndex: number,
  newState: Partial<RowState>
) {
  const newRowState = [...rowStates];
  newRowState[rowIndex] = { ...newRowState[rowIndex], ...newState };
  setRowStates(newRowState);
}

function rowsToOpenings(providedRows: RowState[]): CalendarOpening[] {
  const providedOpenings = providedRows
    .filter(
      (row): row is Required<RowState> =>
        row.startDay !== undefined &&
        row.startTime !== undefined &&
        row.endDay !== undefined &&
        row.endTime !== undefined
    )
    .map(
      (row): CalendarOpening => ({
        startDay: row.startDay as Weekday,
        startTime: row.startTime as string,
        endDay: row.endDay as Weekday,
        endTime: row.endTime as string,
      })
    );

  providedOpenings.sort((a, b) => {
    if (a.startDay !== b.startDay) {
      return WEEKDAYS[a.startDay] - WEEKDAYS[b.startDay];
    }
    return a.startTime.localeCompare(b.endTime);
  });

  return providedOpenings;
}

function noOp() {
  /* no-op */
}

function getTimeField(
  i: number,
  row: RowState,
  key: "startTime" | "endTime",
  rowStateUpdater: (rowIndex: number, newState: Partial<RowState>) => void,
  timeFieldRefs: { startTime: HTMLInputElement[]; endTime: HTMLInputElement[] },
  props: HoursOfOperationFieldProps
): ReactNode {
  if (row.type === RowType.Closed) return null;

  const error =
    props.meta.touched &&
    (props.error?.empty?.[key]?.[i] || props.error?.invalidTimes?.[key]?.[i]);

  return (
    <div className={css.timeFieldWrapper} title={error?.toString()}>
      <TimeField
        required
        input={{
          value: row[key] === undefined ? "" : (row[key] as string),
          name: "",
          onBlur: noOp,
          onFocus: noOp,
          onChange: (newTime: string) => {
            const input = timeFieldRefs[key][i];
            const selection = input.selectionStart;
            input.value = dayjs(newTime, "HH:mm").format(
              props.localeTimeFormat
            );
            input.setSelectionRange(selection, selection);
            rowStateUpdater(i, {
              [key]: newTime.length ? newTime.substring(0, 5) : undefined,
            });
          },
        }}
        // always fires, compared to input.onChange
        onChange={() => props.input.onBlur()}
        inputRef={(el) => {
          timeFieldRefs[key][i] = el;
        }}
        marginBottom0
        usePortal
        meta={{
          touched: true,
          error,
        }}
      />
    </div>
  );
}

export type HoursOfOperationErrors = RequireExactlyOne<{
  empty?: {
    [field in keyof Omit<RowState, "type">]: Record<number, ReactNode>;
  };
  invalidTimes?: {
    [field in "startTime" | "endTime"]: Record<number, ReactNode>;
  };
  conflicts?: Set<number>;
}>;

export interface HoursOfOperationFieldProps
  extends FieldRenderProps<RowState[]> {
  timeFieldRefs: {
    startTime: HTMLInputElement[];
    endTime: HTMLInputElement[];
  };
  error?: HoursOfOperationErrors;
  // used by function
  // eslint-disable-next-line react/no-unused-prop-types
  localeTimeFormat: string;
}

export const HoursOfOperationField: FunctionComponent<
  HoursOfOperationFieldProps
> = (props: HoursOfOperationFieldProps) => {
  console.table(props.error);
  /** Must add at least one empty row, or MCL will not render properly */
  const [rowStates, _setRowStates] = useState<RowState[]>([
    {
      type: RowType.Open,
      startDay: undefined,
      startTime: undefined,
      endDay: undefined,
      endTime: undefined,
    },
  ]);

  const setRowStates = (newRowStates: RowState[]) => {
    _setRowStates(newRowStates);
    props.input.onChange(newRowStates);
  };

  const timeFieldRefs = props.timeFieldRefs;

  // Initially sort and use values as source of rows
  useEffect(() => {
    const providedRows = [...props.input.value];

    // do nothing if there are no openings to render/parse
    if (providedRows.length === 0) {
      return;
    }

    const providedOpenings = rowsToOpenings(providedRows);

    // Find all weekdays
    const weekdaysTouched: Record<Weekday, boolean> = {
      SUNDAY: false,
      MONDAY: false,
      TUESDAY: false,
      WEDNESDAY: false,
      THURSDAY: false,
      FRIDAY: false,
      SATURDAY: false,
    };

    providedOpenings.flatMap(getWeekdaySpan).forEach((weekday) => {
      weekdaysTouched[weekday] = true;
    });

    const rows: RowState[] = [];

    const weekdays = getLocaleWeekdays().map((weekday) => weekday.weekday);
    let openingIndex = 0;
    for (let weekdayIndex = 0; weekdayIndex < weekdays.length; weekdayIndex++) {
      if (weekdaysTouched[weekdays[weekdayIndex]]) {
        while (
          openingIndex < providedOpenings.length &&
          providedOpenings[openingIndex].startDay === weekdays[weekdayIndex]
        ) {
          rows.push({
            type: RowType.Open,

            ...providedOpenings[openingIndex],
          });
          openingIndex++;
        }
      } else {
        let endingWeekdayIndex = weekdayIndex;
        // while the days after this one have not been touched
        while (
          endingWeekdayIndex + 1 < weekdays.length &&
          !weekdaysTouched[weekdays[endingWeekdayIndex + 1]]
        ) {
          endingWeekdayIndex++;
          // touch them to prevent double loops in future
          weekdaysTouched[weekdays[endingWeekdayIndex]] = true;
        }
        rows.push({
          type: RowType.Closed,
          startDay: weekdays[weekdayIndex],
          startTime: undefined,
          endDay: weekdays[endingWeekdayIndex],
          endTime: undefined,
        });
      }
    }

    setRowStates(rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rowStateUpdater = updateRowState.bind(this, rowStates, setRowStates);

  const contents: MultiColumnListProps<MCLContentsType, never>["contentData"] =
    rowStates.map((row, i) => {
      return {
        status: (
          <Select<RowType>
            required
            fullWidth
            marginBottom0
            dataOptions={[
              {
                value: RowType.Open,
                label: "Open",
              },
              {
                value: RowType.Closed,
                label: "Closed",
              },
            ]}
            value={row.type}
            onInput={(e) => {
              const newType = (e.target as HTMLSelectElement).value as RowType;
              const newProps: Partial<RowState> = { type: newType };
              if (newType === RowType.Closed) {
                newProps.startTime = undefined;
                newProps.endTime = undefined;
              }
              rowStateUpdater(i, newProps);
              props.input.onBlur();
            }}
          />
        ),
        startDay: (
          <WeekdayPicker
            value={row.startDay}
            onChange={(newWeekday) => {
              rowStateUpdater(i, {
                startDay: newWeekday,
              });
              props.input.onBlur();
            }}
            error={props.error?.empty?.startDay?.[i]}
          />
        ),
        startTime: getTimeField(
          i,
          row,
          "startTime",
          rowStateUpdater,
          timeFieldRefs,
          props
        ),
        endDay: (
          <WeekdayPicker
            value={row.endDay}
            onChange={(newWeekday) => {
              rowStateUpdater(i, {
                endDay: newWeekday,
              });
              props.input.onBlur();
            }}
            error={props.error?.empty?.endDay?.[i]}
          />
        ),
        endTime: getTimeField(
          i,
          row,
          "endTime",
          rowStateUpdater,
          timeFieldRefs,
          props
        ),
        actions: (
          <Layout className="full flex flex-direction-row centerContent">
            <IconButton
              icon="trash"
              onClick={() => {
                const newRowStates = [...rowStates];
                newRowStates.splice(i, 1);
                setRowStates(newRowStates);
                props.input.onBlur();
              }}
            />
          </Layout>
        ),
        isConflicted: !!props.error?.conflicts?.has(i),
      };
    });

  contents.push({
    status: (
      <Button
        marginBottom0
        onClick={() => {
          const newRowStates = [...rowStates];
          newRowStates.push({
            type: RowType.Open,
            startDay: undefined,
            startTime: undefined,
            endDay: undefined,
            endTime: undefined,
          });
          setRowStates(newRowStates);
        }}
      >
        Add row
      </Button>
    ),
    startDay: undefined,
    startTime: undefined,
    endDay: undefined,
    endTime: undefined,
    actions: undefined,
    isConflicted: false,
  });

  let conflictError: ReactNode = null;
  if (
    props.error?.conflicts?.size !== undefined &&
    props.error.conflicts.size > 0
  ) {
    conflictError = (
      <Headline
        margin="none"
        className={css.conflictMessage}
        weight="medium"
        size="medium"
      >
        <Icon icon="exclamation-circle" status="error" />
        Some openings have conflicts
      </Headline>
    );
  }

  return (
    <>
      <MultiColumnList<MCLContentsType, "isConflicted">
        interactive={false}
        rowMetadata={["isConflicted"]}
        columnMapping={{
          status: "Status",
          startDay: "Start day",
          startTime: "Start time",
          endDay: "End day",
          endTime: "End time",
          actions: "Actions",
        }}
        columnWidths={{
          status: "14%",
          startDay: "20%",
          startTime: "20%",
          endDay: "20%",
          endTime: "20%",
          actions: "6%",
        }}
        contentData={contents}
        getCellClass={(defaultClasses, rowData) =>
          classNames(defaultClasses, css.cellWrapper, {
            [css.conflictCell]: rowData.isConflicted,
          })
        }
      />
      {conflictError}
    </>
  );
};

export default HoursOfOperationField;
