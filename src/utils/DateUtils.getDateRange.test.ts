import * as Dates from '../test/data/Dates';
import { getDateRange } from './DateUtils';

test('Date ranges can be calculated for any date range', () => {
  expect(getDateRange(Dates.JAN_1, Dates.JAN_1)).toStrictEqual([Dates.JAN_1]);
  expect(getDateRange(Dates.MAY_1, Dates.MAY_7)).toStrictEqual([
    Dates.MAY_1,
    Dates.MAY_2,
    Dates.MAY_3,
    Dates.MAY_4,
    Dates.MAY_5,
    Dates.MAY_6,
    Dates.MAY_7,
  ]);
  // 31 days in Jan + Feb 1
  expect(getDateRange(Dates.JAN_1, Dates.FEB_1)).toHaveLength(32);
});
