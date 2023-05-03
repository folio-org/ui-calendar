import { ExceptionRowState } from '../../../components/fields/ExceptionFieldTypes';
import RowType from '../../../components/fields/RowType';
import { isExceptionFilled } from './validateExceptions';

test('Open exception missing any date/time value is not filled', () => {
  expect(
    isExceptionFilled({
      name: 'foo',
      type: RowType.Open,
      rows: [
        {
          startDate: undefined,
          startTime: 'foo',
          endDate: 'foo',
          endTime: 'foo',
        },
      ],
    })
  ).toBe(false);
  expect(
    isExceptionFilled({
      name: 'foo',
      type: RowType.Open,
      rows: [
        {
          startDate: 'foo',
          startTime: undefined,
          endDate: 'foo',
          endTime: 'foo',
        },
      ],
    })
  ).toBe(false);
  expect(
    isExceptionFilled({
      name: 'foo',
      type: RowType.Open,
      rows: [
        {
          startDate: 'foo',
          startTime: 'foo',
          endDate: undefined,
          endTime: 'foo',
        },
      ],
    })
  ).toBe(false);
  expect(
    isExceptionFilled({
      name: 'foo',
      type: RowType.Open,
      rows: [
        {
          startDate: 'foo',
          startTime: 'foo',
          endDate: 'foo',
          endTime: undefined,
        },
      ],
    })
  ).toBe(false);
});

test('Closed exception missing any date value is not filled', () => {
  expect(
    isExceptionFilled({
      name: 'foo',
      type: RowType.Closed,
      rows: [
        {
          startDate: undefined,
          startTime: undefined,
          endDate: 'foo',
          endTime: undefined,
        },
      ],
    })
  ).toBe(false);
  expect(
    isExceptionFilled({
      name: 'foo',
      type: RowType.Open,
      rows: [
        {
          startDate: 'foo',
          startTime: undefined,
          endDate: undefined,
          endTime: undefined,
        },
      ],
    })
  ).toBe(false);
});

test('Exceptions with all date/time values is filled', () => {
  expect(
    isExceptionFilled({
      name: 'foo',
      type: RowType.Open,
      rows: [
        {
          startDate: 'foo',
          startTime: 'foo',
          endDate: 'foo',
          endTime: 'foo',
        },
      ],
    })
  ).toBe(true);
  expect(
    isExceptionFilled({
      name: 'foo',
      type: RowType.Closed,
      rows: [
        {
          startDate: 'foo',
          startTime: undefined,
          endDate: 'foo',
          endTime: undefined,
        },
      ],
    })
  ).toBe(true);
});

test('Multiple rows are properly considered', () => {
  expect(
    isExceptionFilled({
      name: 'foo',
      type: RowType.Open,
      rows: [
        {
          startDate: 'foo',
          startTime: 'foo',
          endDate: 'foo',
          endTime: 'foo',
        },
        {
          startDate: 'foo',
          startTime: 'foo',
          endDate: 'foo',
          endTime: undefined,
        },
      ],
    })
  ).toBe(false);
  expect(
    isExceptionFilled({
      name: 'foo',
      type: RowType.Closed,
      rows: [
        {
          startDate: undefined,
          startTime: undefined,
          endDate: 'foo',
          endTime: undefined,
        },
        {
          startDate: 'foo',
          startTime: undefined,
          endDate: 'foo',
          endTime: undefined,
        },
      ],
    })
  ).toBe(false);
  expect(
    isExceptionFilled({
      name: 'foo',
      type: RowType.Closed,
      rows: [
        {
          startDate: 'foo',
          startTime: undefined,
          endDate: 'foo',
          endTime: undefined,
        },
        {
          startDate: 'foo',
          startTime: undefined,
          endDate: 'foo',
          endTime: undefined,
        },
      ],
    })
  ).toBe(true);
});

test('Exception with no rows nor name is considered filled', () => {
  expect(
    isExceptionFilled({
      type: RowType.Open,
      rows: [],
    } as unknown as ExceptionRowState)
  ).toBe(true);
  expect(
    isExceptionFilled({
      type: RowType.Closed,
      rows: [],
    } as unknown as ExceptionRowState)
  ).toBe(true);
});
