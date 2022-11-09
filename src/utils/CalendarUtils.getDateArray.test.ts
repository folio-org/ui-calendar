import * as Dates from '../test/data/Dates';
import { getDateArray } from './CalendarUtils';

function getDateRangeInclusive(start: Date, end: Date) {
  let cur = new Date(start.getTime());
  const results = [];
  while (cur <= end) {
    results.push(cur);
    cur = new Date(
      Date.UTC(cur.getUTCFullYear(), cur.getUTCMonth(), cur.getUTCDate() + 1)
    );
  }
  return results;
}

test('A month beginning and ending mid-week works properly', () => {
  // apr 30 - may 3
  expect(getDateArray('en-us', Dates.MAY_1_DATE_UTC)).toStrictEqual(
    getDateRangeInclusive(
      new Date(Date.UTC(2000, 3, 30)),
      new Date(Date.UTC(2000, 5, 3))
    )
  );
  // feb 27 - apr 1
  expect(getDateArray('en-us', Dates.MAR_1_DATE_UTC)).toStrictEqual(
    getDateRangeInclusive(
      new Date(Date.UTC(2000, 1, 27)),
      new Date(Date.UTC(2000, 3, 1))
    )
  );
  // feb 28 - apr 2
  expect(getDateArray('fr-fr', Dates.MAR_1_DATE_UTC)).toStrictEqual(
    getDateRangeInclusive(
      new Date(Date.UTC(2000, 1, 28)),
      new Date(Date.UTC(2000, 3, 2))
    )
  );
});

test('A month beginning at the end of the week works properly', () => {
  // jun 25 - aug 5
  expect(getDateArray('en-us', Dates.JUL_1_DATE_UTC)).toStrictEqual(
    getDateRangeInclusive(
      new Date(Date.UTC(2000, 5, 25)),
      new Date(Date.UTC(2000, 7, 5))
    )
  );
  // sep 25 - nov 5
  expect(getDateArray('fr-fr', Dates.OCT_1_DATE_UTC)).toStrictEqual(
    getDateRangeInclusive(
      new Date(Date.UTC(2000, 8, 25)),
      new Date(Date.UTC(2000, 10, 5))
    )
  );
});

test('A month starting at the beginning of a week works properly', () => {
  // sep 24 - nov 4
  expect(getDateArray('en-us', Dates.OCT_1_DATE_UTC)).toStrictEqual(
    getDateRangeInclusive(
      new Date(Date.UTC(2000, 8, 24)),
      new Date(Date.UTC(2000, 10, 4))
    )
  );
  // apr 24 - jun 4
  expect(getDateArray('fr-fr', Dates.MAY_1_DATE_UTC)).toStrictEqual(
    getDateRangeInclusive(
      new Date(Date.UTC(2000, 3, 24)),
      new Date(Date.UTC(2000, 5, 4))
    )
  );
});

test('A month ending at the end of a week works properly', () => {
  // aug 27 - oct 7
  expect(getDateArray('en-us', Dates.SEP_1_DATE_UTC)).toStrictEqual(
    getDateRangeInclusive(
      new Date(Date.UTC(2000, 7, 27)),
      new Date(Date.UTC(2000, 9, 7))
    )
  );
  // oct 27 - jan 7
  expect(getDateArray('fr-fr', Dates.DEC_1_DATE_UTC)).toStrictEqual(
    getDateRangeInclusive(
      new Date(Date.UTC(2000, 10, 27)),
      new Date(Date.UTC(2001, 0, 7))
    )
  );
});
