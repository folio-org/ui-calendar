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

export type HoursOfOperationFieldProps = FieldRenderProps<
  Partial<CalendarOpening>[]
>;

interface MCLContentsType {
  status: ReactNode;
  startDay: ReactNode;
  startTime: ReactNode;
  endDay: ReactNode;
  endTime: ReactNode;
  actions: ReactNode;
}

enum RowType {
  Open = "open",
  Closed = "closed",
}

interface RowState {
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

export const HoursOfOperationField: FunctionComponent<
  HoursOfOperationFieldProps
> = (props: HoursOfOperationFieldProps) => {
  const [openings, setOpenings] = useState(
    Array.isArray(props.input?.value) ? props.input.value : []
  );
  /** Must add at least one empty row, or MCL will not render properly */
  const [rowStates, setRowStates] = useState<RowState[]>([
    { type: RowType.Open },
  ]);

  // Initially sort and use values as source of rows
  useEffect(() => {
    // do nothing if there are no openings to render/parse
    if (openings.length === 0) {
      return;
    }

    const newOpenings = [...openings] as CalendarOpening[];

    newOpenings.sort((a, b) => {
      if (a.startDay !== b.startDay) {
        return WEEKDAYS[a.startDay] - WEEKDAYS[b.startDay];
      }
      return a.startTime.localeCompare(b.endTime);
    });
    setOpenings(newOpenings);

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

    newOpenings.flatMap(getWeekdaySpan).forEach((weekday) => {
      weekdaysTouched[weekday] = true;
    });

    const rows: RowState[] = [];

    const weekdays = getLocaleWeekdays().map((weekday) => weekday.weekday);
    let openingIndex = 0;
    for (let weekdayIndex = 0; weekdayIndex < weekdays.length; weekdayIndex++) {
      if (weekdaysTouched[weekdays[weekdayIndex]]) {
        while (
          openingIndex < openings.length &&
          openings[openingIndex].startDay === weekdays[weekdayIndex]
        ) {
          rows.push({
            type: RowType.Open,

            ...openings[openingIndex],
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
            }}
          />
        ),
        startTime:
          row.type !== RowType.Closed ? (
            <TimeField
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
            }}
          />
        ),
        endTime:
          row.type !== RowType.Closed ? (
            <TimeField
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
      contentData={
        contents // contents
        // [
        //   ...Array(3).fill({
        //     status: (
        //       <Select<string>
        //         fullWidth
        //         marginBottom0
        //         dataOptions={[
        //           {
        //             value: "",
        //             label: "",
        //           },
        //           {
        //             value: "open",
        //             label: "Open",
        //           },
        //           {
        //             value: "closed",
        //             label: "Closed",
        //           },
        //         ]}
        //       />
        //     ),
        //     startDay: <WeekdayPicker />,
        //     startTime: <TimeField usePortal marginBottom0 />,
        //     endDay: <WeekdayPicker />,
        //     endTime: <TimeField usePortal marginBottom0 />,
        //     actions: (
        //       <Layout className="full flex flex-direction-row centerContent">
        //         <IconButton icon="trash" />
        //       </Layout>
        //     ),
        //   }),
        //   {
        //     status: (
        //       <Select<string>
        //         fullWidth
        //         marginBottom0
        //         dataOptions={[
        //           {
        //             value: "closed",
        //             label: "Closed",
        //           },
        //         ]}
        //       />
        //     ),
        //     startDay: <WeekdayPicker />,
        //     endDay: <WeekdayPicker />,
        //     actions: (
        //       <Layout className="full flex flex-direction-row centerContent">
        //         <IconButton icon="trash" />
        //       </Layout>
        //     ),
        //   },
        //   {
        //     status: <Button marginBottom0>Add row</Button>,
        //   },
        // ]
      }
    />
  );
};

export default HoursOfOperationField;
