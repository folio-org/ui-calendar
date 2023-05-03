import RowType from '../../../components/fields/RowType';
import * as Weekdays from '../../../test/data/Weekdays';
import {
  splitRowsIntoWeekdays,
  validateHoursOfOperationOverlaps,
} from './validateHoursOfOperation';

test('No rows produces no overlaps', () => {
  expect(
    validateHoursOfOperationOverlaps(splitRowsIntoWeekdays([]))
  ).toStrictEqual({});
});

test('Single closures produce no overlaps', () => {
  expect(
    validateHoursOfOperationOverlaps(
      splitRowsIntoWeekdays([
        {
          type: RowType.Closed,
          startDay: Weekdays.Monday,
          startTime: undefined,
          endDay: Weekdays.Sunday,
          endTime: undefined,
        },
      ])
    )
  ).toStrictEqual({});

  expect(
    validateHoursOfOperationOverlaps(
      splitRowsIntoWeekdays([
        {
          type: RowType.Closed,
          startDay: Weekdays.Monday,
          startTime: undefined,
          endDay: Weekdays.Monday,
          endTime: undefined,
        },
      ])
    )
  ).toStrictEqual({});
});

test('Single openings produce no overlaps', () => {
  expect(
    validateHoursOfOperationOverlaps(
      splitRowsIntoWeekdays([
        {
          type: RowType.Open,
          startDay: Weekdays.Monday,
          startTime: '09:00',
          endDay: Weekdays.Sunday,
          endTime: '23:00',
        },
      ])
    )
  ).toStrictEqual({});

  expect(
    validateHoursOfOperationOverlaps(
      splitRowsIntoWeekdays([
        {
          type: RowType.Open,
          startDay: Weekdays.Monday,
          startTime: '09:00',
          endDay: Weekdays.Monday,
          endTime: '23:00',
        },
      ])
    )
  ).toStrictEqual({});
});

test('24/7 openings produce no overlaps', () => {
  expect(
    validateHoursOfOperationOverlaps(
      splitRowsIntoWeekdays([
        {
          type: RowType.Open,
          startDay: Weekdays.Monday,
          startTime: '00:00',
          endDay: Weekdays.Sunday,
          endTime: '23:59',
        },
      ])
    )
  ).toStrictEqual({});

  expect(
    validateHoursOfOperationOverlaps(
      splitRowsIntoWeekdays([
        {
          type: RowType.Open,
          startDay: Weekdays.Monday,
          startTime: '12:00',
          endDay: Weekdays.Monday,
          endTime: '11:59',
        },
      ])
    )
  ).toStrictEqual({});
});

test('Multiple non-overlapping closures produce no overlaps', () => {
  expect(
    validateHoursOfOperationOverlaps(
      splitRowsIntoWeekdays([
        {
          type: RowType.Closed,
          startDay: Weekdays.Monday,
          startTime: undefined,
          endDay: Weekdays.Tuesday,
          endTime: undefined,
        },
        {
          type: RowType.Closed,
          startDay: Weekdays.Sunday,
          startTime: undefined,
          endDay: Weekdays.Sunday,
          endTime: undefined,
        },
      ])
    )
  ).toStrictEqual({});
});

test('Multiple overlapping closures produce overlaps', () => {
  expect(
    validateHoursOfOperationOverlaps(
      splitRowsIntoWeekdays([
        {
          type: RowType.Closed,
          startDay: Weekdays.Saturday,
          startTime: undefined,
          endDay: Weekdays.Tuesday,
          endTime: undefined,
        },
        {
          type: RowType.Closed,
          startDay: Weekdays.Sunday,
          startTime: undefined,
          endDay: Weekdays.Sunday,
          endTime: undefined,
        },
      ])
    )
  ).toStrictEqual({ 0: { conflict: true }, 1: { conflict: true } });
  expect(
    validateHoursOfOperationOverlaps(
      splitRowsIntoWeekdays([
        {
          type: RowType.Closed,
          startDay: Weekdays.Sunday,
          startTime: undefined,
          endDay: Weekdays.Sunday,
          endTime: undefined,
        },
        {
          type: RowType.Closed,
          startDay: Weekdays.Saturday,
          startTime: undefined,
          endDay: Weekdays.Tuesday,
          endTime: undefined,
        },
      ])
    )
  ).toStrictEqual({ 0: { conflict: true }, 1: { conflict: true } });
});

test('Overlapping closures and openings produce overlaps', () => {
  expect(
    validateHoursOfOperationOverlaps(
      splitRowsIntoWeekdays([
        {
          type: RowType.Open,
          startDay: Weekdays.Saturday,
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
  ).toStrictEqual({
    0: { conflict: true },
    1: { conflict: true },
    2: { conflict: true },
  });
});

test('Only some overlaps are returned when applicable', () => {
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
