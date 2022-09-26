import memoizee from 'memoizee';
import { ExceptionRowState } from '../components/fields/ExceptionFieldTypes';
import { HoursOfOperationRowState } from '../components/fields/HoursOfOperationFieldTypes';
import RowType from '../components/fields/RowType';
import DataRepository from '../data/DataRepository';
import { Calendar } from '../types/types';
import { FormValues } from './CalendarForm/types';

/** Convert a given calendar to a set of form values, to initialize edit/duplicate forms */
export const calendarToInitialValues = memoizee(
  (
    dataRepository: DataRepository,
    calendar?: Calendar
  ): Partial<FormValues> => {
    if (calendar === undefined) return {};
    return {
      name: calendar.name,
      'start-date': calendar.startDate,
      'end-date': calendar.endDate,
      'service-points': dataRepository.getServicePointsFromIds(
        calendar.assignments
      ),
      'hours-of-operation': calendar.normalHours.map(
        (opening, i): HoursOfOperationRowState => ({
          type: RowType.Open,
          i: -1 - i, // ensure `i` is negative as not to conflict
          ...opening,
        })
      ),
      exceptions: calendar.exceptions.map((exception, i): ExceptionRowState => {
        const result: ExceptionRowState = {
          i: -1 - i, // ensure `i` is negative as not to conflict
          type: exception.openings.length === 0 ? RowType.Closed : RowType.Open,
          name: exception.name,
          lastRowI: 0,
          rows: [],
        };

        if (result.type === RowType.Open) {
          exception.openings.forEach((opening, j) => {
            return result.rows.push({ i: -1 - j, ...opening });
          });
        } else {
          result.rows.push({
            i: -1,
            startDate: exception.startDate,
            startTime: undefined,
            endDate: exception.endDate,
            endTime: undefined,
          });
        }

        return result;
      }),
    };
  }
);

export default calendarToInitialValues;
