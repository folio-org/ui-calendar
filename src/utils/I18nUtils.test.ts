import type { IntlShape } from 'react-intl';
import getIntl from '../test/util/getIntl';
import { formatList } from './I18nUtils';

let intlEn: IntlShape;
let intlFr: IntlShape;

beforeAll(() => {
  intlEn = getIntl('en-US');
  intlFr = getIntl('fr-FR');
});

test('Localizing a list gives the expected result in en-us', () => {
  expect(formatList(intlEn, ['A'])).toBe('A');
  expect(formatList(intlEn, ['A', 'B'])).toBe('A and B');
  expect(formatList(intlEn, ['A', 'B', 'C'])).toBe('A, B, and C');
  expect(formatList(intlEn, ['A', 'B', 'C', 'D'])).toBe('A, B, C, and D');
});

test('Localizing a list gives the expected result in fr-fr', () => {
  expect(formatList(intlFr, ['A'])).toBe('A');
  expect(formatList(intlFr, ['A', 'B'])).toBe('A et B');
  expect(formatList(intlFr, ['A', 'B', 'C'])).toBe('A, B et C');
  expect(formatList(intlFr, ['A', 'B', 'C', 'D'])).toBe('A, B, C et D');
});
