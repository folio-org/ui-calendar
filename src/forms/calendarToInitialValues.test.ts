import RowType from '../components/fields/RowType';
import DataRepository from '../data/DataRepository';
import * as Calendars from '../test/data/Calendars';
import * as Weekdays from '../test/data/Weekdays';
import { LocaleWeekdayInfo } from '../utils/WeekdayUtils';
import calendarToInitialValues, {
  addZToExceptions,
  addZToHours,
  exceptionsToInitialValues,
  hoursOfOperationToInitialValues,
} from './calendarToInitialValues';

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

test('UTC Z suffixes are added to times, as applicable', () => {
  expect(
    addZToHours([
      {
        type: RowType.Open,
        startDay: undefined,
        startTime: '09:00Z',
        endDay: undefined,
        endTime: '17:00Z',
      },
      {
        type: RowType.Open,
        startDay: undefined,
        startTime: undefined,
        endDay: undefined,
        endTime: undefined,
      },
    ])
  ).toStrictEqual([
    {
      type: RowType.Open,
      startDay: undefined,
      startTime: '09:00ZZ',
      endDay: undefined,
      endTime: '17:00ZZ',
    },
    {
      type: RowType.Open,
      startDay: undefined,
      startTime: undefined,
      endDay: undefined,
      endTime: undefined,
    },
  ]);

  expect(
    addZToExceptions([
      {
        name: 'Exception 1',
        type: RowType.Open,
        rows: [
          {
            startDate: undefined,
            startTime: '09:00',
            endDate: undefined,
            endTime: '17:00',
          },
          {
            startDate: undefined,
            startTime: undefined,
            endDate: undefined,
            endTime: undefined,
          },
        ],
      },
    ])
  ).toStrictEqual([
    {
      name: 'Exception 1',
      type: RowType.Open,
      rows: [
        {
          startDate: undefined,
          startTime: '09:00Z',
          endDate: undefined,
          endTime: '17:00Z',
        },
        {
          startDate: undefined,
          startTime: undefined,
          endDate: undefined,
          endTime: undefined,
        },
      ],
    },
  ]);
});

