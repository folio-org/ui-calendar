import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import { ReactNode } from 'react';
import { IntlShape } from 'react-intl';
import * as Calendars from '../test/data/Calendars';
import getIntl from '../test/util/getIntl';
import withIntlConfiguration from '../test/util/withIntlConfiguration';
import { generateExceptionalOpeningRows } from './InfoPaneUtils';

let intl: IntlShape;

beforeAll(() => {
  intl = getIntl('en-US', 'UTC');
});

function renderToTextContent(elements: ReactNode[][]): (string | null)[][] {
  const results = elements.map((row) => {
    return row.map(
      (el) => render(withIntlConfiguration(el)).container.textContent
    );
  });
  cleanup();
  return results;
}

test('No exceptions display correctly', () => {
  expect(generateExceptionalOpeningRows(intl, [])).toStrictEqual([]);
});

test('An opening exception displays correctly', () => {
  expect(
    renderToTextContent(
      generateExceptionalOpeningRows(intl, [
        Calendars.SUMMER_SP_1_2.exceptions[1],
      ]).map((row) => [row.name, row.start, row.end])
    )
  ).toStrictEqual([
    [
      'Community Event (Longer Hours)',
      '5/13/20007:00 AM5/14/20005:00 AM5/15/20006:00 AM',
      '5/13/2000Midnight5/14/20009:59 PM5/15/200010:59 PM',
    ],
  ]);
});
