import { IntlShape } from 'react-intl';
import getIntl from '../test/util/getIntl';
import { getLocalizedDate, getLocalizedTime } from './DateUtils';

let intlEn: IntlShape;
let intlFr: IntlShape;

beforeAll(() => {
  intlEn = getIntl('en-US', 'EST');
  intlFr = getIntl('fr-FR', 'CET');
});

test('Localization time formatting methods return the expected results', () => {
  // all translations use "Midnight" in mocking
  expect(getLocalizedTime(intlFr, '00:00')).toBe('Midnight');
  expect(getLocalizedTime(intlFr, '23:59')).toBe('Midnight');
  expect(getLocalizedTime(intlEn, '00:00')).toBe('Midnight');
  expect(getLocalizedTime(intlEn, '23:59')).toBe('Midnight');

  expect(getLocalizedTime(intlFr, '02:00')).toBe('02:00');
  expect(getLocalizedTime(intlFr, '01:59')).toBe('01:59');
  expect(getLocalizedTime(intlEn, '19:00')).toBe('7:00 PM');
  expect(getLocalizedTime(intlEn, '18:59')).toBe('6:59 PM');

  expect(getLocalizedTime(intlFr, '10:00')).toBe('10:00');
  expect(getLocalizedTime(intlFr, '17:00')).toBe('17:00');
  expect(getLocalizedTime(intlFr, '10:00')).toBe('10:00');
  expect(getLocalizedTime(intlFr, '17:00')).toBe('17:00');
});

test('Localization date formatting methods return the expected results for en-us', () => {
  expect(getLocalizedDate(intlEn, '2000-05-14')).toBe('5/14/2000');
});

test('Localization date formatting methods return the expected results for fr-fr', () => {
  expect(getLocalizedDate(intlFr, '2000-05-14')).toBe('14/05/2000');
});
