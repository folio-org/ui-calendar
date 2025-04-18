import RowType from '../../../components/fields/RowType';
import * as Weekdays from '../../../test/data/Weekdays';
import {
  splitRowsIntoWeekdays,
  validateHoursOfOperationOverlaps,
} from './validateHoursOfOperation';

test('No rows produces no overlaps', () => {
  expect(
    validateHoursOfOperationOverlaps(splitRowsIntoWeekdays([]))
  ).toBeUndefined();
});

test('Single closures produce no overlaps', () => {
  expect(
    validateHoursOfOperationOverlaps(
      splitRowsIntoWeekdays([
        {
          i: 0,
          type: RowType.Closed,
          startDay: Weekdays.Monday,
          startTime: undefined,
          endDay: Weekdays.Sunday,
          endTime: undefined,
        },
      ])
    )
  ).toBeUndefined();

  expect(
    validateHoursOfOperationOverlaps(
      splitRowsIntoWeekdays([
        {
          i: 0,
          type: RowType.Closed,
          startDay: Weekdays.Monday,
          startTime: undefined,
          endDay: Weekdays.Monday,
          endTime: undefined,
        },
      ])
    )
  ).toBeUndefined();
});

test('Single openings produce no overlaps', () => {
  expect(
    validateHoursOfOperationOverlaps(
      splitRowsIntoWeekdays([
        {
          i: 0,
          type: RowType.Open,
          startDay: Weekdays.Monday,
          startTime: ['09:00', null],
          endDay: Weekdays.Sunday,
          endTime: ['23:00', null],
        },
      ])
    )
  ).toBeUndefined();

  expect(
    validateHoursOfOperationOverlaps(
      splitRowsIntoWeekdays([
        {
          i: 0,
          type: RowType.Open,
          startDay: Weekdays.Monday,
          startTime: ['09:00', null],
          endDay: Weekdays.Monday,
          endTime: ['23:00', null],
        },
      ])
    )
  ).toBeUndefined();
});

test('24/7 openings produce no overlaps', () => {
  expect(
    validateHoursOfOperationOverlaps(
      splitRowsIntoWeekdays([
        {
          i: 0,
          type: RowType.Open,
          startDay: Weekdays.Monday,
          startTime: ['00:00', null],
          endDay: Weekdays.Sunday,
          endTime: ['23:59', null],
        },
      ])
    )
  ).toBeUndefined();

  expect(
    validateHoursOfOperationOverlaps(
      splitRowsIntoWeekdays([
        {
          i: 0,
          type: RowType.Open,
          startDay: Weekdays.Monday,
          startTime: ['12:00', null],
          endDay: Weekdays.Monday,
          endTime: ['11:59', null],
        },
      ])
    )
  ).toBeUndefined();
});

test('Multiple non-overlapping closures produce no overlaps', () => {
  expect(
    validateHoursOfOperationOverlaps(
      splitRowsIntoWeekdays([
        {
          i: 0,
          type: RowType.Closed,
          startDay: Weekdays.Monday,
          startTime: undefined,
          endDay: Weekdays.Tuesday,
          endTime: undefined,
        },
        {
          i: 1,
          type: RowType.Closed,
          startDay: Weekdays.Sunday,
          startTime: undefined,
          endDay: Weekdays.Sunday,
          endTime: undefined,
        },
      ])
    )
  ).toBeUndefined();
});

test('Multiple overlapping closures produce overlaps', () => {
  expect(
    validateHoursOfOperationOverlaps(
      splitRowsIntoWeekdays([
        {
          i: 0,
          type: RowType.Closed,
          startDay: Weekdays.Saturday,
          startTime: undefined,
          endDay: Weekdays.Tuesday,
          endTime: undefined,
        },
        {
          i: 1,
          type: RowType.Closed,
          startDay: Weekdays.Sunday,
          startTime: undefined,
          endDay: Weekdays.Sunday,
          endTime: undefined,
        },
      ])
    )
  ).toHaveProperty('conflicts', new Set([0, 1]));
  expect(
    validateHoursOfOperationOverlaps(
      splitRowsIntoWeekdays([
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
      ])
    )
  ).toHaveProperty('conflicts', new Set([0, 1]));
});

test('Overlapping closures and openings produce overlaps', () => {
  expect(
    validateHoursOfOperationOverlaps(
      splitRowsIntoWeekdays([
        {
          i: 0,
          type: RowType.Open,
          startDay: Weekdays.Saturday,
          startTime: ['09:00', null],
          endDay: Weekdays.Tuesday,
          endTime: ['23:00', null],
        },
        {
          i: 1,
          type: RowType.Closed,
          startDay: Weekdays.Sunday,
          startTime: undefined,
          endDay: Weekdays.Sunday,
          endTime: undefined,
        },
        {
          i: 4,
          type: RowType.Open,
          startDay: Weekdays.Tuesday,
          startTime: ['12:00', null],
          endDay: Weekdays.Wednesday,
          endTime: ['23:59', null],
        },
      ])
    )
  ).toHaveProperty('conflicts', new Set([0, 1, 4]));
});
