import RowType from '../../../components/fields/RowType';
import expectRender from '../../../test/util/expectRender';
import { validateExceptionsDatesAndTimes } from './validateExceptions';

const localeDateFormat = 'MM/DD/YYYY';
const localeTimeFormat12 = 'hh:mm A';

test('No rows is a valid state', () => {
  expect(
    validateExceptionsDatesAndTimes(
      [],
      {
        startDate: {},
        startTime: {},
        endDate: {},
        endTime: {},
      },
      localeDateFormat,
      localeTimeFormat12
    )
  ).toBeUndefined();
  expect(
    validateExceptionsDatesAndTimes(
      [
        {
          i: 0,
          lastRowI: 0,
          type: RowType.Closed,
          name: 'Foo',
          rows: [],
        },
      ],
      { startDate: {}, startTime: {}, endDate: {}, endTime: {} },
      localeDateFormat,
      localeTimeFormat12
    )
  ).toBeUndefined();
});

test('Invalid dates are properly reported', () => {
  const validationResult = validateExceptionsDatesAndTimes(
    [
      {
        i: 0,
        lastRowI: 0,
        name: '',
        type: RowType.Closed,
        rows: [
          {
            i: 0,
            startDate: '2000-01-01',
            startTime: undefined,
            endDate: '2000-01-01',
            endTime: undefined,
          },
        ],
      },
    ],
    {
      startDate: {},
      startTime: {},
      endDate: {},
      endTime: {},
    },
    localeDateFormat,
    localeTimeFormat12
  );
  expect(validationResult).not.toBeUndefined();
  expect(validationResult).toHaveProperty('invalid.startDate.0.0');
  expect(validationResult).not.toHaveProperty('invalid.startTime.0.0');
  expect(validationResult).toHaveProperty('invalid.endDate.0.0');
  expect(validationResult).not.toHaveProperty('invalid.endTime.0.0');

  expectRender(validationResult?.invalid?.startDate[0][0]).toBe(
    'Please enter a date in the MM/DD/YYYY format'
  );
});

test('Invalid dates in multiple rows are properly reported', () => {
  const validationResult = validateExceptionsDatesAndTimes(
    [
      {
        i: 0,
        lastRowI: 0,
        name: '',
        type: RowType.Closed,
        rows: [
          {
            i: 0,
            startDate: '2000-01-01',
            startTime: undefined,
            endDate: '2000-01-01',
            endTime: undefined,
          },
        ],
      },
      {
        i: 1,
        lastRowI: 0,
        name: '',
        type: RowType.Open,
        rows: [
          {
            i: 0,
            startDate: '2000-01-01',
            startTime: undefined,
            endDate: '2000-01-01',
            endTime: undefined,
          },
        ],
      },
    ],
    {
      startDate: { 0: { 0: { value: '01/01/2000' } as HTMLInputElement } },
      startTime: {},
      endDate: { 1: { 0: { value: '01/01/2000' } as HTMLInputElement } },
      endTime: {},
    },
    localeDateFormat,
    localeTimeFormat12
  );
  expect(validationResult).not.toBeUndefined();
  expect(validationResult).not.toHaveProperty('invalid.startDate.0.0');
  expect(validationResult).toHaveProperty('invalid.endDate.0.0');
  expect(validationResult).toHaveProperty('invalid.startDate.1.0');
  expect(validationResult).not.toHaveProperty('invalid.endDate.1.0');
});

