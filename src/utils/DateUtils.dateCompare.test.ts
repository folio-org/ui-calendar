import * as Dates from '../test/data/Dates';
import { dateCompare } from './DateUtils';

test('Dayjs comparison works as expected', () => {
  expect(dateCompare(Dates.JAN_1_DATE, Dates.JAN_1_DATE)).toBe(0);
  expect(dateCompare(Dates.JAN_1_DATE, Dates.DEC_1_DATE)).toBe(-1);
  expect(dateCompare(Dates.DEC_1_DATE, Dates.JAN_1_DATE)).toBe(1);
});
