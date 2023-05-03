import RowType from '../../../components/fields/RowType';
import * as Dates from '../../../test/data/Dates';
import expectRender from '../../../test/util/expectRender';
import { validateDateBounds } from './validateExceptions';

test('Rows with no date bound errors return {}', () => {
  expect(
    validateDateBounds([], Dates.DEC_1_DATE, Dates.DEC_31_DATE)
  ).toStrictEqual({});
  expect(
    validateDateBounds(
      [
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
      ],
      Dates.DEC_1_DATE,
      Dates.DEC_31_DATE
    )
  ).toStrictEqual({});
  expect(
    validateDateBounds(
      [
        {
          name: 'foo',
          type: RowType.Open,
          rows: [
            {
              // not filled
              startDate: '2000-11-01',
              startTime: undefined,
              endDate: '2000-12-31',
              endTime: '00:00',
            },
          ],
        },
      ],
      Dates.DEC_1_DATE,
      Dates.DEC_31_DATE
    )
  ).toStrictEqual({});
});

test('Rows with date bound errors return the error', () => {
  expect(
    validateDateBounds(
      [
        {
          name: 'foo',
          type: RowType.Open,
          rows: [
            {
              startDate: '2000-11-01',
              startTime: '00:00',
              endDate: '2000-12-31',
              endTime: '00:00',
            },
          ],
        },
      ],
      Dates.DEC_1_DATE,
      Dates.DEC_31_DATE
    )
  ).toHaveProperty([0, 'rows', 0, 'startDate']);
  expect(
    validateDateBounds(
      [
        {
          name: 'foo',
          type: RowType.Open,
          rows: [
            {
              startDate: '2000-11-01',
              startTime: '00:00',
              endDate: '2000-12-31',
              endTime: '00:00',
            },
          ],
        },
      ],
      Dates.DEC_1_DATE,
      Dates.DEC_31_DATE
    )
  ).not.toHaveProperty([0, 'rows', 0, 'endDate']);
  expect(
    validateDateBounds(
      [
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
      ],
      Dates.DEC_1_DATE,
      Dates.DEC_17_DATE
    )
  ).toHaveProperty([0, 'rows', 0, 'endDate']);
  expect(
    validateDateBounds(
      [
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
      ],
      Dates.DEC_1_DATE,
      Dates.DEC_17_DATE
    )
  ).not.toHaveProperty([0, 'rows', 0, 'startDate']);
  expect(
    validateDateBounds(
      [
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
      ],
      Dates.DEC_17_DATE,
      Dates.DEC_17_DATE
    )
  ).toHaveProperty([0, 'rows', 0, 'startDate']);
  expect(
    validateDateBounds(
      [
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
      ],
      Dates.DEC_17_DATE,
      Dates.DEC_17_DATE
    )
  ).not.toHaveProperty([0, 'rows', 0, 'endDate']);
});

test('Error message is correct text', () => {
  expectRender(
    validateDateBounds(
      [
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
      ],
      Dates.DEC_17_DATE,
      Dates.DEC_17_DATE
    )[0].rows?.[0].startDate
  ).toContain('The exception must be within the calendar date range');
  expectRender(
    validateDateBounds(
      [
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
      ],
      Dates.DEC_1_DATE,
      Dates.DEC_17_DATE
    )[0].rows?.[0].endDate
  ).toContain('The exception must be within the calendar date range');
});
