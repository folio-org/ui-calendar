import { isOpen247 } from '../../main/utils/CalendarUtils';
import * as Calendars from '../config/data/Calendars';
import * as Weekdays from '../config/data/Weekdays';

test('No openings is not 24/7', () => {
  expect(isOpen247([])).toBe(false);
});

test('Multiple openings is not 24/7', () => {
  expect(isOpen247(Calendars.SUMMER_SP_1_2.normalHours)).toBe(false);
});

test('Day-boundary 24/7 is 24/7', () => {
  expect(
    isOpen247([
      {
        startDay: Weekdays.Sunday,
        startTime: '00:00',
        endDay: Weekdays.Saturday,
        endTime: '23:59',
      },
    ])
  ).toBe(true);
  expect(
    isOpen247([
      {
        startDay: Weekdays.Thursday,
        startTime: '00:00',
        endDay: Weekdays.Wednesday,
        endTime: '23:59',
      },
    ])
  ).toBe(true);
});

test('Midday-boundary 24/7 is 24/7', () => {
  expect(
    isOpen247([
      {
        startDay: Weekdays.Sunday,
        startTime: '12:00',
        endDay: Weekdays.Sunday,
        endTime: '11:59',
      },
    ])
  ).toBe(true);
  expect(
    isOpen247([
      {
        startDay: Weekdays.Thursday,
        startTime: '13:47',
        endDay: Weekdays.Thursday,
        endTime: '13:46',
      },
    ])
  ).toBe(true);
});

test('Non-24/7 openings are not 24/7', () => {
  expect(
    isOpen247([
      {
        startDay: Weekdays.Sunday,
        startTime: '12:00',
        endDay: Weekdays.Sunday,
        endTime: '11:00',
      },
    ])
  ).toBe(false);
  expect(
    isOpen247([
      {
        startDay: Weekdays.Sunday,
        startTime: '11:00',
        endDay: Weekdays.Sunday,
        endTime: '16:00',
      },
    ])
  ).toBe(false);
  expect(
    isOpen247([
      {
        startDay: Weekdays.Friday,
        startTime: '00:00',
        endDay: Weekdays.Monday,
        endTime: '12:00',
      },
    ])
  ).toBe(false);
});
