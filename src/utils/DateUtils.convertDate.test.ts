import * as Dates from '../test/data/Dates';
import { dateToYYYYMMDD, dateFromYYYYMMDD } from './DateUtils';

test('dateToYYYYMMDD comparison works as expected', () => {
  expect(dateToYYYYMMDD(Dates.JAN_1_DATE)).toBe('2000-01-01');
  expect(dateToYYYYMMDD(Dates.OCT_1_DATE)).toBe('2000-10-01');
  expect(dateToYYYYMMDD(Dates.MAY_14_2001_DATE)).toBe('2001-05-14');
  expect(dateToYYYYMMDD(Dates.DEC_17_DATE)).toBe('2000-12-17');
});

test('dateFromYYYYMMDD comparison works as expected', () => {
  expect(dateFromYYYYMMDD('2000-01-01')).toStrictEqual(Dates.JAN_1_DATE);
  expect(dateFromYYYYMMDD('2000-12-01')).toStrictEqual(Dates.DEC_1_DATE);
  expect(dateFromYYYYMMDD('2001-05-14')).toStrictEqual(Dates.MAY_14_2001_DATE);
  expect(dateFromYYYYMMDD('2000-12-17')).toStrictEqual(Dates.DEC_17_DATE);
});
