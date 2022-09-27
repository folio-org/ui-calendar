import * as Dates from '../test/data/Dates';
import { minDate, maxDate} from './DateUtils';

test('min and max date work for null', () => {
  expect(minDate([])).toBe(null);
  expect(maxDate([])).toBe(null);
});

test('min and max date work for normal input', () => {
  expect(minDate([Dates.JAN_1_DATE])).toStrictEqual(Dates.JAN_1_DATE);
  expect(maxDate([Dates.JAN_1_DATE])).toStrictEqual(Dates.JAN_1_DATE);
});

test('min and max date work for normal input', () => {
  expect(minDate([Dates.JAN_1_DATE, Dates.DEC_1_2001_DATE, Dates.DEC_1_DATE, Dates.MAY_14_2001_DATE])).toStrictEqual(Dates.JAN_1_DATE);
  expect(minDate([Dates.DEC_1_2001_DATE, Dates.DEC_1_DATE, Dates.MAY_14_2001_DATE])).toStrictEqual(Dates.DEC_1_DATE);
  expect(maxDate([Dates.JAN_1_DATE, Dates.DEC_1_2001_DATE, Dates.DEC_1_DATE, Dates.MAY_14_2001_DATE])).toStrictEqual(Dates.DEC_1_2001_DATE);
});
