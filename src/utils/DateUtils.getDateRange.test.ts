import * as Dates from '../test/data/Dates';
import { getDateRange } from './DateUtils';

test('Date ranges can be calculated for any date range', () => {
  expect(getDateRange(Dates.JAN_1_DATE, Dates.JAN_1_DATE)).toStrictEqual([
    Dates.JAN_1_DATE
  ]);
  expect(getDateRange(Dates.MAY_1_DATE, Dates.MAY_7_DATE)).toStrictEqual([
    Dates.MAY_1_DATE,
    Dates.MAY_2_DATE,
    Dates.MAY_3_DATE,
    Dates.MAY_4_DATE,
    Dates.MAY_5_DATE,
    Dates.MAY_6_DATE,
    Dates.MAY_7_DATE
  ]);
  // 31 days in Jan + Feb 1
  expect(getDateRange(Dates.JAN_1_DATE, Dates.FEB_1_DATE)).toHaveLength(32);
});
