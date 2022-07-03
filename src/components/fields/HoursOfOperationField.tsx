import {
  Button,
  Headline,
  Icon,
  IconButton,
  Layout,
  MultiColumnList,
} from "@folio/stripes-components";
import { MultiColumnListProps } from "@folio/stripes-components/types/lib/MultiColumnList/MultiColumnList";
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
import { FormattedMessage } from "react-intl";
import {
  getLocaleWeekdays,
  getWeekdaySpan,
  WEEKDAYS,
} from "../../data/CalendarUtils";
import { CalendarOpening, Weekday } from "../../types/types";
import { InnerFieldRefs } from "./formValidation";
import css from "./HoursAndExceptionFields.css";
import {
  HoursOfOperationErrors,
  HoursOfOperationRowState,
  MCLContentsType,
} from "./HoursOfOperationFieldTypes";
import MCLRowFormatter from "./MCLRowFormatter";
import OpenClosedSelect from "./OpenClosedSelect";
import RowType from "./RowType";
import TimeField from "./TimeField";
import WeekdayPicker from "./WeekdayPicker";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

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

function rowsToOpenings(
  providedRows: HoursOfOperationRowState[]
): CalendarOpening[] {
  const providedOpenings = providedRows
    .filter(
      (row): row is Required<HoursOfOperationRowState> =>
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

export interface HoursOfOperationFieldProps
  extends FieldRenderProps<HoursOfOperationRowState[]> {
  timeFieldRefs: InnerFieldRefs["hoursOfOperation"];
  error?: HoursOfOperationErrors;
  localeTimeFormat: string;
  submitAttempted: boolean;
  isNewCalendar: boolean;
}

export const HoursOfOperationField: FunctionComponent<
  HoursOfOperationFieldProps
> = (props: HoursOfOperationFieldProps) => {
  /** Must add at least one empty row, or MCL will not render properly */
  const [rowStates, _setRowStates] = useState<HoursOfOperationRowState[]>([
    {
      i: -1,
      type: RowType.Open,
      startDay: undefined,
      startTime: undefined,
      endDay: undefined,
      endTime: undefined,
    },
  ]);

  const setRowStates = (newRowStates: HoursOfOperationRowState[]) => {
    _setRowStates(newRowStates);
    props.input.onChange(newRowStates);
  };

  const timeFieldRefs = props.timeFieldRefs;

  const _currentCountState = useState(0);
  let currentCount = _currentCountState[0];
  const setCurrentCount = _currentCountState[1];

  // Initially sort and use values as source of rows
  useEffect(() => {
    const providedRows = [...props.input.value];

    // do nothing if there are no openings to render/parse
    if (props.isNewCalendar) {
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

    const rows: HoursOfOperationRowState[] = [];

    const weekdays = getLocaleWeekdays().map((weekday) => weekday.weekday);
    let openingIndex = 0;
    for (let weekdayIndex = 0; weekdayIndex < weekdays.length; weekdayIndex++) {
      if (weekdaysTouched[weekdays[weekdayIndex]]) {
        while (
          openingIndex < providedOpenings.length &&
          providedOpenings[openingIndex].startDay === weekdays[weekdayIndex]
        ) {
          rows.push({
            i: currentCount,
            type: RowType.Open,
            ...providedOpenings[openingIndex],
          });
          openingIndex++;
          currentCount++;
          setCurrentCount(currentCount);
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
          i: currentCount,
          startDay: weekdays[weekdayIndex],
          startTime: undefined,
          endDay: weekdays[endingWeekdayIndex],
          endTime: undefined,
        });

        currentCount++;
        setCurrentCount(currentCount);
      }
    }

    setRowStates(rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contents: MultiColumnListProps<MCLContentsType, never>["contentData"] =
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
            value={row.startDay}
            onChange={(newWeekday) => {
              updateRowState(rowStates, setRowStates, realIndex, {
                startDay: newWeekday,
              });
              props.input.onBlur();
            }}
            error={
              (props.submitAttempted || props.meta.touched) &&
              props.error?.empty?.startDay?.[row.i]
            }
          />
        ),
        startTime: (
          <TimeField
            display={row.type === RowType.Open}
            value={row.startTime}
            localeTimeFormat={props.localeTimeFormat}
            inputRef={(el) => {
              timeFieldRefs.startTime[row.i] = el;
            }}
            error={
              (props.submitAttempted || props.meta.touched) &&
              (props.error?.empty?.startTime?.[row.i] ||
                props.error?.invalidTimes?.startTime?.[row.i])
            }
            onBlur={props.input.onBlur}
            onChange={(newValue) =>
              updateRowState(rowStates, setRowStates, realIndex, {
                startTime: newValue,
              })
            }
          />
        ),
        endDay: (
          <WeekdayPicker
            value={row.endDay}
            onChange={(newWeekday) => {
              updateRowState(rowStates, setRowStates, realIndex, {
                endDay: newWeekday,
              });
              props.input.onBlur();
            }}
            error={
              (props.submitAttempted || props.meta.touched) &&
              props.error?.empty?.endDay?.[row.i]
            }
          />
        ),
        endTime: (
          <TimeField
            display={row.type === RowType.Open}
            value={row.endTime}
            localeTimeFormat={props.localeTimeFormat}
            inputRef={(el) => {
              timeFieldRefs.endTime[row.i] = el;
            }}
            error={
              (props.submitAttempted || props.meta.touched) &&
              (props.error?.empty?.endTime?.[row.i] ||
                props.error?.invalidTimes?.endTime?.[row.i])
            }
            onBlur={props.input.onBlur}
            onChange={(newValue) =>
              updateRowState(rowStates, setRowStates, realIndex, {
                endTime: newValue,
              })
            }
          />
        ),
        actions: (
          <Layout className="full flex centerContent">
            <IconButton
              icon="trash"
              onClick={() => {
                const newRowStates = [...rowStates];
                newRowStates.splice(realIndex, 1);
                delete timeFieldRefs.startTime[row.i];
                delete timeFieldRefs.endTime[row.i];
                setRowStates(newRowStates);
                props.input.onBlur();
              }}
            />
          </Layout>
        ),
        isConflicted: !!props.error?.conflicts?.has(row.i),
      };
    });

  contents.push({
    rowState: {
      i: -1,
      type: RowType.Open,
      startDay: undefined,
      startTime: undefined,
      endDay: undefined,
      endTime: undefined,
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
            endTime: undefined,
          });
          currentCount++;
          setCurrentCount(currentCount);
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
        <FormattedMessage id="ui-calendar.calendarForm.error.openingConflictError" />
      </Headline>
    );
  }

  return (
    <>
      <MultiColumnList<MCLContentsType, "isConflicted" | "rowState">
        interactive={false}
        rowMetadata={["isConflicted", "rowState"]}
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
        rowFormatter={MCLRowFormatter<MCLContentsType>}
      />
      {conflictError}
    </>
  );
};

export default HoursOfOperationField;
