import {
  Button,
  IconButton,
  Layout,
  MultiColumnList,
  Select,
  Timepicker as TimeField,
} from "@folio/stripes-components";
import { MultiColumnListProps } from "@folio/stripes-components/types/lib/MultiColumnList/MultiColumnList";
import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { FieldRenderProps } from "react-final-form";
import { CalendarOpening, Weekday } from "../types/types";
import { getLocaleWeekdays, getWeekdaySpan, WEEKDAYS } from "./CalendarUtils";
import WeekdayPicker from "./WeekdayPicker";

interface MCLContentsType {
  status: ReactNode;
  startDay: ReactNode;
  startTime: ReactNode;
  endDay: ReactNode;
  endTime: ReactNode;
  actions: ReactNode;
}

export enum RowType {
  Open = "open",
  Closed = "closed",
}

export interface RowState {
  type: RowType;
  startDay?: Weekday;
  startTime?: string;
  endDay?: Weekday;
  endTime?: string;
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
        startDay: row.startDay,
        startTime: row.startTime,
        endDay: row.endDay,
        endTime: row.endTime,
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

export type HoursOfOperationFieldProps = FieldRenderProps<RowState[]>;

export const HoursOfOperationField: FunctionComponent<
  HoursOfOperationFieldProps
> = (props: HoursOfOperationFieldProps) => {
  /** Must add at least one empty row, or MCL will not render properly */
  const [rowStates, _setRowStates] = useState<RowState[]>([
    { type: RowType.Open },
  ]);

  const setRowStates = (newRowStates: RowState[]) => {
    _setRowStates(newRowStates);
    props.input.onChange(newRowStates);
  };

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
          endDay: weekdays[endingWeekdayIndex],
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
          />
        ),
        startTime:
          row.type !== RowType.Closed ? (
            <TimeField
              required
              input={{
                value: row.startTime,
                onChange: (newTime: string) => {
                  rowStateUpdater(i, {
                    startTime: newTime.length
                      ? newTime.substring(0, 5)
                      : undefined,
                  });
                },
              }}
              // always fires, compared to input.onChange
              onChange={() => props.input.onBlur()}
              usePortal
              marginBottom0
            />
          ) : null,
        endDay: (
          <WeekdayPicker
            value={row.endDay}
            onChange={(newWeekday) => {
              rowStateUpdater(i, {
                endDay: newWeekday,
              });
              props.input.onBlur();
            }}
          />
        ),
        endTime:
          row.type !== RowType.Closed ? (
            <TimeField
              required
              input={{
                value: row.endTime,
                onChange: (newTime: string) => {
                  rowStateUpdater(i, {
                    endTime: newTime.length
                      ? newTime.substring(0, 5)
                      : undefined,
                  });
                },
              }}
              // always fires, compared to input.onChange
              onChange={() => props.input.onBlur()}
              usePortal
              marginBottom0
            />
          ) : null,
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
  });

  return (
    <MultiColumnList<MCLContentsType>
      interactive={false}
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
    />
  );
};

export default HoursOfOperationField;
