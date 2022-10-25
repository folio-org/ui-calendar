import * as Weekdays from '../test/data/Weekdays';
import dayjs from './dayjs';
import { weekdayIsBetween } from './WeekdayUtils';

const SUNDAY = dayjs().day(0).toDate();
const MONDAY = dayjs().day(1).toDate();
const TUESDAY = dayjs().day(2).toDate();
const WEDNESDAY = dayjs().day(3).toDate();
const THURSDAY = dayjs().day(4).toDate();
const FRIDAY = dayjs().day(5).toDate();
const SATURDAY = dayjs().day(6).toDate();

test('Single weekday range contains only one weekday', () => {
  expect(
    weekdayIsBetween(SUNDAY, Weekdays.Sunday, Weekdays.Sunday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(MONDAY, Weekdays.Sunday, Weekdays.Sunday)
  ).toBeFalsy();
  expect(
    weekdayIsBetween(TUESDAY, Weekdays.Sunday, Weekdays.Sunday)
  ).toBeFalsy();
  expect(
    weekdayIsBetween(WEDNESDAY, Weekdays.Sunday, Weekdays.Sunday)
  ).toBeFalsy();
  expect(
    weekdayIsBetween(THURSDAY, Weekdays.Sunday, Weekdays.Sunday)
  ).toBeFalsy();
  expect(
    weekdayIsBetween(FRIDAY, Weekdays.Sunday, Weekdays.Sunday)
  ).toBeFalsy();
  expect(
    weekdayIsBetween(SATURDAY, Weekdays.Sunday, Weekdays.Sunday)
  ).toBeFalsy();

  expect(
    weekdayIsBetween(SUNDAY, Weekdays.Thursday, Weekdays.Thursday)
  ).toBeFalsy();
  expect(
    weekdayIsBetween(MONDAY, Weekdays.Thursday, Weekdays.Thursday)
  ).toBeFalsy();
  expect(
    weekdayIsBetween(TUESDAY, Weekdays.Thursday, Weekdays.Thursday)
  ).toBeFalsy();
  expect(
    weekdayIsBetween(WEDNESDAY, Weekdays.Thursday, Weekdays.Thursday)
  ).toBeFalsy();
  expect(
    weekdayIsBetween(THURSDAY, Weekdays.Thursday, Weekdays.Thursday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(FRIDAY, Weekdays.Thursday, Weekdays.Thursday)
  ).toBeFalsy();
  expect(
    weekdayIsBetween(SATURDAY, Weekdays.Thursday, Weekdays.Thursday)
  ).toBeFalsy();
});

test('Multi-weekday ranges contains all applicable weekdays', () => {
  expect(
    weekdayIsBetween(SUNDAY, Weekdays.Sunday, Weekdays.Friday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(MONDAY, Weekdays.Sunday, Weekdays.Friday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(TUESDAY, Weekdays.Sunday, Weekdays.Friday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(WEDNESDAY, Weekdays.Sunday, Weekdays.Friday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(THURSDAY, Weekdays.Sunday, Weekdays.Friday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(FRIDAY, Weekdays.Sunday, Weekdays.Friday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(SATURDAY, Weekdays.Sunday, Weekdays.Friday)
  ).toBeFalsy();

  expect(
    weekdayIsBetween(SUNDAY, Weekdays.Thursday, Weekdays.Monday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(MONDAY, Weekdays.Thursday, Weekdays.Monday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(TUESDAY, Weekdays.Thursday, Weekdays.Monday)
  ).toBeFalsy();
  expect(
    weekdayIsBetween(WEDNESDAY, Weekdays.Thursday, Weekdays.Monday)
  ).toBeFalsy();
  expect(
    weekdayIsBetween(THURSDAY, Weekdays.Thursday, Weekdays.Monday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(FRIDAY, Weekdays.Thursday, Weekdays.Monday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(SATURDAY, Weekdays.Thursday, Weekdays.Monday)
  ).toBeTruthy();
});

test('Weeklong range contains the appropriate weekday', () => {
  expect(
    weekdayIsBetween(SUNDAY, Weekdays.Sunday, Weekdays.Saturday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(MONDAY, Weekdays.Sunday, Weekdays.Saturday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(TUESDAY, Weekdays.Sunday, Weekdays.Saturday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(WEDNESDAY, Weekdays.Sunday, Weekdays.Saturday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(THURSDAY, Weekdays.Sunday, Weekdays.Saturday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(FRIDAY, Weekdays.Sunday, Weekdays.Saturday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(SATURDAY, Weekdays.Sunday, Weekdays.Saturday)
  ).toBeTruthy();

  expect(
    weekdayIsBetween(SUNDAY, Weekdays.Wednesday, Weekdays.Tuesday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(MONDAY, Weekdays.Wednesday, Weekdays.Tuesday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(TUESDAY, Weekdays.Wednesday, Weekdays.Tuesday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(WEDNESDAY, Weekdays.Wednesday, Weekdays.Tuesday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(THURSDAY, Weekdays.Wednesday, Weekdays.Tuesday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(FRIDAY, Weekdays.Wednesday, Weekdays.Tuesday)
  ).toBeTruthy();
  expect(
    weekdayIsBetween(SATURDAY, Weekdays.Wednesday, Weekdays.Tuesday)
  ).toBeTruthy();
});
