import { IntlShape } from 'react-intl';
import * as Dates from '../test/data/Dates';
import getIntl from '../test/util/getIntl';
import { getLocalizedDate, getLocalizedTime } from './DateUtils';
import dayjs from './dayjs';

let intlEn: IntlShape;
let intlFr: IntlShape;

beforeAll(() => {
  intlEn = getIntl('en-US', 'EST');
  intlFr = getIntl('fr-FR', 'CET');
});

test('Localization time formatting methods return the expected results', () => {
  // all translations use "Midnight" in mocking
  expect(
    getLocalizedTime(intlFr, dayjs('00:00', 'HH:mm').tz('CET', true))
  ).toBe('Midnight');
  expect(
    getLocalizedTime(intlFr, dayjs('23:59', 'HH:mm').tz('CET', true))
  ).toBe('Midnight');
  expect(
    getLocalizedTime(intlEn, dayjs('00:00', 'HH:mm').tz('EST', true))
  ).toBe('Midnight');
  expect(
    getLocalizedTime(intlEn, dayjs('23:59', 'HH:mm').tz('EST', true))
  ).toBe('Midnight');

  expect(getLocalizedTime(intlFr, dayjs('00:00', 'HH:mm').utc(true))).toBe(
    '02:00'
  );
  expect(getLocalizedTime(intlFr, dayjs('23:59', 'HH:mm').utc(true))).toBe(
    '01:59'
  );
  expect(getLocalizedTime(intlEn, dayjs('00:00', 'HH:mm').utc(true))).toBe(
    '7:00 PM'
  );
  expect(getLocalizedTime(intlEn, dayjs('23:59', 'HH:mm').utc(true))).toBe(
    '6:59 PM'
  );

  expect(getLocalizedTime(intlFr, dayjs('08:00', 'HH:mm').utc(true))).toBe(
    '10:00'
  );
  expect(getLocalizedTime(intlFr, dayjs('15:00', 'HH:mm').utc(true))).toBe(
    '17:00'
  );
  expect(getLocalizedTime(intlFr, dayjs('08:00', 'HH:mm').utc(true))).toBe(
    '10:00'
  );
  expect(getLocalizedTime(intlFr, dayjs('15:00', 'HH:mm').utc(true))).toBe(
    '17:00'
  );
});

test('Localization date formatting methods return the expected results for en-us', () => {
  expect(getLocalizedDate(intlEn, Dates.MAY_14.tz('EST', true))).toBe(
    '5/14/2000'
  );
  expect(getLocalizedDate(intlEn, '2000-05-14')).toBe('5/14/2000');
});

test('Localization date formatting methods return the expected results for fr-fr', () => {
  expect(getLocalizedDate(intlFr, Dates.MAY_14.tz('CET'))).toBe('14/05/2000');
  expect(getLocalizedDate(intlFr, '2000-05-14')).toBe('14/05/2000');
});
