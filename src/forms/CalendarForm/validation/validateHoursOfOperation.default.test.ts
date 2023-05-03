import RowType from '../../../components/fields/RowType';
import * as Weekdays from '../../../test/data/Weekdays';
import validateHoursOfOperation, {
  splitRowsIntoWeekdays,
  validateHoursOfOperationOverlaps,
} from './validateHoursOfOperation';

test('No rows produces no issues', () => {
  expect(validateHoursOfOperation([])).toStrictEqual({});
  expect(validateHoursOfOperation(undefined)).toStrictEqual({});
});

test('Issues are reported', () => {
  expect(
    validateHoursOfOperationOverlaps(
      splitRowsIntoWeekdays([
        {
          type: RowType.Open,
          startDay: Weekdays.Monday,
          startTime: '09:00',
          endDay: Weekdays.Tuesday,
          endTime: '23:00',
        },
        {
          type: RowType.Closed,
          startDay: Weekdays.Sunday,
          startTime: undefined,
          endDay: Weekdays.Sunday,
          endTime: undefined,
        },
        {
          type: RowType.Open,
          startDay: Weekdays.Tuesday,
          startTime: '12:00',
          endDay: Weekdays.Wednesday,
          endTime: '23:59',
        },
      ])
    )
  ).toStrictEqual({ 0: { conflict: true }, 2: { conflict: true } });
});
