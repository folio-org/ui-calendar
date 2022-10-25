import { IntlShape } from 'react-intl';
import * as Dates from '../test/data/Dates';
import * as Weekdays from '../test/data/Weekdays';
import expectRender from '../test/util/expectRender';
import getIntl from '../test/util/getIntl';
import type { Calendar } from '../types/types';
import dayjs from './dayjs';
import getCurrentStatus, {
  getCurrentStatusNonFormatted
} from './getCurrentStatus';
import { LocaleWeekdayInfo } from './WeekdayUtils';

let intl: IntlShape;

beforeAll(() => {
  intl = {
    ...getIntl('en-US'),
    formatTime: jest.fn((t) => `||${dayjs(t).utc(false).format('HH:mm')}||`),
    formatDate: jest.fn(
      (d) => `||${dayjs(d).utc(false).format('YYYY-MM-DD')}||`
    )
  };
});

const localeWeekdays: LocaleWeekdayInfo[] = [
  { weekday: Weekdays.Sunday, short: 'XXXXX', long: '||Sunday||' },
  { weekday: Weekdays.Monday, short: 'XXXXX', long: '||Monday||' },
  { weekday: Weekdays.Tuesday, short: 'XXXXX', long: '||Tuesday||' },
  { weekday: Weekdays.Wednesday, short: 'XXXXX', long: '||Wednesday||' },
  { weekday: Weekdays.Thursday, short: 'XXXXX', long: '||Thursday||' },
  { weekday: Weekdays.Friday, short: 'XXXXX', long: '||Friday||' },
  { weekday: Weekdays.Saturday, short: 'XXXXX', long: '||Saturday||' }
];

const calendarTemplate: Calendar = {
  id: '00000000-0000-0000-0000-000000000000',
  name: 'Sample calendar',
  assignments: [],
  startDate: '2000-01-01',
  endDate: '2000-12-31',
  normalHours: [],
  exceptions: []
};

test('No normal openings returns appropriate closure info', () => {
  const noNormalOpeningCalendar = calendarTemplate;
  expect(
    getCurrentStatusNonFormatted(
      intl,
      Dates.JUN_1_DATE,
      noNormalOpeningCalendar
    )
  ).toStrictEqual({
    open: false,
    exceptional: false
  });
  expectRender(
    getCurrentStatus(
      intl,
      localeWeekdays,
      Dates.JUN_1_DATE,
      noNormalOpeningCalendar
    )
  ).toBe('Closed');
});

test('No normal openings on the day returns appropriate closure info', () => {
  const noNormalOpeningsOnMondayCalendar: Calendar = {
    ...calendarTemplate,
    normalHours: [
      {
        startDay: Weekdays.Tuesday,
        startTime: '05:00',
        endDay: Weekdays.Sunday,
        endTime: '22:00'
      }
    ]
  };
  expect(
    getCurrentStatusNonFormatted(
      intl,
      Dates.MAY_1_DATE,
      noNormalOpeningsOnMondayCalendar
    )
  ).toStrictEqual({
    open: false,
    exceptional: false
  });
  expectRender(
    getCurrentStatus(
      intl,
      localeWeekdays,
      Dates.MAY_1_DATE,
      noNormalOpeningsOnMondayCalendar
    )
  ).toBe('Closed');
});

test('Opening closing more than a day from now returns appropriate status', () => {
  // closing a long time away
  const closingLongAwayCalendar: Calendar = {
    ...calendarTemplate,
    normalHours: [
      {
        startDay: Weekdays.Sunday,
        startTime: '05:00',
        endDay: Weekdays.Saturday,
        endTime: '22:00'
      }
    ]
  };
  expect(
    getCurrentStatusNonFormatted(
      intl,
      Dates.MAY_1_DATE,
      closingLongAwayCalendar
    )
  ).toStrictEqual({
    open: true,
    exceptional: false,
    nextEvent: {
      proximity: 'otherWeekday',
      weekday: Weekdays.Saturday,
      date: undefined,
      time: '||22:00||'
    }
  });
  expectRender(
    getCurrentStatus(
      intl,
      localeWeekdays,
      Dates.MAY_1_DATE,
      closingLongAwayCalendar
    )
  ).toBe('Open until ||Saturday|| at ||22:00||');
});