test('Invalid times are properly reported', () => {
  const validationResult = validateExceptionsDatesAndTimes(
    [
      {
        i: 0,
        lastRowI: 1,
        name: '',
        type: RowType.Open,
        rows: [
          {
            i: 0,
            startDate: '2000-01-01',
            startTime: '09:00',
            endDate: '2000-01-01',
            endTime: '09:00',
          },
          {
            i: 1,
            startDate: '2000-01-01',
            startTime: '09:00',
            endDate: '2000-01-01',
            endTime: '09:00',
          },
        ],
      },
    ],
    {
      startDate: {},
      startTime: { 0: { 0: { value: '08:00 AM' } as HTMLInputElement } },
      endDate: {},
      endTime: { 0: { 1: { value: '08:00 AM' } as HTMLInputElement } },
    },
    localeDateFormat,
    localeTimeFormat12
  );
  expect(validationResult).not.toBeUndefined();
  // time validation fails when ref is defined and improper
  expect(validationResult).toHaveProperty('invalid.startTime.0.0');
  expect(validationResult).toHaveProperty('invalid.endTime.0.1');

  expectRender(validationResult?.invalid?.startTime[0][0]).toBe(
    'Please enter a time in the hh:mm A format'
  );
});

test('Date order is checked', () => {
  const validationResult = validateExceptionsDatesAndTimes(
    [
      {
        i: 0,
        lastRowI: 0,
        name: '',
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
    localeTimeFormat12
  );
  expect(validationResult).not.toBeUndefined();
  expect(validationResult).toHaveProperty('invalid.startDate.0.0');
  expect(validationResult).toHaveProperty('invalid.endDate.0.0');

  expectRender(validationResult?.invalid?.startDate[0][0]).toBe(
    'End date must not be before the start date'
  );
});

test('Date-time order is checked', () => {
  const validationResult = validateExceptionsDatesAndTimes(
    [
      {
        i: 0,
        lastRowI: 0,
        name: '',
        type: RowType.Open,
        rows: [
          {
            i: 0,
            startDate: '2000-01-01',
            startTime: '13:00',
            endDate: '2000-01-01',
            endTime: '09:00',
          },
        ],
      },
    ],
    {
      startDate: { 0: { 0: { value: '01/01/2000' } as HTMLInputElement } },
      startTime: {},
      endDate: { 0: { 0: { value: '01/01/2000' } as HTMLInputElement } },
      endTime: {},
    },
    localeDateFormat,
    localeTimeFormat12
  );
  expect(validationResult).not.toBeUndefined();
  expect(validationResult).toHaveProperty('invalid.startTime.0.0');
  expect(validationResult).toHaveProperty('invalid.endTime.0.0');

  expectRender(validationResult?.invalid?.startTime[0][0]).toBe(
    'End date/time must not be before the start date/time'
  );
});

test('Valid rows are valid', () => {
  expect(
    validateExceptionsDatesAndTimes(
      [
        {
          i: 0,
          lastRowI: 0,
          name: '',
          type: RowType.Closed,
          rows: [
            {
              i: 0,
              startDate: '2000-01-01',
              startTime: undefined,
              endDate: '2000-01-02',
              endTime: undefined,
            },
          ],
        },
        {
          i: 1,
          lastRowI: 1,
          name: '',
          type: RowType.Open,
          rows: [
            {
              i: 0,
              startDate: '2000-01-01',
              startTime: '09:00',
              endDate: '2000-01-02',
              endTime: '13:00',
            },
            {
              i: 1,
              startDate: '2000-01-03',
              startTime: '09:00',
              endDate: '2000-01-04',
              endTime: '13:00',
            },
          ],
        },
      ],
      {
        startDate: {
          0: { 0: { value: '01/01/2000' } as HTMLInputElement },
          1: {
            0: { value: '01/01/2000' } as HTMLInputElement,
            1: { value: '01/03/2000' } as HTMLInputElement,
          },
        },
        startTime: {},
        endDate: {
          0: {
            0: { value: '01/02/2000' } as HTMLInputElement,
          },
          1: {
            0: { value: '01/02/2000' } as HTMLInputElement,
            1: { value: '01/04/2000' } as HTMLInputElement,
          },
        },
        endTime: {},
      },
      localeDateFormat,
      localeTimeFormat12
    )
  ).toBeUndefined();
});