describe('Calendar openings converted to initial rows correctly', () => {
  test('No rows result in filler closed rows', () => {
    expect(
      hoursOfOperationToInitialValues([], localeWeekdaysWednesday)
    ).toStrictEqual([
      {
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
      hoursOfOperationToInitialValues(
        [
          {
            startDay: Weekdays.Wednesday,
            startTime: '00:00',
            endDay: Weekdays.Wednesday,
            endTime: '20:00',
          },
        ],
        localeWeekdaysSunday
      )
    ).toStrictEqual([
      {
        type: RowType.Closed,
        startDay: Weekdays.Sunday,
        startTime: undefined,
        endDay: Weekdays.Tuesday,
        endTime: undefined,
      },
      {
        type: RowType.Open,
        startDay: Weekdays.Wednesday,
        startTime: '00:00Z',
        endDay: Weekdays.Wednesday,
        endTime: '20:00Z',
      },
      {
        type: RowType.Closed,
        startDay: Weekdays.Thursday,
        startTime: undefined,
        endDay: Weekdays.Saturday,
        endTime: undefined,
      },
    ]);

    expect(
      hoursOfOperationToInitialValues(
        [
          {
            startDay: Weekdays.Sunday,
            startTime: '00:00',
            endDay: Weekdays.Sunday,
            endTime: '20:00',
          },
          {
            startDay: Weekdays.Saturday,
            startTime: '02:00',
            endDay: Weekdays.Saturday,
            endTime: '22:00',
          },
        ],
        localeWeekdaysSunday
      )
    ).toStrictEqual([
      {
        type: RowType.Open,
        startDay: Weekdays.Sunday,
        startTime: '00:00Z',
        endDay: Weekdays.Sunday,
        endTime: '20:00Z',
      },
      {
        type: RowType.Closed,
        startDay: Weekdays.Monday,
        startTime: undefined,
        endDay: Weekdays.Friday,
        endTime: undefined,
      },
      {
        type: RowType.Open,
        startDay: Weekdays.Saturday,
        startTime: '02:00Z',
        endDay: Weekdays.Saturday,
        endTime: '22:00Z',
      },
    ]);
  });

  test('Multi-day opening results in proper filler row allocation', () => {
    expect(
      hoursOfOperationToInitialValues(
        [
          {
            startDay: Weekdays.Friday,
            startTime: '00:00',
            endDay: Weekdays.Monday,
            endTime: '20:00',
          },
        ],
        localeWeekdaysSunday
      )
    ).toStrictEqual([
      {
        type: RowType.Closed,
        startDay: Weekdays.Tuesday,
        startTime: undefined,
        endDay: Weekdays.Thursday,
        endTime: undefined,
      },
      {
        type: RowType.Open,
        startDay: Weekdays.Friday,
        startTime: '00:00Z',
        endDay: Weekdays.Monday,
        endTime: '20:00Z',
      },
    ]);

    expect(
      hoursOfOperationToInitialValues(
        [
          {
            startDay: Weekdays.Friday,
            startTime: '00:00',
            endDay: Weekdays.Monday,
            endTime: '20:00',
          },
        ],
        localeWeekdaysWednesday
      )
    ).toStrictEqual([
      {
        type: RowType.Closed,
        startDay: Weekdays.Wednesday,
        startTime: undefined,
        endDay: Weekdays.Thursday,
        endTime: undefined,
      },
      {
        type: RowType.Open,
        startDay: Weekdays.Friday,
        startTime: '00:00Z',
        endDay: Weekdays.Monday,
        endTime: '20:00Z',
      },
      {
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
      hoursOfOperationToInitialValues(
        [
          {
            startDay: Weekdays.Sunday,
            startTime: '00:00',
            endDay: Weekdays.Sunday,
            endTime: '04:00',
          },
          {
            startDay: Weekdays.Sunday,
            startTime: '09:00',
            endDay: Weekdays.Sunday,
            endTime: '20:00',
          },
        ],
        localeWeekdaysSunday
      )
    ).toStrictEqual([
      {
        type: RowType.Open,
        startDay: Weekdays.Sunday,
        startTime: '00:00Z',
        endDay: Weekdays.Sunday,
        endTime: '04:00Z',
      },
      {
        type: RowType.Open,
        startDay: Weekdays.Sunday,
        startTime: '09:00Z',
        endDay: Weekdays.Sunday,
        endTime: '20:00Z',
      },
      {
        type: RowType.Closed,
        startDay: Weekdays.Monday,
        startTime: undefined,
        endDay: Weekdays.Saturday,
        endTime: undefined,
      },
    ]);

    expect(
      hoursOfOperationToInitialValues(
        [
          {
            startDay: Weekdays.Sunday,
            startTime: '09:00',
            endDay: Weekdays.Sunday,
            endTime: '20:00',
          },
          {
            startDay: Weekdays.Sunday,
            startTime: '00:00',
            endDay: Weekdays.Sunday,
            endTime: '04:00',
          },
        ],
        localeWeekdaysSunday
      )
    ).toStrictEqual([
      {
        type: RowType.Open,
        startDay: Weekdays.Sunday,
        startTime: '00:00Z',
        endDay: Weekdays.Sunday,
        endTime: '04:00Z',
      },
      {
        type: RowType.Open,
        startDay: Weekdays.Sunday,
        startTime: '09:00Z',
        endDay: Weekdays.Sunday,
        endTime: '20:00Z',
      },
      {
        type: RowType.Closed,
        startDay: Weekdays.Monday,
        startTime: undefined,
        endDay: Weekdays.Saturday,
        endTime: undefined,
      },
    ]);
  });
});

test('Exceptions convert properly', () => {
  expect(
    exceptionsToInitialValues([
      {
        name: 'Foo',
        startDate: '2021-03-01',
        endDate: '2021-03-01',
        openings: [],
      },
      {
        name: 'Bar',
        startDate: '2021-03-02',
        endDate: '2021-03-10',
        openings: [
          {
            startDate: '2021-03-02',
            startTime: '00:00',
            endDate: '2021-03-03',
            endTime: '20:00',
          },
          {
            startDate: '2021-03-04',
            startTime: '00:00',
            endDate: '2021-03-04',
            endTime: '20:00',
          },
          {
            startDate: '2021-03-04',
            startTime: '21:00',
            endDate: '2021-03-04',
            endTime: '22:00',
          },
          {
            startDate: '2021-03-04',
            startTime: '23:00',
            endDate: '2021-03-04',
            endTime: '23:30',
          },
        ],
      },
      {
        name: 'Baz',
        startDate: '2021-02-11',
        endDate: '2021-02-11',
        openings: [],
      },
    ])
  ).toStrictEqual([
    {
      name: 'Baz',
      rows: [
        {
          endDate: '2021-02-11',
          endTime: undefined,
          startDate: '2021-02-11',
          startTime: undefined,
        },
      ],
      type: RowType.Closed,
    },
    {
      name: 'Foo',
      rows: [
        {
          endDate: '2021-03-01',
          endTime: undefined,
          startDate: '2021-03-01',
          startTime: undefined,
        },
      ],
      type: RowType.Closed,
    },
    {
      name: 'Bar',
      rows: [
        {
          endDate: '2021-03-03',
          endTime: '20:00Z',
          startDate: '2021-03-02',
          startTime: '00:00Z',
        },
        {
          endDate: '2021-03-04',
          endTime: '20:00Z',
          startDate: '2021-03-04',
          startTime: '00:00Z',
        },
        {
          endDate: '2021-03-04',
          endTime: '22:00Z',
          startDate: '2021-03-04',
          startTime: '21:00Z',
        },
        {
          endDate: '2021-03-04',
          endTime: '23:30Z',
          startDate: '2021-03-04',
          startTime: '23:00Z',
        },
      ],
      type: RowType.Open,
    },
  ]);
});

test('Default method works as expected', () => {
  expect(
    calendarToInitialValues(
      {} as DataRepository,
      localeWeekdaysSunday,
      undefined
    )
  ).toStrictEqual({
    name: undefined,
    'start-date': undefined,
    'end-date': undefined,
    'service-points': [],
    'hours-of-operation': [],
    exceptions: [],
  });
  expect(
    calendarToInitialValues(
      {
        getServicePointsFromIds: jest.fn(() => []),
      } as unknown as DataRepository,
      localeWeekdaysSunday,
      Calendars.SPRING_UNASSIGNED
    )
  ).not.toStrictEqual({
    name: undefined,
    'start-date': undefined,
    'end-date': undefined,
    'service-points': [],
    'hours-of-operation': [],
    exceptions: [],
  });
});
