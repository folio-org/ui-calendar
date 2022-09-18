import { isSameMonth, isSameMonthOrBefore } from './DateUtils';
import * as Dates from '../test/data/Dates';

test('isSameMonth works as expected', () => {
  expect(isSameMonth(Dates.MAY_14_DATE, Dates.MAY_2_DATE)).toBe(true);
  expect(isSameMonth(Dates.MAY_14_DATE, Dates.MAY_14_2001_DATE)).toBe(false);
  expect(isSameMonth(Dates.JUL_1_DATE, Dates.MAY_14_2001_DATE)).toBe(false);
  expect(isSameMonth(Dates.JUL_1_DATE, Dates.MAY_14_DATE)).toBe(false);

  expect(isSameMonth(Dates.MAY_2_DATE, Dates.MAY_14_DATE)).toBe(true);
  expect(isSameMonth(Dates.MAY_14_2001_DATE, Dates.MAY_14_DATE)).toBe(false);
  expect(isSameMonth(Dates.MAY_14_2001_DATE, Dates.JUL_1_DATE)).toBe(false);
  expect(isSameMonth(Dates.MAY_14_DATE, Dates.JUL_1_DATE)).toBe(false);
});

test('isSameMonthOrBefore works as expected', () => {
  expect(isSameMonthOrBefore(Dates.MAY_14_DATE, Dates.MAY_2_DATE)).toBe(true);
  expect(isSameMonthOrBefore(Dates.MAY_14_DATE, Dates.MAY_14_2001_DATE)).toBe(
    true
  );
  expect(isSameMonthOrBefore(Dates.JUL_1_DATE, Dates.MAY_14_2001_DATE)).toBe(
    true
  );
  expect(isSameMonthOrBefore(Dates.JUL_1_DATE, Dates.MAY_14_DATE)).toBe(false);

  expect(isSameMonthOrBefore(Dates.MAY_2_DATE, Dates.MAY_14_DATE)).toBe(true);
  expect(isSameMonthOrBefore(Dates.MAY_14_2001_DATE, Dates.MAY_14_DATE)).toBe(
    false
  );
  expect(isSameMonthOrBefore(Dates.MAY_14_2001_DATE, Dates.JUL_1_DATE)).toBe(
    false
  );
  expect(isSameMonthOrBefore(Dates.MAY_14_DATE, Dates.JUL_1_DATE)).toBe(true);
});
