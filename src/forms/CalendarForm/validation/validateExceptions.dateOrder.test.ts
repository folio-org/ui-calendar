import RowType from '../../../components/fields/RowType';
import expectRender from '../../../test/util/expectRender';
import { validateDateOrder } from './validateExceptions';

test('Rows with no date order errors return {}', () => {
  expect(validateDateOrder([])).toStrictEqual({});
  expect(
    validateDateOrder([
      {
        name: 'foo',
        type: RowType.Open,
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
  expect(
    validateDateOrder([
      {
        name: 'foo',
        type: RowType.Open,
        rows: [
          {
            startDate: '2000-12-11',
            startTime: undefined,
            endDate: '2000-12-11',
            endTime: '00:00',
          },
        ],
      },
    ])
  ).toStrictEqual({});
});

test('Rows with date order errors return the error', () => {
  expect(
    validateDateOrder([
      {
        name: 'foo',
        type: RowType.Open,
        rows: [
          {
            startDate: '2000-12-31',
            startTime: '00:00',
            endDate: '2000-12-01',
            endTime: '00:00',
          },
        ],
      },
    ])
  ).toHaveProperty([0, 'rows', 0, 'endDate']);
  expect(
    validateDateOrder([
      {
        name: 'foo',
        type: RowType.Closed,
        rows: [
          {
            startDate: '2000-12-31',
            startTime: undefined,
            endDate: '2000-12-01',
            endTime: undefined,
          },
        ],
      },
    ])
  ).toHaveProperty([0, 'rows', 0, 'endDate']);
  expect(
    validateDateOrder([
      {
        name: 'foo',
        type: RowType.Open,
        rows: [
          {
            startDate: '2000-12-11',
            startTime: '00:00',
            endDate: '2000-12-01',
            endTime: '00:00',
          },
          {
            startDate: '2000-12-11',
            startTime: '00:00',
            endDate: '2000-12-03',
            endTime: '00:00',
          },
        ],
      },
    ])
  ).toHaveProperty([0, 'rows', 0, 'endDate']);
  expect(
    validateDateOrder([
      {
        name: 'foo',
        type: RowType.Open,
        rows: [
          {
            startDate: '2000-12-11',
            startTime: '00:00',
            endDate: '2000-12-01',
            endTime: '00:00',
          },
          {
            startDate: '2000-12-11',
            startTime: '00:00',
            endDate: '2000-12-03',
            endTime: '00:00',
          },
        ],
      },
    ])
  ).toHaveProperty([0, 'rows', 1, 'endDate']);
  expect(
    validateDateOrder([
      {
        name: 'foo',
        type: RowType.Open,
        rows: [
          {
            startDate: '2000-12-11',
            startTime: '00:00',
            endDate: '2000-12-01',
            endTime: '00:00',
          },
          {
            startDate: '2000-12-11',
            startTime: '00:00',
            endDate: '2000-12-03',
            endTime: '00:00',
          },
          {
            startDate: '2000-12-11',
            startTime: '00:00',
            endDate: '2000-12-12',
            endTime: '00:00',
          },
        ],
      },
    ])
  ).not.toHaveProperty([0, 'rows', 2, 'endDate']);
  expect(
    validateDateOrder([
      {
        name: 'foo',
        type: RowType.Open,
        rows: [
          {
            startDate: '2000-12-11',
            startTime: '12:00',
            endDate: '2000-12-11',
            endTime: '00:00',
          },
        ],
      },
    ])
  ).toHaveProperty([0, 'rows', 0, 'endDate']);
});

test('Error message is correct text', () => {
  expectRender(
    validateDateOrder([
      {
        name: 'foo',
        type: RowType.Open,
        rows: [
          {
            startDate: '2000-12-11',
            startTime: '12:00',
            endDate: '2000-12-11',
            endTime: '00:00',
          },
        ],
      },
    ])[0].rows?.[0].endDate
  ).toContain('End date/time must not be before the start date/time');
});
