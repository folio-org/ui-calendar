import * as Dates from '../test/data/Dates';
import { getRelativeDateTimeProximity } from './DateUtils';

test('Relative date-times are calculated properly', () => {
  expect(getRelativeDateTimeProximity(Dates.MAY_1, Dates.MAY_1)).toBe(
    'sameDay'
  );
  expect(getRelativeDateTimeProximity(Dates.MAY_2, Dates.MAY_1)).toBe(
    'nextDay'
  );
  expect(getRelativeDateTimeProximity(Dates.MAY_3, Dates.MAY_1)).toBe(
    'nextWeek'
  );
  expect(getRelativeDateTimeProximity(Dates.MAY_4, Dates.MAY_1)).toBe(
    'nextWeek'
  );
  expect(getRelativeDateTimeProximity(Dates.MAY_5, Dates.MAY_1)).toBe(
    'nextWeek'
  );
  expect(getRelativeDateTimeProximity(Dates.MAY_6, Dates.MAY_1)).toBe(
    'nextWeek'
  );
  expect(getRelativeDateTimeProximity(Dates.MAY_7, Dates.MAY_1)).toBe(
    'nextWeek'
  );
  expect(getRelativeDateTimeProximity(Dates.MAY_8, Dates.MAY_1)).toBe(
    'sameElse'
  );
  expect(getRelativeDateTimeProximity(Dates.MAY_14, Dates.MAY_1)).toBe(
    'sameElse'
  );
  expect(getRelativeDateTimeProximity(Dates.JUN_1, Dates.MAY_1)).toBe(
    'sameElse'
  );
});
