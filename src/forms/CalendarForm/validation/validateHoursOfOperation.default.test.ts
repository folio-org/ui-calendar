import RowType from '../../../components/fields/RowType';
import validateHoursOfOperation from './validateHoursOfOperation';
import * as Weekdays from '../../../test/data/Weekdays';

const localeTimeFormat12 = 'hh:mm A';

test('No rows is valid', () => {
  // either version is valid
  expect(
    validateHoursOfOperation([], { startTime: {}, endTime: {} }, localeTimeFormat12),
  ).toStrictEqual({ 'hours-of-operation': undefined });
  expect(
    validateHoursOfOperation(undefined, { startTime: {}, endTime: {} }, localeTimeFormat12),
  ).toStrictEqual({});
});

test('Empty errors are reported', () => {
  expect(
    validateHoursOfOperation(
      [
        {
          i: 0,
          type: RowType.Open,
          startDay: undefined,
          startTime: undefined,
          endDay: undefined,
          endTime: undefined,
        },
      ],
      { startTime: {}, endTime: {} },
      localeTimeFormat12,
    ),
  ).toHaveProperty('hours-of-operation.empty');
});

test('Invalid time errors are reported', () => {
  expect(
    validateHoursOfOperation(
      [
        {
          i: 2,
          type: RowType.Open,
          startDay: Weekdays.Monday,
          startTime: ['09:00:00Z', 'invalid'],
          endDay: Weekdays.Tuesday,
          endTime: ['09:00:00Z', 'invalid'],
        },
      ],
      {
        startTime: {
          0: { value: '12:00 PM' },
          1: { value: 'invalid' },
        } as unknown as Record<number, HTMLInputElement>,
        endTime: {
          1: { value: '1:00 PM' },
          2: { value: '8:00 AM' },
        } as unknown as Record<number, HTMLInputElement>,
      },
      localeTimeFormat12,
    ),
  ).toHaveProperty('hours-of-operation.invalidTimes');
});

test('Empty has precedence over invalid time errors', () => {
  expect(
    validateHoursOfOperation(
      [
        {
          i: 2,
          type: RowType.Open,
          startDay: undefined,
          startTime: ['09:00:00Z', null],
          endDay: undefined,
          endTime: ['09:00:00Z', null],
        },
      ],
      {
        startTime: {
          0: { value: '12:00 PM' },
          1: { value: 'invalid' },
        } as unknown as Record<number, HTMLInputElement>,
        endTime: {
          1: { value: '1:00 PM' },
          2: { value: '8:00 AM' },
        } as unknown as Record<number, HTMLInputElement>,
      },
      localeTimeFormat12,
    ),
  ).toHaveProperty('hours-of-operation.empty');
});

test('Conflicts are reported', () => {
  expect(
    validateHoursOfOperation(
      [
        {
          i: 1,
          type: RowType.Closed,
          startDay: Weekdays.Sunday,
          startTime: undefined,
          endDay: Weekdays.Sunday,
          endTime: undefined,
        },
        {
          i: 0,
          type: RowType.Closed,
          startDay: Weekdays.Saturday,
          startTime: undefined,
          endDay: Weekdays.Tuesday,
          endTime: undefined,
        },
      ],
      {
        startTime: {},
        endTime: {},
      },
      localeTimeFormat12,
    ),
  ).toHaveProperty('hours-of-operation.conflicts');
});
