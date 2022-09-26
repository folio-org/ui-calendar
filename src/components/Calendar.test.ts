import type { IntlShape } from 'react-intl';
import * as cal from './Calendar';
import { getLocaleWeekdays } from '../utils/WeekdayUtils';
import expectRender from '../test/util/expectRender';
import getIntl from '../test/util/getIntl';
import * as Dates from '../test/data/Dates';

let intlEn: IntlShape;
let intlFr: IntlShape;
let intlAr: IntlShape;

beforeAll(() => {
  intlEn = getIntl('en-US', 'EST');
  intlFr = getIntl('fr-FR', 'CET');
  intlAr = getIntl('ar-DZ', 'CET');
});

test('Calendar.tsx getWeekdayLabels works as expected', () => {
  const weekdaysEn = getLocaleWeekdays(intlEn);
  expectRender(cal.getWeekdayLabels(weekdaysEn)[0]).toBe('Sun');
  expectRender(cal.getWeekdayLabels(weekdaysEn)[6]).toBe('Sat');
  const weekdaysFr = getLocaleWeekdays(intlFr);
  expectRender(cal.getWeekdayLabels(weekdaysFr)[0]).toBe('lun.');
  expectRender(cal.getWeekdayLabels(weekdaysFr)[6]).toBe('dim.');
  const weekdaysAr = getLocaleWeekdays(intlAr);
  expectRender(cal.getWeekdayLabels(weekdaysAr)[0]).toBe('السبت');
  expectRender(cal.getWeekdayLabels(weekdaysAr)[6]).toBe('الجمعة');
});
