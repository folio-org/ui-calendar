import * as Dates from '../test/data/Dates';
import { dayjsCompare } from './DateUtils';

test('Dayjs comparison works as expected', () => {
  expect(dayjsCompare(Dates.JAN_1, Dates.JAN_1)).toBe(0);
  expect(dayjsCompare(Dates.JAN_1, Dates.DEC_1)).toBe(-1);
  expect(dayjsCompare(Dates.DEC_1, Dates.JAN_1)).toBe(1);
});