test('Opening closing tomorrow returns appropriate status', () => {
  // closing within the next week
  const closingTomorrowCalendar: Calendar = {
    ...calendarTemplate,
    normalHours: [
      {
        startDay: Weekdays.Sunday,
        startTime: '05:00',
        endDay: Weekdays.Tuesday,
        endTime: '22:00'
      }
    ]
  };
  expect(
    getCurrentStatusNonFormatted(
      intl,
      Dates.MAY_1_DATE,
      closingTomorrowCalendar
    )
  ).toStrictEqual({
    open: true,
    exceptional: false,
    nextEvent: {
      proximity: 'nextDay',
      weekday: undefined,
      date: undefined,
      time: '||22:00||'
    }
  });
  expectRender(
    getCurrentStatus(
      intl,
      localeWeekdays,
      Dates.MAY_1_DATE,
      closingTomorrowCalendar
    )
  ).toBe('Open until tomorrow at ||22:00||');
});

test('Opening closing the same day returns appropriate status', () => {
  // closing tonight
  const closingTonightCalendar = {
    ...calendarTemplate,
    normalHours: [
      {
        startDay: Weekdays.Sunday,
        startTime: '05:00',
        endDay: Weekdays.Monday,
        endTime: '22:00'
      }
    ]
  };
  expect(
    getCurrentStatusNonFormatted(intl, Dates.MAY_1_DATE, closingTonightCalendar)
  ).toStrictEqual({
    open: true,
    exceptional: false,
    nextEvent: {
      proximity: 'sameDay',
      weekday: undefined,
      date: undefined,
      time: '||22:00||'
    }
  });
  expectRender(
    getCurrentStatus(
      intl,
      localeWeekdays,
      Dates.MAY_1_DATE,
      closingTonightCalendar
    )
  ).toBe('Open until ||22:00||');
});

test('Closed opening more than a day away returns appropriate status', () => {
  // closing within the next week
  const openingNextWeekCalendar = {
    ...calendarTemplate,
    normalHours: [
      {
        startDay: Weekdays.Friday,
        startTime: '05:00',
        endDay: Weekdays.Saturday,
        endTime: '22:00'
      }
    ]
  };
  expect(
    getCurrentStatusNonFormatted(
      intl,
      Dates.MAY_1_DATE,
      openingNextWeekCalendar
    )
  ).toStrictEqual({
    open: false,
    exceptional: false
  });
  expectRender(
    getCurrentStatus(
      intl,
      localeWeekdays,
      Dates.MAY_1_DATE,
      openingNextWeekCalendar
    )
  ).toBe('Closed');
});

test('Closed opening tomorrow returns appropriate status', () => {
  // closing tomorrow
  const openingTomorrowCalendar = {
    ...calendarTemplate,
    normalHours: [
      {
        startDay: Weekdays.Tuesday,
        startTime: '05:00',
        endDay: Weekdays.Saturday,
        endTime: '22:00'
      }
    ]
  };
  expect(
    getCurrentStatusNonFormatted(
      intl,
      Dates.MAY_1_DATE,
      openingTomorrowCalendar
    )
  ).toStrictEqual({
    open: false,
    exceptional: false
  });
  expectRender(
    getCurrentStatus(
      intl,
      localeWeekdays,
      Dates.MAY_1_DATE,
      openingTomorrowCalendar
    )
  ).toBe('Closed');
});

test('Closed opening the same day returns appropriate status', () => {
  // closing tonight
  const openingTonightCalendar = {
    ...calendarTemplate,
    normalHours: [
      {
        startDay: Weekdays.Monday,
        startTime: '05:00',
        endDay: Weekdays.Saturday,
        endTime: '22:00'
      }
    ]
  };
  expect(
    getCurrentStatusNonFormatted(intl, Dates.MAY_1_DATE, openingTonightCalendar)
  ).toStrictEqual({
    open: false,
    exceptional: false,
    nextEvent: {
      proximity: 'sameDay',
      weekday: undefined,
      date: undefined,
      time: '||05:00||'
    }
  });
  expectRender(
    getCurrentStatus(
      intl,
      localeWeekdays,
      Dates.MAY_1_DATE,
      openingTonightCalendar
    )
  ).toBe('Closed until ||05:00||');
});

test('Closed after last opening returns appropriate status', () => {
  // closing tonight
  const openingTonightCalendar = {
    ...calendarTemplate,
    normalHours: [
      {
        startDay: Weekdays.Monday,
        startTime: '05:00',
        endDay: Weekdays.Monday,
        endTime: '22:00'
      }
    ]
  };
  expect(
    getCurrentStatusNonFormatted(
      intl,
      new Date(2000, 4, 1, 23),
      openingTonightCalendar
    )
  ).toStrictEqual({
    open: false,
    exceptional: false
  });
  expectRender(
    getCurrentStatus(
      intl,
      localeWeekdays,
      new Date(2000, 4, 1, 23),
      openingTonightCalendar
    )
  ).toBe('Closed');
});
