import * as Weekdays from '../../test/data/Weekdays';
import expectRender from '../../test/util/expectRender';
import { LocaleWeekdayInfo } from '../../utils/WeekdayUtils';
import {
  calculateInitialRows,
  getConflictError,
  getTimeError,
  getWeekdayError,
  isRowConflicted,
} from './HoursOfOperationFieldUtils';
import RowType from './RowType';

const localeWeekdaysSunday: LocaleWeekdayInfo[] = [
  { weekday: Weekdays.Sunday, short: 'XXXXX', long: 'XXXXXXXX' },
  { weekday: Weekdays.Monday, short: 'XXXXX', long: 'XXXXXXXX' },
  { weekday: Weekdays.Tuesday, short: 'XXXXX', long: 'XXXXXXXX' },
  { weekday: Weekdays.Wednesday, short: 'XXXXX', long: 'XXXXXXXX' },
  { weekday: Weekdays.Thursday, short: 'XXXXX', long: 'XXXXXXXX' },
  { weekday: Weekdays.Friday, short: 'XXXXX', long: 'XXXXXXXX' },
  { weekday: Weekdays.Saturday, short: 'XXXXX', long: 'XXXXXXXX' },
];

const localeWeekdaysWednesday: LocaleWeekdayInfo[] = [
  { weekday: Weekdays.Wednesday, short: 'XXXXX', long: 'XXXXXXXX' },
  { weekday: Weekdays.Thursday, short: 'XXXXX', long: 'XXXXXXXX' },
  { weekday: Weekdays.Friday, short: 'XXXXX', long: 'XXXXXXXX' },
  { weekday: Weekdays.Saturday, short: 'XXXXX', long: 'XXXXXXXX' },
  { weekday: Weekdays.Sunday, short: 'XXXXX', long: 'XXXXXXXX' },
  { weekday: Weekdays.Monday, short: 'XXXXX', long: 'XXXXXXXX' },
  { weekday: Weekdays.Tuesday, short: 'XXXXX', long: 'XXXXXXXX' },
];

