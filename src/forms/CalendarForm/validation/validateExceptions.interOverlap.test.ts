import RowType from '../../../components/fields/RowType';
import { validateExceptionOverlaps } from './validateExceptions';

test('No/one rows are not overlapping', () => {
  expect(validateExceptionOverlaps([])).toStrictEqual({});
  expect(
    validateExceptionOverlaps([
      {
        name: 'foo',
        type: RowType.Closed,
        rows: [
          {
            startDate: '2000-12-01',
            startTime: '00:00',
            endDate: '2000-12-31',
            endTime: '00:00',
          },
        ],
      },
    ])
  ).toStrictEqual({});
});

test('Multiple non-overlapping exceptions are not overlapping', () => {
  expect(
    validateExceptionOverlaps([
      {
        name: 'foo',
        type: RowType.Closed,
        rows: [
          {
            startDate: '2000-12-01',
            startTime: '00:00',
            endDate: '2000-12-31',
            endTime: '00:00',
          },
        ],
      },
      {
        name: 'foo',
        type: RowType.Open,
        rows: [
          {
            startDate: '2000-11-01',
            startTime: '00:00',
            endDate: '2000-11-30',
            endTime: '00:00',
          },
        ],
      },
    ])
  ).toStrictEqual({});
});

test('Overlapping exceptions are properly returned', () => {
  expect(
    validateExceptionOverlaps([
      {
        name: 'foo',
        type: RowType.Closed,
        rows: [
          {
            startDate: '2000-12-01',
            startTime: '00:00',
            endDate: '2000-12-31',
            endTime: '00:00',
          },
        ],
      },
      {
        name: 'foo',
        type: RowType.Open,
        rows: [
          {
            startDate: '2000-11-01',
            startTime: '00:00',
            endDate: '2000-11-30',
            endTime: '00:00',
          },
        ],
      },
      {
        name: 'foo',
        type: RowType.Open,
        rows: [
          {
            startDate: '2000-11-01',
            startTime: '00:00',
            endDate: '2000-11-30',
            endTime: '00:00',
          },
        ],
      },
    ])
  ).toStrictEqual({
    1: { conflict: true },
    2: { conflict: true },
  });

  expect(
    validateExceptionOverlaps([
      {
        name: 'foo',
        type: RowType.Closed,
        rows: [
          {
            startDate: '2000-12-01',
            startTime: '00:00',
            endDate: '2000-12-31',
            endTime: '00:00',
          },
        ],
      },
      {
        name: 'foo',
        type: RowType.Open,
        rows: [
          {
            startDate: '2000-11-01',
            startTime: '00:00',
            endDate: '2000-11-30',
            endTime: '00:00',
          },
        ],
      },
      {
        name: 'foo',
        type: RowType.Open,
        rows: [
          {
            startDate: '2000-10-01',
            startTime: '00:00',
            endDate: '2000-10-30',
            endTime: '00:00',
          },
          {
            startDate: '2000-12-01',
            startTime: '00:00',
            endDate: '2000-12-30',
            endTime: '00:00',
          },
        ],
      },
    ])
  ).toStrictEqual({
    0: { conflict: true },
    1: { conflict: true },
    2: { conflict: true },
  });
});

test('Overlapping inner rows usurp outer conflicts', () => {
  expect(
    validateExceptionOverlaps([
      {
        name: 'foo',
        type: RowType.Closed,
        rows: [
          {
            startDate: '2000-12-01',
            startTime: '00:00',
            endDate: '2000-12-31',
            endTime: '00:00',
          },
        ],
      },
      {
        name: 'foo',
        type: RowType.Open,
        rows: [
          {
            startDate: '2000-11-01',
            startTime: '00:00',
            endDate: '2000-11-30',
            endTime: '00:00',
          },
        ],
      },
      {
        name: 'foo',
        type: RowType.Open,
        rows: [
          {
            startDate: '2000-12-01',
            startTime: '00:00',
            endDate: '2000-12-30',
            endTime: '00:00',
          },
          {
            startDate: '2000-12-01',
            startTime: '00:00',
            endDate: '2000-12-30',
            endTime: '00:00',
          },
        ],
      },
    ])
  ).toStrictEqual({
    0: { conflict: true },
    2: {
      rows: [{ conflict: true }, { conflict: true }],
    },
  });
});
