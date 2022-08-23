import * as Calendars from '../test/data/Calendars';
import * as Weekdays from '../test/data/Weekdays';
import { getNextNormalOpening } from './CalendarUtils';
import dayjs from './dayjs';

const SUNDAY_00_00 = dayjs('00:00', 'HH:mm').day(0);
const SUNDAY_12_00 = dayjs('12:00', 'HH:mm').day(0);
const SUNDAY_23_59 = dayjs('23:59', 'HH:mm').day(0);
const MONDAY_00_00 = dayjs('00:00', 'HH:mm').day(1);
const MONDAY_12_00 = dayjs('12:00', 'HH:mm').day(1);
const MONDAY_23_59 = dayjs('23:59', 'HH:mm').day(1);
const TUESDAY_00_00 = dayjs('00:00', 'HH:mm').day(2);
const TUESDAY_12_00 = dayjs('12:00', 'HH:mm').day(2);
const TUESDAY_23_59 = dayjs('23:59', 'HH:mm').day(2);
const WEDNESDAY_00_00 = dayjs('00:00', 'HH:mm').day(3);
const WEDNESDAY_12_00 = dayjs('12:00', 'HH:mm').day(3);
const WEDNESDAY_23_59 = dayjs('23:59', 'HH:mm').day(3);
const THURSDAY_00_00 = dayjs('00:00', 'HH:mm').day(4);
const THURSDAY_12_00 = dayjs('12:00', 'HH:mm').day(4);
const THURSDAY_23_59 = dayjs('23:59', 'HH:mm').day(4);
const FRIDAY_00_00 = dayjs('00:00', 'HH:mm').day(5);
const FRIDAY_12_00 = dayjs('12:00', 'HH:mm').day(5);
const FRIDAY_23_59 = dayjs('23:59', 'HH:mm').day(5);
const SATURDAY_00_00 = dayjs('00:00', 'HH:mm').day(6);
const SATURDAY_12_00 = dayjs('12:00', 'HH:mm').day(6);
const SATURDAY_23_59 = dayjs('23:59', 'HH:mm').day(6);

test('No normal openings return no current openings', () => {
  expect(getNextNormalOpening(SUNDAY_00_00, [])).toBeNull();
  expect(getNextNormalOpening(SUNDAY_12_00, [])).toBeNull();
  expect(getNextNormalOpening(SUNDAY_23_59, [])).toBeNull();
  expect(getNextNormalOpening(MONDAY_00_00, [])).toBeNull();
  expect(getNextNormalOpening(MONDAY_12_00, [])).toBeNull();
  expect(getNextNormalOpening(MONDAY_23_59, [])).toBeNull();
  expect(getNextNormalOpening(TUESDAY_00_00, [])).toBeNull();
  expect(getNextNormalOpening(TUESDAY_12_00, [])).toBeNull();
  expect(getNextNormalOpening(TUESDAY_23_59, [])).toBeNull();
  expect(getNextNormalOpening(WEDNESDAY_00_00, [])).toBeNull();
  expect(getNextNormalOpening(WEDNESDAY_12_00, [])).toBeNull();
  expect(getNextNormalOpening(WEDNESDAY_23_59, [])).toBeNull();
  expect(getNextNormalOpening(THURSDAY_00_00, [])).toBeNull();
  expect(getNextNormalOpening(THURSDAY_12_00, [])).toBeNull();
  expect(getNextNormalOpening(THURSDAY_23_59, [])).toBeNull();
  expect(getNextNormalOpening(FRIDAY_00_00, [])).toBeNull();
  expect(getNextNormalOpening(FRIDAY_12_00, [])).toBeNull();
  expect(getNextNormalOpening(FRIDAY_23_59, [])).toBeNull();
  expect(getNextNormalOpening(SATURDAY_00_00, [])).toBeNull();
  expect(getNextNormalOpening(SATURDAY_12_00, [])).toBeNull();
  expect(getNextNormalOpening(SATURDAY_23_59, [])).toBeNull();
});

