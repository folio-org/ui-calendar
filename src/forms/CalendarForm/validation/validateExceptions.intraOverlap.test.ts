import RowType from '../../../components/fields/RowType';
import { getExceptionRowIntraOverlap } from './validateExceptions';

test('Non-filled rows are not considered', () => {
  expect(
    getExceptionRowIntraOverlap({
      name: 'foo',
      type: RowType.Open,
      rows: [
        {
          startDate: '2000-12-01',
          startTime: undefined,
          endDate: '2000-12-31',
          endTime: undefined,
        },
        {
          startDate: '2000-12-01',
          startTime: undefined,
          endDate: '2000-12-31',
          endTime: undefined,
        },
      ],
    })
  ).toStrictEqual({});
});

// normally these would not have any inner rows anyways
test('Closed rows are not considered', () => {
  expect(
    getExceptionRowIntraOverlap({
      name: 'foo',
      type: RowType.Closed,
      rows: [
        {
          startDate: '2000-12-01',
          startTime: undefined,
          endDate: '2000-12-31',
          endTime: undefined,
        },
        {
          startDate: '2000-12-01',
          startTime: undefined,
          endDate: '2000-12-31',
          endTime: undefined,
        },
      ],
    })
  ).toStrictEqual({});
});

test('Overlapping dates are found', () => {
  expect(
    getExceptionRowIntraOverlap({
      name: 'foo',
      type: RowType.Open,
      rows: [
        {
          startDate: '2000-12-01',
          startTime: '00:00',
          endDate: '2000-12-31',
          endTime: '00:00',
        },
        {
          startDate: '2000-12-15',
          startTime: '00:00',
          endDate: '2000-12-31',
          endTime: '00:00',
        },
        {
          startDate: '2000-11-15',
          startTime: '00:00',
          endDate: '2000-11-30',
          endTime: '00:00',
        },
        {
          startDate: '2000-12-01',
          startTime: '00:00',
          endDate: '2000-12-02',
          endTime: '00:00',
        },
      ],
    })
  ).toStrictEqual({
    0: { conflict: true },
    1: { conflict: true },
    3: { conflict: true },
  });
});

test('Non-overlapping rows are properly returned', () => {
  expect(
    getExceptionRowIntraOverlap({
      name: 'foo',
      type: RowType.Open,
      rows: [
        {
          startDate: '2000-12-31',
          startTime: '00:00',
          endDate: '2000-12-31',
          endTime: '00:00',
        },
        {
          startDate: '2000-12-15',
          startTime: '00:00',
          endDate: '2000-12-20',
          endTime: '00:00',
        },
        {
          startDate: '2000-11-15',
          startTime: '00:00',
          endDate: '2000-11-30',
          endTime: '00:00',
        },
        {
          startDate: '2000-12-01',
          startTime: '00:00',
          endDate: '2000-12-02',
          endTime: '00:00',
        },
      ],
    })
  ).toStrictEqual({});
});
