import * as Dates from '../test/data/Dates';
import { getRelativeDateProximity } from './DateUtils';

test('Relative date-times are calculated properly', () => {
  expect(getRelativeDateProximity(Dates.MAY_1_DATE, Dates.MAY_1_DATE)).toBe(
    'sameDay'
  );
  expect(getRelativeDateProximity(Dates.MAY_2_DATE, Dates.MAY_1_DATE)).toBe(
    'nextDay'
  );
  expect(getRelativeDateProximity(Dates.MAY_3_DATE, Dates.MAY_1_DATE)).toBe(
    'nextWeek'
  );
  expect(getRelativeDateProximity(Dates.MAY_4_DATE, Dates.MAY_1_DATE)).toBe(
    'nextWeek'
  );
  expect(getRelativeDateProximity(Dates.MAY_5_DATE, Dates.MAY_1_DATE)).toBe(
    'nextWeek'
  );
  expect(getRelativeDateProximity(Dates.MAY_6_DATE, Dates.MAY_1_DATE)).toBe(
    'nextWeek'
  );
  expect(getRelativeDateProximity(Dates.MAY_7_DATE, Dates.MAY_1_DATE)).toBe(
    'nextWeek'
  );
  expect(getRelativeDateProximity(Dates.MAY_8_DATE, Dates.MAY_1_DATE)).toBe(
    'sameElse'
  );
  expect(getRelativeDateProximity(Dates.MAY_14_DATE, Dates.MAY_1_DATE)).toBe(
    'sameElse'
  );
  expect(getRelativeDateProximity(Dates.JUN_1_DATE, Dates.MAY_1_DATE)).toBe(
    'sameElse'
  );
});
