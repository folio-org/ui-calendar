import type { IntlShape } from 'react-intl';
import dayjs from './dayjs';
import getCurrentStatus, {
  getCurrentStatusNonFormatted
} from './getCurrentStatus';
import type { LocaleWeekdayInfo } from './WeekdayUtils';
import * as Calendars from '../test/data/Calendars';
import * as Dates from '../test/data/Dates';
import * as Weekdays from '../test/data/Weekdays';
import expectRender from '../test/util/expectRender';

const intl = {
  formatTime: jest.fn((t) => `||${dayjs(t).utc(false).format('HH:mm')}||`),
  formatDate: jest.fn((d) => `||${dayjs(d).utc(false).format('YYYY-MM-DD')}||`),
  formatMessage: jest.fn((m) => m.id)
} as unknown as IntlShape;

const localeWeekdays: LocaleWeekdayInfo[] = [
  { weekday: Weekdays.Sunday, short: 'XXXXX', long: '||Sunday||' },
  { weekday: Weekdays.Monday, short: 'XXXXX', long: '||Monday||' },
  { weekday: Weekdays.Tuesday, short: 'XXXXX', long: '||Tuesday||' },
  { weekday: Weekdays.Wednesday, short: 'XXXXX', long: '||Wednesday||' },
  { weekday: Weekdays.Thursday, short: 'XXXXX', long: '||Thursday||' },
  { weekday: Weekdays.Friday, short: 'XXXXX', long: '||Friday||' },
  { weekday: Weekdays.Saturday, short: 'XXXXX', long: '||Saturday||' }
];

test('24/7 calendars return as expected', () => {
  expect(
    getCurrentStatusNonFormatted(
      intl,
      Dates.JUN_1_DATE,
      Calendars.ALL_YEAR_SP_ONLINE_247
    )
  ).toStrictEqual({
    open: true,
    exceptional: false
  });
  expectRender(
    getCurrentStatus(
      intl,
      localeWeekdays,
      Dates.JUN_1_DATE,
      Calendars.ALL_YEAR_SP_ONLINE_247
    )
  ).toBe('Open');
});
