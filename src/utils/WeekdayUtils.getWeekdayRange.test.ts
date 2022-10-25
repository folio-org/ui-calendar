import * as Weekdays from '../test/data/Weekdays';
import { getWeekdayRange } from './WeekdayUtils';

test('Weekday ranges are calculated properly', () => {
  expect(getWeekdayRange(Weekdays.Sunday, Weekdays.Sunday)).toStrictEqual([
    Weekdays.Sunday,
  ]);
  expect(getWeekdayRange(Weekdays.Monday, Weekdays.Monday)).toStrictEqual([
    Weekdays.Monday,
  ]);
  expect(getWeekdayRange(Weekdays.Tuesday, Weekdays.Tuesday)).toStrictEqual([
    Weekdays.Tuesday,
  ]);
  expect(getWeekdayRange(Weekdays.Wednesday, Weekdays.Wednesday)).toStrictEqual(
    [Weekdays.Wednesday]
  );
  expect(getWeekdayRange(Weekdays.Thursday, Weekdays.Thursday)).toStrictEqual([
    Weekdays.Thursday,
  ]);
  expect(getWeekdayRange(Weekdays.Friday, Weekdays.Friday)).toStrictEqual([
    Weekdays.Friday,
  ]);
  expect(getWeekdayRange(Weekdays.Saturday, Weekdays.Saturday)).toStrictEqual([
    Weekdays.Saturday,
  ]);

  expect(getWeekdayRange(Weekdays.Monday, Weekdays.Tuesday)).toStrictEqual([
    Weekdays.Monday,
    Weekdays.Tuesday,
  ]);
  expect(getWeekdayRange(Weekdays.Friday, Weekdays.Monday)).toStrictEqual([
    Weekdays.Friday,
    Weekdays.Saturday,
    Weekdays.Sunday,
    Weekdays.Monday,
  ]);

  expect(getWeekdayRange(Weekdays.Friday, Weekdays.Thursday)).toStrictEqual([
    Weekdays.Friday,
    Weekdays.Saturday,
    Weekdays.Sunday,
    Weekdays.Monday,
    Weekdays.Tuesday,
    Weekdays.Wednesday,
    Weekdays.Thursday,
  ]);
});
