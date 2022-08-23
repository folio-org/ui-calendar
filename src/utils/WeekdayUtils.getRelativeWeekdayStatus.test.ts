import { IntlShape } from 'react-intl';
import * as Weekdays from '../test/data/Weekdays';
import dayjs from './dayjs';
import { getRelativeWeekdayStatus } from './WeekdayUtils';

const SUNDAY = dayjs().day(0);
const MONDAY = dayjs().day(1);
const TUESDAY = dayjs().day(2);
const WEDNESDAY = dayjs().day(3);
const THURSDAY = dayjs().day(4);
const FRIDAY = dayjs().day(5);
const SATURDAY = dayjs().day(6);

test('Relative weekdays compared against Sunday return appropriate proximity and formatting info', () => {
  const testTime = '';
  const testIntl = {
    formatTime: jest.fn(() => testTime),
  } as unknown as IntlShape;

  expect(
    getRelativeWeekdayStatus(testIntl, Weekdays.Sunday, testTime, SUNDAY)
  ).toStrictEqual({
    proximity: 'sameDay',
    weekday: undefined,
    date: undefined,
    time: testTime,
  });
  expect(
    getRelativeWeekdayStatus(testIntl, Weekdays.Monday, testTime, SUNDAY)
  ).toStrictEqual({
    proximity: 'nextDay',
    weekday: undefined,
    date: undefined,
    time: testTime,
  });
  expect(
    getRelativeWeekdayStatus(testIntl, Weekdays.Tuesday, testTime, SUNDAY)
  ).toStrictEqual({
    proximity: 'otherWeekday',
    weekday: Weekdays.Tuesday,
    date: undefined,
    time: testTime,
  });
  expect(
    getRelativeWeekdayStatus(testIntl, Weekdays.Wednesday, testTime, SUNDAY)
  ).toStrictEqual({
    proximity: 'otherWeekday',
    weekday: Weekdays.Wednesday,
    date: undefined,
    time: testTime,
  });
  expect(
    getRelativeWeekdayStatus(testIntl, Weekdays.Thursday, testTime, SUNDAY)
  ).toStrictEqual({
    proximity: 'otherWeekday',
    weekday: Weekdays.Thursday,
    date: undefined,
    time: testTime,
  });
  expect(
    getRelativeWeekdayStatus(testIntl, Weekdays.Friday, testTime, SUNDAY)
  ).toStrictEqual({
    proximity: 'otherWeekday',
    weekday: Weekdays.Friday,
    date: undefined,
    time: testTime,
  });
  expect(
    getRelativeWeekdayStatus(testIntl, Weekdays.Saturday, testTime, SUNDAY)
  ).toStrictEqual({
    proximity: 'otherWeekday',
    weekday: Weekdays.Saturday,
    date: undefined,
    time: testTime,
  });
});

test('Weekdays compared against other weekdays return appropriate proximity', () => {
  const testTime = '';
  const testIntl = {
    formatTime: jest.fn(() => testTime),
  } as unknown as IntlShape;

  expect(
    getRelativeWeekdayStatus(testIntl, Weekdays.Sunday, testTime, SUNDAY)
  ).toHaveProperty('proximity', 'sameDay');
  // Sunday is 6 days from Monday
  expect(
    getRelativeWeekdayStatus(testIntl, Weekdays.Sunday, testTime, MONDAY)
  ).toHaveProperty('proximity', 'otherWeekday');
  expect(
    getRelativeWeekdayStatus(testIntl, Weekdays.Sunday, testTime, TUESDAY)
  ).toHaveProperty('proximity', 'otherWeekday');
  expect(
    getRelativeWeekdayStatus(testIntl, Weekdays.Sunday, testTime, WEDNESDAY)
  ).toHaveProperty('proximity', 'otherWeekday');
  expect(
    getRelativeWeekdayStatus(testIntl, Weekdays.Sunday, testTime, THURSDAY)
  ).toHaveProperty('proximity', 'otherWeekday');
  expect(
    getRelativeWeekdayStatus(testIntl, Weekdays.Sunday, testTime, FRIDAY)
  ).toHaveProperty('proximity', 'otherWeekday');
  expect(
    getRelativeWeekdayStatus(testIntl, Weekdays.Sunday, testTime, SATURDAY)
  ).toHaveProperty('proximity', 'nextDay');

  expect(
    getRelativeWeekdayStatus(testIntl, Weekdays.Thursday, testTime, SUNDAY)
  ).toHaveProperty('proximity', 'otherWeekday');
  expect(
    getRelativeWeekdayStatus(testIntl, Weekdays.Thursday, testTime, MONDAY)
  ).toHaveProperty('proximity', 'otherWeekday');
  expect(
    getRelativeWeekdayStatus(testIntl, Weekdays.Thursday, testTime, TUESDAY)
  ).toHaveProperty('proximity', 'otherWeekday');
  expect(
    getRelativeWeekdayStatus(testIntl, Weekdays.Thursday, testTime, WEDNESDAY)
  ).toHaveProperty('proximity', 'nextDay');
  expect(
    getRelativeWeekdayStatus(testIntl, Weekdays.Thursday, testTime, THURSDAY)
  ).toHaveProperty('proximity', 'sameDay');
  expect(
    getRelativeWeekdayStatus(testIntl, Weekdays.Thursday, testTime, FRIDAY)
  ).toHaveProperty('proximity', 'otherWeekday');
  expect(
    getRelativeWeekdayStatus(testIntl, Weekdays.Thursday, testTime, SATURDAY)
  ).toHaveProperty('proximity', 'otherWeekday');
});
