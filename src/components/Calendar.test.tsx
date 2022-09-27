import type { IntlShape } from 'react-intl';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calendar, { getWeekdayLabels } from './Calendar';
import { getLocaleWeekdays } from '../utils/WeekdayUtils';
import expectRender from '../test/util/expectRender';
import getIntl from '../test/util/getIntl';
import * as Dates from '../test/data/Dates';
import withIntlConfiguration from '../test/util/withIntlConfiguration';

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
  expectRender(getWeekdayLabels(weekdaysEn)[0]).toBe('Sun');
  expectRender(getWeekdayLabels(weekdaysEn)[6]).toBe('Sat');
  const weekdaysFr = getLocaleWeekdays(intlFr);
  expectRender(getWeekdayLabels(weekdaysFr)[0]).toBe('lun.');
  expectRender(getWeekdayLabels(weekdaysFr)[6]).toBe('dim.');
  const weekdaysAr = getLocaleWeekdays(intlAr);
  expectRender(getWeekdayLabels(weekdaysAr)[0]).toBe('السبت');
  expectRender(getWeekdayLabels(weekdaysAr)[6]).toBe('الجمعة');
});

test('Calendar.tsx Calendar works as expected', () => {
  const setMonthBasis = jest.fn();
  expectRender(<Calendar monthBasis={Dates.JAN_1_DATE} setMonthBasis={setMonthBasis} events={{ '2022-03-13': <span> something </span> }} />);
  expectRender(<Calendar monthBasis={Dates.MAR_1_DATE} setMonthBasis={setMonthBasis} events={{ '': <span>1</span> }} />);
  expectRender(<Calendar monthBasis={Dates.DEC_1_DATE} setMonthBasis={setMonthBasis} events={{ '2000-12-01': <span>1</span> }} />);
});

test('Calendar.tsx Calendar left button works as expected', async () => {
  const setMonthBasis = jest.fn();
  render(withIntlConfiguration(<Calendar monthBasis={Dates.DEC_1_DATE} setMonthBasis={setMonthBasis} events={{ '2000-12-01': <span>1</span> }} />));
  await userEvent.click(screen.getByRole('button', { name: 'arrow-left' }));
  await userEvent.click(screen.getByRole('button', { name: 'arrow-left' }));
  await userEvent.click(screen.getByRole('button', { name: 'arrow-left' }));
  await userEvent.click(screen.getByRole('button', { name: 'arrow-right' }));
  expect(setMonthBasis).toHaveBeenCalledTimes(4);
});
