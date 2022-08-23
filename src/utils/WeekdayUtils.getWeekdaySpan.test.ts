import * as Calendars from '../test/data/Calendars';
import * as Weekdays from '../test/data/Weekdays';
import { getWeekdaySpan } from './WeekdayUtils';

test('Sample normal openings return appropriate current openings', () => {
  const OPENINGS = Calendars.SUMMER_SP_1_2.normalHours;
  expect(getWeekdaySpan(OPENINGS[0])).toStrictEqual([Weekdays.Saturday]);
  expect(getWeekdaySpan(OPENINGS[1])).toStrictEqual([
    Weekdays.Monday,
    Weekdays.Tuesday,
  ]);
  expect(getWeekdaySpan(OPENINGS[2])).toStrictEqual([Weekdays.Tuesday]);
  expect(getWeekdaySpan(OPENINGS[3])).toStrictEqual([Weekdays.Wednesday]);
  expect(getWeekdaySpan(OPENINGS[4])).toStrictEqual([Weekdays.Thursday]);
  expect(getWeekdaySpan(OPENINGS[5])).toStrictEqual([Weekdays.Friday]);
  expect(getWeekdaySpan(OPENINGS[6])).toStrictEqual([Weekdays.Friday]);
});

test('Long range normal openings return appropriate spans', () => {
  expect(
    getWeekdaySpan({
      startDay: Weekdays.Monday,
      startTime: '07:00',
      endDay: Weekdays.Friday,
      endTime: '23:00',
    })
  ).toStrictEqual([
    Weekdays.Monday,
    Weekdays.Tuesday,
    Weekdays.Wednesday,
    Weekdays.Thursday,
    Weekdays.Friday,
  ]);
  expect(
    getWeekdaySpan({
      startDay: Weekdays.Thursday,
      startTime: '07:00',
      endDay: Weekdays.Tuesday,
      endTime: '23:00',
    })
  ).toStrictEqual([
    Weekdays.Thursday,
    Weekdays.Friday,
    Weekdays.Saturday,
    Weekdays.Sunday,
    Weekdays.Monday,
    Weekdays.Tuesday,
  ]);
});

test('247 ranges return expected spans', () => {
  expect(
    getWeekdaySpan({
      startDay: Weekdays.Sunday,
      startTime: '00:00',
      endDay: Weekdays.Saturday,
      endTime: '23:59',
    })
  ).toStrictEqual([
    Weekdays.Sunday,
    Weekdays.Monday,
    Weekdays.Tuesday,
    Weekdays.Wednesday,
    Weekdays.Thursday,
    Weekdays.Friday,
    Weekdays.Saturday,
  ]);
  expect(
    getWeekdaySpan({
      startDay: Weekdays.Wednesday,
      startTime: '00:00',
      endDay: Weekdays.Tuesday,
      endTime: '23:59',
    })
  ).toStrictEqual([
    Weekdays.Wednesday,
    Weekdays.Thursday,
    Weekdays.Friday,
    Weekdays.Saturday,
    Weekdays.Sunday,
    Weekdays.Monday,
    Weekdays.Tuesday,
  ]);

  expect(
    getWeekdaySpan({
      startDay: Weekdays.Wednesday,
      startTime: '12:00',
      endDay: Weekdays.Wednesday,
      endTime: '11:59',
    })
  ).toStrictEqual([
    Weekdays.Wednesday,
    Weekdays.Thursday,
    Weekdays.Friday,
    Weekdays.Saturday,
    Weekdays.Sunday,
    Weekdays.Monday,
    Weekdays.Tuesday,
    Weekdays.Wednesday,
  ]);
});

test('247-ish with mid-day gap normal openings return appropriate span', () => {
  expect(
    getWeekdaySpan({
      startDay: Weekdays.Wednesday,
      startTime: '23:00',
      endDay: Weekdays.Wednesday,
      endTime: '07:59',
    })
  ).toStrictEqual([
    Weekdays.Wednesday,
    Weekdays.Thursday,
    Weekdays.Friday,
    Weekdays.Saturday,
    Weekdays.Sunday,
    Weekdays.Monday,
    Weekdays.Tuesday,
    Weekdays.Wednesday,
  ]);
});