describe('Hours of operation utilities work correctly', () => {
  describe('initial rows are correctly created', () => {
    test('No rows result in filler closed rows', () => {
      expect(calculateInitialRows([], localeWeekdaysWednesday).rows).toStrictEqual([
        {
          i: 0,
          type: RowType.Closed,
          startDay: Weekdays.Wednesday,
          startTime: undefined,
          endDay: Weekdays.Tuesday,
          endTime: undefined,
        },
      ]);
    });

    test('Single-day opening results in proper filler row allocation', () => {
      expect(
        calculateInitialRows(
          [
            {
              i: 0,
              type: RowType.Open,
              startDay: Weekdays.Wednesday,
              startTime: ['00:00:00Z', null],
              endDay: Weekdays.Wednesday,
              endTime: ['20:00:00Z', null],
            },
          ],
          localeWeekdaysSunday,
        ).rows,
      ).toStrictEqual([
        {
          i: 0,
          type: RowType.Closed,
          startDay: Weekdays.Sunday,
          startTime: undefined,
          endDay: Weekdays.Tuesday,
          endTime: undefined,
        },
        {
          i: 1,
          type: RowType.Open,
          startDay: Weekdays.Wednesday,
          startTime: ['00:00:00Z', null],
          endDay: Weekdays.Wednesday,
          endTime: ['20:00:00Z', null],
        },
        {
          i: 2,
          type: RowType.Closed,
          startDay: Weekdays.Thursday,
          startTime: undefined,
          endDay: Weekdays.Saturday,
          endTime: undefined,
        },
      ]);

      expect(
        calculateInitialRows(
          [
            {
              i: 0,
              type: RowType.Open,
              startDay: Weekdays.Sunday,
              startTime: ['00:00:00Z', null],
              endDay: Weekdays.Sunday,
              endTime: ['20:00:00Z', null],
            },
            {
              i: 1,
              type: RowType.Open,
              startDay: Weekdays.Saturday,
              startTime: ['02:00:00Z', null],
              endDay: Weekdays.Saturday,
              endTime: ['22:00:00Z', null],
            },
          ],
          localeWeekdaysSunday,
        ).rows,
      ).toStrictEqual([
        {
          i: 0,
          type: RowType.Open,
          startDay: Weekdays.Sunday,
          startTime: ['00:00:00Z', null],
          endDay: Weekdays.Sunday,
          endTime: ['20:00:00Z', null],
        },
        {
          i: 1,
          type: RowType.Closed,
          startDay: Weekdays.Monday,
          startTime: undefined,
          endDay: Weekdays.Friday,
          endTime: undefined,
        },
        {
          i: 2,
          type: RowType.Open,
          startDay: Weekdays.Saturday,
          startTime: ['02:00:00Z', null],
          endDay: Weekdays.Saturday,
          endTime: ['22:00:00Z', null],
        },
      ]);
    });

    test('Multi-day opening results in proper filler row allocation', () => {
      expect(
        calculateInitialRows(
          [
            {
              i: 0,
              type: RowType.Open,
              startDay: Weekdays.Friday,
              startTime: ['00:00:00Z', null],
              endDay: Weekdays.Monday,
              endTime: ['20:00:00Z', null],
            },
          ],
          localeWeekdaysSunday,
        ).rows,
      ).toStrictEqual([
        {
          i: 0,
          type: RowType.Closed,
          startDay: Weekdays.Tuesday,
          startTime: undefined,
          endDay: Weekdays.Thursday,
          endTime: undefined,
        },
        {
          i: 1,
          type: RowType.Open,
          startDay: Weekdays.Friday,
          startTime: ['00:00:00Z', null],
          endDay: Weekdays.Monday,
          endTime: ['20:00:00Z', null],
        },
      ]);

      expect(
        calculateInitialRows(
          [
            {
              i: 0,
              type: RowType.Open,
              startDay: Weekdays.Friday,
              startTime: ['00:00:00Z', null],
              endDay: Weekdays.Monday,
              endTime: ['20:00:00Z', null],
            },
          ],
          localeWeekdaysWednesday,
        ).rows,
      ).toStrictEqual([
        {
          i: 0,
          type: RowType.Closed,
          startDay: Weekdays.Wednesday,
          startTime: undefined,
          endDay: Weekdays.Thursday,
          endTime: undefined,
        },
        {
          i: 1,
          type: RowType.Open,
          startDay: Weekdays.Friday,
          startTime: ['00:00:00Z', null],
          endDay: Weekdays.Monday,
          endTime: ['20:00:00Z', null],
        },
        {
          i: 2,
          type: RowType.Closed,
          startDay: Weekdays.Tuesday,
          startTime: undefined,
          endDay: Weekdays.Tuesday,
          endTime: undefined,
        },
      ]);
    });

    test('Same-day openings are properly sorted', () => {
      expect(
        calculateInitialRows(
          [
            {
              i: 0,
              type: RowType.Open,
              startDay: Weekdays.Sunday,
              startTime: ['00:00:00Z', null],
              endDay: Weekdays.Sunday,
              endTime: ['04:00:00Z', null],
            },
            {
              i: 1,
              type: RowType.Open,
              startDay: Weekdays.Sunday,
              startTime: ['09:00:00Z', null],
              endDay: Weekdays.Sunday,
              endTime: ['20:00:00Z', null],
            },
          ],
          localeWeekdaysSunday,
        ).rows,
      ).toStrictEqual([
        {
          i: 0,
          type: RowType.Open,
          startDay: Weekdays.Sunday,
          startTime: ['00:00:00Z', null],
          endDay: Weekdays.Sunday,
          endTime: ['04:00:00Z', null],
        },
        {
          i: 1,
          type: RowType.Open,
          startDay: Weekdays.Sunday,
          startTime: ['09:00:00Z', null],
          endDay: Weekdays.Sunday,
          endTime: ['20:00:00Z', null],
        },
        {
          i: 2,
          type: RowType.Closed,
          startDay: Weekdays.Monday,
          startTime: undefined,
          endDay: Weekdays.Saturday,
          endTime: undefined,
        },
      ]);

      expect(
        calculateInitialRows(
          [
            {
              i: 0,
              type: RowType.Open,
              startDay: Weekdays.Sunday,
              startTime: ['09:00:00Z', null],
              endDay: Weekdays.Sunday,
              endTime: ['20:00:00Z', null],
            },
            {
              i: 1,
              type: RowType.Open,
              startDay: Weekdays.Sunday,
              startTime: ['00:00:00Z', null],
              endDay: Weekdays.Sunday,
              endTime: ['04:00:00Z', null],
            },
          ],
          localeWeekdaysSunday,
        ).rows,
      ).toStrictEqual([
        {
          i: 0,
          type: RowType.Open,
          startDay: Weekdays.Sunday,
          startTime: ['00:00:00Z', null],
          endDay: Weekdays.Sunday,
          endTime: ['04:00:00Z', null],
        },
        {
          i: 1,
          type: RowType.Open,
          startDay: Weekdays.Sunday,
          startTime: ['09:00:00Z', null],
          endDay: Weekdays.Sunday,
          endTime: ['20:00:00Z', null],
        },
        {
          i: 2,
          type: RowType.Closed,
          startDay: Weekdays.Monday,
          startTime: undefined,
          endDay: Weekdays.Saturday,
          endTime: undefined,
        },
      ]);
    });
  });

  describe('Row conflicts are proper reported', () => {
    test('Levels of undefined-ness', () => {
      expect(isRowConflicted(undefined, 0)).toBe(false);
      expect(
        isRowConflicted({ empty: { startDay: {}, startTime: {}, endDay: {}, endTime: {} } }, 0),
      ).toBe(false);
    });

    test('Rows from set are returned when set is present', () => {
      expect(isRowConflicted({ conflicts: new Set<number>() }, 0)).toBe(false);
      expect(isRowConflicted({ conflicts: new Set<number>([0, 2, 4]) }, 0)).toBe(true);
      expect(isRowConflicted({ conflicts: new Set<number>([0, 2, 4]) }, 3)).toBe(false);
    });
  });

  describe('Weekday errors are properly determined', () => {
    test('Non-touched and non-attempted forms do not show errors', () => {
      expect(
        getWeekdayError(
          'startDay',
          {
            empty: {
              startDay: { 0: 'foo' },
              startTime: {},
              endDay: {},
              endTime: {},
            },
          },
          0,
          false,
          false,
        ),
      ).toBeUndefined();
    });

    test('Present errors are reported when attempted/touch-ness say they should be', () => {
      expect(
        getWeekdayError(
          'startDay',
          {
            empty: {
              startDay: { 0: 'foo' },
              startTime: {},
              endDay: {},
              endTime: {},
            },
          },
          0,
          true,
          false,
        ),
      ).toBe('foo');

      expect(
        getWeekdayError(
          'startDay',
          {
            empty: {
              startDay: { 0: 'foo' },
              startTime: {},
              endDay: {},
              endTime: {},
            },
          },
          0,
          false,
          true,
        ),
      ).toBe('foo');

      expect(
        getWeekdayError(
          'startDay',
          {
            empty: {
              startDay: { 0: 'foo' },
              startTime: {},
              endDay: {},
              endTime: {},
            },
          },
          0,
          true,
          true,
        ),
      ).toBe('foo');
    });

    test('Partially-present errors are properly reported', () => {
      expect(getWeekdayError('startDay', undefined, 0, true, true)).toBeUndefined();
      expect(getWeekdayError('startDay', { conflicts: new Set() }, 0, true, true)).toBeUndefined();
      expect(
        getWeekdayError(
          'startDay',
          {
            empty: {
              startDay: { 1: 'not me!' },
              startTime: {},
              endDay: {},
              endTime: {},
            },
          },
          0,
          true,
          true,
        ),
      ).toBeUndefined();
    });
  });

  describe('getTimeError works properly', () => {
    test('Attempted/touched controls return', () => {
      const er = {
        empty: {
          startDay: {},
          startTime: { 0: 'hi' },
          endDay: {},
          endTime: {},
        },
      };

      expect(getTimeError('startTime', er, 0, false, false)).toBeUndefined();
      expect(getTimeError('startTime', er, 0, false, true)).toBe('hi');
      expect(getTimeError('startTime', er, 0, true, false)).toBe('hi');
      expect(getTimeError('startTime', er, 0, true, true)).toBe('hi');
    });

    test('Undefined results in no error returned', () => {
      expect(getTimeError('startTime', undefined, 0, true, true)).toBeUndefined();
    });

    test('empty returns appropriately', () => {
      expect(
        getTimeError(
          'endTime',
          {
            empty: {
              startDay: {},
              startTime: {},
              endDay: {},
              endTime: { 0: 'hi' },
            },
          },
          0,
          true,
          true,
        ),
      ).toBe('hi');
      expect(
        getTimeError(
          'endTime',
          {
            empty: {
              startDay: {},
              startTime: {},
              endDay: {},
              endTime: { 0: 'hi' },
            },
          },
          1,
          true,
          true,
        ),
      ).toBeUndefined();
    });

    test('invalidTime returns appropriately', () => {
      expect(
        getTimeError(
          'endTime',
          { invalidTimes: { startTime: {}, endTime: { 0: 'hi' } } },
          0,
          true,
          true,
        ),
      ).toBe('hi');
      expect(
        getTimeError(
          'endTime',
          { invalidTimes: { startTime: {}, endTime: { 0: 'hi' } } },
          1,
          true,
          true,
        ),
      ).toBeUndefined();
    });

    test('Neither empty nor invalidTime = undefined', () => {
      expect(getTimeError('endTime', { conflicts: new Set() }, 0, true, true)).toBeUndefined();
    });
  });

  test('conflicts are reported when applicable', () => {
    expect(getConflictError(undefined)).toBeUndefined();
    expect(getConflictError({ invalidTimes: { startTime: {}, endTime: {} } })).toBeUndefined();
    expect(getConflictError({ conflicts: new Set() })).toBeUndefined();
    expectRender(getConflictError({ conflicts: new Set([1, 2, 3]) })).toContain(
      'Some openings have conflicts',
    );
  });
});
