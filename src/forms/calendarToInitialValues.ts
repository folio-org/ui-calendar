import { ExceptionRowState } from '../components/fields/ExceptionFieldTypes';
import { HoursOfOperationRowState } from '../components/fields/HoursOfOperationFieldTypes';
import RowType from '../components/fields/RowType';
import DataRepository from '../data/DataRepository';
import {
  CalendarException,
  Calendar,
  CalendarOpening,
  Weekday,
} from '../types/types';
import {
  LocaleWeekdayInfo,
  WEEKDAYS,
  getWeekdaySpan,
} from '../utils/WeekdayUtils';
import { FormValues } from './CalendarForm/types';

export function addZToHours(
  rows: HoursOfOperationRowState[]
): HoursOfOperationRowState[] {
  return rows.map((row) => ({
    ...row,
    startTime: row.startTime ? `${row.startTime}Z` : undefined,
    endTime: row.endTime ? `${row.endTime}Z` : undefined,
  }));
}

export function addZToExceptions(
  rows: ExceptionRowState[]
): ExceptionRowState[] {
  return rows.map((row) => ({
    ...row,
    rows: row.rows.map((innerRow) => ({
      ...innerRow,
      startTime: innerRow.startTime ? `${innerRow.startTime}Z` : undefined,
      endTime: innerRow.endTime ? `${innerRow.endTime}Z` : undefined,
    })),
  }));
}

/** Sort provided rows and coerce to calendar openings */
export function sortOpenings(
  providedOpenings: CalendarOpening[],
  localeWeekdays: LocaleWeekdayInfo[]
): CalendarOpening[] {
  const firstWeekday = WEEKDAYS[localeWeekdays[0].weekday];

  providedOpenings.sort((a, b) => {
    if (a.startDay !== b.startDay) {
      return (
        ((WEEKDAYS[a.startDay] - firstWeekday + 7) % 7) -
        ((WEEKDAYS[b.startDay] - firstWeekday + 7) % 7)
      );
    }
    return a.startTime.localeCompare(b.endTime);
  });

  return providedOpenings;
}

/** Create set of initial rows with closures on applicable weekdays */
export function hoursOfOperationToInitialValues(
  initialValues: CalendarOpening[],
  localeWeekdays: LocaleWeekdayInfo[]
) {
  const providedOpenings = sortOpenings(initialValues, localeWeekdays);

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

  const weekdays = localeWeekdays.map((weekday) => weekday.weekday);
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

  return addZToHours(rows);
}

export function exceptionsToInitialValues(
  exceptions: CalendarException[]
): ExceptionRowState[] {
  const allExceptions = [...exceptions];
  allExceptions.sort((a, b) => a.startDate.localeCompare(b.startDate));
  return addZToExceptions(
    allExceptions.map((exception) => {
      // closure
      if (exception.openings.length === 0) {
        return {
          type: RowType.Closed,
          name: exception.name,
          rows: [
            {
              startDate: exception.startDate,
              startTime: undefined,
              endDate: exception.endDate,
              endTime: undefined,
            },
          ],
        };
      } else {
        const exceptionOpenings = [...exception.openings];
        exceptionOpenings.sort((a, b) => {
          if (a.startDate !== b.startDate) {
            return a.startDate.localeCompare(b.startDate);
          }
          return a.startTime.localeCompare(b.startTime);
        });
        return {
          type: RowType.Open,
          name: exception.name,
          rows: exceptionOpenings,
        };
      }
    })
  );
}

/** Convert a given calendar to a set of form values, to initialize edit/duplicate forms */
export default function calendarToInitialValues(
  dataRepository: DataRepository,
  localeWeekdays: LocaleWeekdayInfo[],
  calendar: Calendar | undefined
): Partial<FormValues> {
  if (calendar === undefined) {
    return {
      name: undefined,
      'start-date': undefined,
      'end-date': undefined,
      'service-points': [],
      'hours-of-operation': [],
      exceptions: [],
    };
  }

  return {
    name: calendar.name,
    'start-date': calendar.startDate,
    'end-date': calendar.endDate,
    'service-points': dataRepository.getServicePointsFromIds(
      calendar.assignments
    ),
    'hours-of-operation': hoursOfOperationToInitialValues(
      calendar.normalHours,
      localeWeekdays
    ),
    exceptions: exceptionsToInitialValues(calendar.exceptions),
  };
}