test('Complex normal openings return appropriate current openings', () => {
  const OPENINGS = Calendars.SUMMER_SP_1_2.normalHours;
  expect(getNextNormalOpening(SUNDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SUNDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SUNDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(MONDAY_00_00, OPENINGS)).toBe(OPENINGS[1]);
  expect(getNextNormalOpening(MONDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(MONDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(TUESDAY_00_00, OPENINGS)).toBe(OPENINGS[2]);
  expect(getNextNormalOpening(TUESDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(TUESDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(WEDNESDAY_00_00, OPENINGS)).toBe(OPENINGS[3]);
  expect(getNextNormalOpening(WEDNESDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(WEDNESDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(THURSDAY_00_00, OPENINGS)).toBe(OPENINGS[4]);
  expect(getNextNormalOpening(THURSDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(THURSDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(FRIDAY_00_00, OPENINGS)).toBe(OPENINGS[5]);
  expect(getNextNormalOpening(FRIDAY_12_00, OPENINGS)).toBe(OPENINGS[6]);
  expect(getNextNormalOpening(FRIDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SATURDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getNextNormalOpening(SATURDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SATURDAY_23_59, OPENINGS)).toBeNull();
});

test('Long range normal openings return appropriate current openings', () => {
  const OPENINGS = [
    {
      startDay: Weekdays.Monday,
      startTime: '07:00',
      endDay: Weekdays.Friday,
      endTime: '23:00',
    },
  ];
  expect(getNextNormalOpening(SUNDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SUNDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SUNDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(MONDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getNextNormalOpening(MONDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(MONDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(TUESDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(TUESDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(TUESDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(WEDNESDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(WEDNESDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(WEDNESDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(THURSDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(THURSDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(THURSDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(FRIDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(FRIDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(FRIDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SATURDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SATURDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SATURDAY_23_59, OPENINGS)).toBeNull();
});

test('Long range wrapping normal openings return appropriate current openings', () => {
  const OPENINGS = [
    {
      startDay: Weekdays.Thursday,
      startTime: '07:00',
      endDay: Weekdays.Tuesday,
      endTime: '23:00',
    },
  ];
  expect(getNextNormalOpening(SUNDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SUNDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SUNDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(MONDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(MONDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(MONDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(TUESDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(TUESDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(TUESDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(WEDNESDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(WEDNESDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(WEDNESDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(THURSDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getNextNormalOpening(THURSDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(THURSDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(FRIDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(FRIDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(FRIDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SATURDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SATURDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SATURDAY_23_59, OPENINGS)).toBeNull();
});

test('247 on day boundary normal openings return appropriate current openings', () => {
  const OPENINGS = [
    {
      startDay: Weekdays.Sunday,
      startTime: '00:00',
      endDay: Weekdays.Saturday,
      endTime: '23:59',
    },
  ];
  expect(getNextNormalOpening(SUNDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SUNDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SUNDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(MONDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(MONDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(MONDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(TUESDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(TUESDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(TUESDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(WEDNESDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(WEDNESDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(WEDNESDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(THURSDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(THURSDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(THURSDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(FRIDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(FRIDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(FRIDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SATURDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SATURDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SATURDAY_23_59, OPENINGS)).toBeNull();
});

test('247 on mid-day boundary normal openings return appropriate current openings', () => {
  const OPENINGS = [
    {
      startDay: Weekdays.Sunday,
      startTime: '12:00',
      endDay: Weekdays.Sunday,
      endTime: '11:59',
    },
  ];

  // we don't really care about this behavior, since current normal opening
  // will return a value and that takes priority for the UI display
  // therefore, this case should never be called
  expect(getNextNormalOpening(SUNDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getNextNormalOpening(SUNDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SUNDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(MONDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(MONDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(MONDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(TUESDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(TUESDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(TUESDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(WEDNESDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(WEDNESDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(WEDNESDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(THURSDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(THURSDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(THURSDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(FRIDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(FRIDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(FRIDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SATURDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SATURDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SATURDAY_23_59, OPENINGS)).toBeNull();
});

test('247-ish with mid-day gap normal openings return appropriate current openings', () => {
  const OPENINGS = [
    {
      startDay: Weekdays.Sunday,
      startTime: '23:00',
      endDay: Weekdays.Sunday,
      endTime: '07:59',
    },
  ];

  // we don't really care about this behavior, since current normal opening
  // will return a value and that takes priority for the UI display
  // therefore, this case should never be called
  expect(getNextNormalOpening(SUNDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  // we do care about this one alone, though, since there is a gap where the SP
  // is closed, so the next opening will be needed
  expect(getNextNormalOpening(SUNDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getNextNormalOpening(SUNDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(MONDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(MONDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(MONDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(TUESDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(TUESDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(TUESDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(WEDNESDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(WEDNESDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(WEDNESDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(THURSDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(THURSDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(THURSDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(FRIDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(FRIDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(FRIDAY_23_59, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SATURDAY_00_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SATURDAY_12_00, OPENINGS)).toBeNull();
  expect(getNextNormalOpening(SATURDAY_23_59, OPENINGS)).toBeNull();
});
