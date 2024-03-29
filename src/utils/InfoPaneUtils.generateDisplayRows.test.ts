import { cleanup, render } from '@testing-library/react';
import { ReactNode } from 'react';
import { IntlShape } from 'react-intl';
import * as Calendars from '../test/data/Calendars';
import * as Weekdays from '../test/data/Weekdays';
import getIntl from '../test/util/getIntl';
import withIntlConfiguration from '../test/util/withIntlConfiguration';
import {
  generateDisplayRows,
  get247Rows,
  splitOpeningsIntoDays,
} from './InfoPaneUtils';
import { LocaleWeekdayInfo } from './WeekdayUtils';

const EN_DASH = '\u{2013}';
const NBSP = '\u{00a0}';

let intl: IntlShape;

beforeAll(() => {
  intl = getIntl('en-US', 'UTC');
});

// random order to ensure display preferences are respected
const localeWeekdays: LocaleWeekdayInfo[] = [
  { weekday: Weekdays.Friday, short: 'Fri', long: 'Friday' },
  { weekday: Weekdays.Saturday, short: 'Sat', long: 'Saturday' },
  { weekday: Weekdays.Monday, short: 'Mon', long: 'Monday' },
  { weekday: Weekdays.Wednesday, short: 'Wed', long: 'Wednesday' },
  { weekday: Weekdays.Thursday, short: 'Thu', long: 'Thursday' },
  { weekday: Weekdays.Sunday, short: 'Sun', long: 'Sunday' },
  { weekday: Weekdays.Tuesday, short: 'Tue', long: 'Tuesday' },
];

function renderToTextContent(elements: ReactNode[][]): (string | null)[][] {
  const results = elements.map((row) => {
    return row.map(
      (el) => render(withIntlConfiguration(el)).container.textContent,
    );
  });
  cleanup();
  return results;
}

test('24/7 rows display correctly', () => {
  const rows = get247Rows(intl, localeWeekdays).map((row) => [
    row.day,
    row.startTime,
    row.endTime,
  ]);

  expect(renderToTextContent(rows)).toStrictEqual([
    ['Friday', EN_DASH, EN_DASH],
    ['Saturday', EN_DASH, EN_DASH],
    ['Monday', EN_DASH, EN_DASH],
    ['Wednesday', EN_DASH, EN_DASH],
    ['Thursday', EN_DASH, EN_DASH],
    ['Sunday', EN_DASH, EN_DASH],
    ['Tuesday', EN_DASH, EN_DASH],
  ]);
});

test('Closed rows display correctly', () => {
  const rows = generateDisplayRows(
    intl,
    localeWeekdays,
    splitOpeningsIntoDays([]),
  ).map((row) => [row.day, row.startTime, row.endTime]);

  expect(renderToTextContent(rows)).toStrictEqual([
    ['Friday', 'Closed', `${NBSP}Closed`],
    ['Saturday', 'Closed', `${NBSP}Closed`],
    ['Monday', 'Closed', `${NBSP}Closed`],
    ['Wednesday', 'Closed', `${NBSP}Closed`],
    ['Thursday', 'Closed', `${NBSP}Closed`],
    ['Sunday', 'Closed', `${NBSP}Closed`],
    ['Tuesday', 'Closed', `${NBSP}Closed`],
  ]);
});

test('Open rows display correctly', () => {
  const rows = generateDisplayRows(
    intl,
    localeWeekdays,
    splitOpeningsIntoDays(Calendars.SUMMER_SP_1_2.normalHours),
  ).map((row) => [row.day, row.startTime, row.endTime]);

  // rows with multiple openings will be concatenated together by start/end
  // e.g. 02:00 - 04:00 and 06:00 - 08:00 will be "02:0006:00" - "04:0008:00"
  expect(renderToTextContent(rows)).toStrictEqual([
    ['Friday', '9:00 AM1:30 PM', '12:00 PM8:00 PM'],
    ['Saturday', '9:00 AM', '8:00 PM'],
    ['Monday', '9:00 AM', `1:00 AM${NBSP}*`],
    ['Wednesday', '9:00 AM', '11:00 PM'],
    ['Thursday', '9:00 AM', '11:00 PM'],
    ['Sunday', 'Closed', `${NBSP}Closed`],
    ['Tuesday', '9:00 AM', '11:00 PM'],
  ]);
});

test('Multi-day opening rows display correctly', () => {
  const rows = generateDisplayRows(
    intl,
    localeWeekdays,
    splitOpeningsIntoDays([
      {
        startDay: Weekdays.Friday,
        startTime: '09:00',
        endDay: Weekdays.Tuesday,
        endTime: '01:00',
      },
    ]),
  ).map((row) => [row.day, row.startTime, row.endTime]);

  // rows with multiple openings will be concatenated together by start/end
  // e.g. 02:00 - 04:00 and 06:00 - 08:00 will be "02:0006:00" - "04:0008:00"
  expect(renderToTextContent(rows)).toStrictEqual([
    ['Friday', '9:00 AM', EN_DASH],
    ['Saturday', EN_DASH, EN_DASH],
    ['Monday', EN_DASH, `1:00 AM${NBSP}*`],
    ['Wednesday', 'Closed', `${NBSP}Closed`],
    ['Thursday', 'Closed', `${NBSP}Closed`],
    ['Sunday', EN_DASH, EN_DASH],
    ['Tuesday', 'Closed', `${NBSP}Closed`],
  ]);
});
