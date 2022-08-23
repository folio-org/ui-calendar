import RowType from '../../../components/fields/RowType';
import { validateExceptionIntraOverlaps } from './validateExceptions';

test('No rows is a valid state', () => {
  expect(validateExceptionIntraOverlaps([])).toBeUndefined();
});

test('Single rows result in no overlaps', () => {
  expect(
    validateExceptionIntraOverlaps([
      {
        i: 1,
        lastRowI: 0,
        name: 'Foo',
        type: RowType.Closed,
        rows: [
          {
            i: 2,
            startDate: '2000-01-01',
            startTime: undefined,
            endDate: '2000-01-01',
            endTime: undefined,
          },
        ],
      },
    ])
  ).toBeUndefined();
  expect(
    validateExceptionIntraOverlaps([
      {
        i: 1,
        lastRowI: 0,
        name: 'Foo',
        type: RowType.Open,
        rows: [
          {
            i: 2,
            startDate: '2000-01-01',
            startTime: '00:00',
            endDate: '2000-01-04',
            endTime: '23:59',
          },
        ],
      },
    ])
  ).toBeUndefined();
});

test('Self-overlapping rows are reported as such', () => {
  expect(
    validateExceptionIntraOverlaps([
      {
        i: 1,
        lastRowI: 0,
        name: 'Foo',
        type: RowType.Open,
        rows: [
          {
            i: 2,
            startDate: '2000-01-01',
            startTime: '00:00',
            endDate: '2000-01-03',
            endTime: '12:00',
          },
          {
            i: 3,
            startDate: '2000-01-02',
            startTime: '00:00',
            endDate: '2000-01-04',
            endTime: '23:59',
          },
        ],
      },
    ])
  ).toHaveProperty('intraConflicts.1', new Set([2, 3]));
  expect(
    validateExceptionIntraOverlaps([
      {
        i: 1,
        lastRowI: 0,
        name: 'Foo',
        type: RowType.Open,
        rows: [
          {
            i: 2,
            startDate: '2000-01-02',
            startTime: '00:00',
            endDate: '2000-01-03',
            endTime: '12:00',
          },
          {
            i: 3,
            startDate: '2000-01-03',
            startTime: '00:00',
            endDate: '2000-01-04',
            endTime: '23:59',
          },
        ],
      },
    ])
  ).toHaveProperty('intraConflicts.1', new Set([2, 3]));
  expect(
    validateExceptionIntraOverlaps([
      {
        i: 2,
        lastRowI: 0,
        name: 'Foo',
        type: RowType.Open,
        rows: [
          {
            i: 2,
            startDate: '2000-01-01',
            startTime: '00:00',
            endDate: '2000-01-03',
            endTime: '12:00',
          },
          {
            i: 3,
            startDate: '2000-01-07',
            startTime: '00:00',
            endDate: '2000-01-08',
            endTime: '23:59',
          },
          {
            i: 4,
            startDate: '2000-01-01',
            startTime: '00:00',
            endDate: '2000-01-08',
            endTime: '23:59',
          },
        ],
      },
    ])
  ).toHaveProperty('intraConflicts.2', new Set([2, 3, 4]));
});
