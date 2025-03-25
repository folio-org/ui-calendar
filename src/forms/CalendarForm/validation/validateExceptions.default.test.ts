import RowType from '../../../components/fields/RowType';
import validateExceptions from './validateExceptions';

const localeDateFormat = 'MM/DD/YYYY';
const localeTimeFormat12 = 'hh:mm A';

test('No rows/undefined rows is a valid state', () => {
  // both of these forms indicate no error
  expect(
    validateExceptions(
      [],
      { startDate: {}, startTime: {}, endDate: {}, endTime: {} },
      localeDateFormat,
      localeTimeFormat12,
    ),
  ).toHaveProperty('exceptions', undefined);
  expect(
    validateExceptions(
      undefined,
      { startDate: {}, startTime: {}, endDate: {}, endTime: {} },
      localeDateFormat,
      localeTimeFormat12,
    ),
  ).toStrictEqual({});
});

test('Empty errors are reported alone', () => {
  expect(
    validateExceptions(
      [
        {
          i: 2,
          lastRowI: 3,
          type: RowType.Closed,
          name: ' ',
          rows: [
            {
              i: 3,
              startDate: '',
              startTime: undefined,
              endDate: '',
              endTime: undefined,
            },
          ],
        },
      ],
      { startDate: {}, startTime: {}, endDate: {}, endTime: {} },
      localeDateFormat,
      localeTimeFormat12,
    ),
  ).toHaveProperty('exceptions.empty.startDate.2.3');
});

test('Invalid errors are reported appropriately', () => {
  expect(
    validateExceptions(
      [
        {
          i: 0,
          lastRowI: 0,
          name: 'Foo',
          type: RowType.Closed,
          rows: [
            {
              i: 0,
              startDate: '2000-01-02',
              startTime: undefined,
              endDate: '2000-01-01',
              endTime: undefined,
            },
          ],
        },
      ],
      {
        startDate: { 0: { 0: { value: '01/02/2000' } as HTMLInputElement } },
        startTime: {},
        endDate: { 0: { 0: { value: '01/01/2000' } as HTMLInputElement } },
        endTime: {},
      },
      localeDateFormat,
      localeTimeFormat12,
    ),
  ).toHaveProperty('exceptions.invalid.startDate.0.0');
});

test('Inter-row overlaps are reported appropriately', () => {
  expect(
    validateExceptions(
      [
        {
          i: 1,
          lastRowI: 0,
          name: 'Foo',
          type: RowType.Closed,
          rows: [
            {
              i: 0,
              startDate: '2000-01-01',
              startTime: undefined,
              endDate: '2000-01-05',
              endTime: undefined,
            },
          ],
        },
        {
          i: 2,
          lastRowI: 0,
          name: 'Foo',
          type: RowType.Closed,
          rows: [
            {
              i: 0,
              startDate: '2000-01-05',
              startTime: undefined,
              endDate: '2000-01-08',
              endTime: undefined,
            },
          ],
        },
      ],
      {
        startDate: {
          1: { 0: { value: '01/01/2000' } as HTMLInputElement },
          2: { 0: { value: '01/05/2000' } as HTMLInputElement },
        },
        startTime: {},
        endDate: {
          1: { 0: { value: '01/05/2000' } as HTMLInputElement },
          2: { 0: { value: '01/08/2000' } as HTMLInputElement },
        },
        endTime: {},
      },
      localeDateFormat,
      localeTimeFormat12,
    ),
  ).toHaveProperty('exceptions.interConflicts', new Set([1, 2]));
});

test('Intra-row overlaps are reported appropriately', () => {
  expect(
    validateExceptions(
      [
        {
          i: 1,
          lastRowI: 0,
          name: 'Foo',
          type: RowType.Open,
          rows: [
            {
              i: 0,
              startDate: '2000-01-01',
              startTime: ['00:00:00Z', null],
              endDate: '2000-01-05',
              endTime: ['13:00:00Z', null],
            },
            {
              i: 1,
              startDate: '2000-01-05',
              startTime: ['00:00:00Z', null],
              endDate: '2000-01-08',
              endTime: ['23:00:00Z', null],
            },
          ],
        },
      ],
      {
        startDate: {
          1: {
            0: { value: '01/01/2000' } as HTMLInputElement,
            1: { value: '01/05/2000' } as HTMLInputElement,
          },
        },
        startTime: {},
        endDate: {
          1: {
            0: { value: '01/05/2000' } as HTMLInputElement,
            1: { value: '01/08/2000' } as HTMLInputElement,
          },
        },
        endTime: {},
      },
      localeDateFormat,
      localeTimeFormat12,
    ),
  ).toHaveProperty('exceptions.intraConflicts.1', new Set([0, 1]));
});

test('Valid states are reported appropriately', () => {
  expect(
    validateExceptions(
      [
        {
          i: 1,
          lastRowI: 0,
          name: 'Foo',
          type: RowType.Open,
          rows: [
            {
              i: 0,
              startDate: '2000-01-01',
              startTime: ['00:00:00Z', null],
              endDate: '2000-01-04',
              endTime: ['13:00:00Z', null],
            },
            {
              i: 1,
              startDate: '2000-01-05',
              startTime: ['00:00:00Z', null],
              endDate: '2000-01-08',
              endTime: ['23:00:00Z', null],
            },
          ],
        },
      ],
      {
        startDate: {
          1: {
            0: { value: '01/01/2000' } as HTMLInputElement,
            1: { value: '01/05/2000' } as HTMLInputElement,
          },
        },
        startTime: {},
        endDate: {
          1: {
            0: { value: '01/04/2000' } as HTMLInputElement,
            1: { value: '01/08/2000' } as HTMLInputElement,
          },
        },
        endTime: {},
      },
      localeDateFormat,
      localeTimeFormat12,
    ),
  ).toHaveProperty('exceptions', undefined);
});
