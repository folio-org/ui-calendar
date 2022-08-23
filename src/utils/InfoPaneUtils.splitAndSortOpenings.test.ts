import * as Calendars from '../test/data/Calendars';
import * as Weekdays from '../test/data/Weekdays';
import { splitOpeningsIntoDays } from './InfoPaneUtils';

test('Openings are split properly', () => {
  expect(splitOpeningsIntoDays([])).toStrictEqual({
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  });
  expect(
    splitOpeningsIntoDays([
      {
        startDay: Weekdays.Monday,
        startTime: '00:00',
        endDay: Weekdays.Monday,
        endTime: '13:00',
      },
    ])
  ).toStrictEqual({
    MONDAY: [['00:00', '13:00']],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  });
  expect(
    splitOpeningsIntoDays([
      {
        startDay: Weekdays.Monday,
        startTime: '00:00',
        endDay: Weekdays.Tuesday,
        endTime: '13:00',
      },
    ])
  ).toStrictEqual({
    MONDAY: [['00:00', '-']],
    TUESDAY: [['-', '13:00']],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  });
  expect(
    splitOpeningsIntoDays([
      {
        startDay: Weekdays.Thursday,
        startTime: '02:00',
        endDay: Weekdays.Tuesday,
        endTime: '13:00',
      },
    ])
  ).toStrictEqual({
    MONDAY: [['-', '-']],
    TUESDAY: [['-', '13:00']],
    WEDNESDAY: [],
    THURSDAY: [['02:00', '-']],
    FRIDAY: [['-', '-']],
    SATURDAY: [['-', '-']],
    SUNDAY: [['-', '-']],
  });
});

test('Openings are sorted properly', () => {
  expect(
    splitOpeningsIntoDays([
      {
        startDay: Weekdays.Monday,
        startTime: '20:00',
        endDay: Weekdays.Monday,
        endTime: '23:00',
      },
      {
        startDay: Weekdays.Monday,
        startTime: '08:00',
        endDay: Weekdays.Monday,
        endTime: '10:00',
      },
    ])
  ).toStrictEqual({
    MONDAY: [
      ['08:00', '10:00'],
      ['20:00', '23:00'],
    ],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  });
  expect(
    splitOpeningsIntoDays([
      {
        startDay: Weekdays.Monday,
        startTime: '08:00',
        endDay: Weekdays.Monday,
        endTime: '10:00',
      },
      {
        startDay: Weekdays.Monday,
        startTime: '20:00',
        endDay: Weekdays.Monday,
        endTime: '23:00',
      },
    ])
  ).toStrictEqual({
    MONDAY: [
      ['08:00', '10:00'],
      ['20:00', '23:00'],
    ],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  });

  expect(
    splitOpeningsIntoDays([
      {
        startDay: Weekdays.Tuesday,
        startTime: '18:00',
        endDay: Weekdays.Tuesday,
        endTime: '19:00',
      },
      {
        startDay: Weekdays.Monday,
        startTime: '20:00',
        endDay: Weekdays.Tuesday,
        endTime: '02:00',
      },
      {
        startDay: Weekdays.Monday,
        startTime: '02:00',
        endDay: Weekdays.Monday,
        endTime: '04:00',
      },
    ])
  ).toStrictEqual({
    MONDAY: [
      ['02:00', '04:00'],
      ['20:00', '02:00*'],
    ],
    TUESDAY: [['18:00', '19:00']],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  });
  expect(
    splitOpeningsIntoDays([
      {
        startDay: Weekdays.Monday,
        startTime: '20:00',
        endDay: Weekdays.Tuesday,
        endTime: '02:00',
      },
      {
        startDay: Weekdays.Tuesday,
        startTime: '18:00',
        endDay: Weekdays.Tuesday,
        endTime: '19:00',
      },
      {
        startDay: Weekdays.Monday,
        startTime: '02:00',
        endDay: Weekdays.Monday,
        endTime: '04:00',
      },
    ])
  ).toStrictEqual({
    MONDAY: [
      ['02:00', '04:00'],
      ['20:00', '02:00*'],
    ],
    TUESDAY: [['18:00', '19:00']],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  });

  expect(
    splitOpeningsIntoDays([
      {
        startDay: Weekdays.Monday,
        startTime: '08:00',
        endDay: Weekdays.Monday,
        endTime: '16:00',
      },
      {
        startDay: Weekdays.Monday,
        startTime: '20:00',
        endDay: Weekdays.Tuesday,
        endTime: '08:00',
      },
      {
        startDay: Weekdays.Tuesday,
        startTime: '09:00',
        endDay: Weekdays.Tuesday,
        endTime: '19:00',
      },
    ])
  ).toStrictEqual({
    MONDAY: [
      ['08:00', '16:00'],
      ['20:00', '-'],
    ],
    TUESDAY: [
      ['-', '08:00'],
      ['09:00', '19:00'],
    ],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  });

  expect(
    splitOpeningsIntoDays([
      {
        startDay: Weekdays.Tuesday,
        startTime: '09:00',
        endDay: Weekdays.Tuesday,
        endTime: '19:00',
      },
      {
        startDay: Weekdays.Monday,
        startTime: '20:00',
        endDay: Weekdays.Tuesday,
        endTime: '08:00',
      },
      {
        startDay: Weekdays.Monday,
        startTime: '08:00',
        endDay: Weekdays.Monday,
        endTime: '16:00',
      },
    ])
  ).toStrictEqual({
    MONDAY: [
      ['08:00', '16:00'],
      ['20:00', '-'],
    ],
    TUESDAY: [
      ['-', '08:00'],
      ['09:00', '19:00'],
    ],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  });
});

test('Weeklong openings are split properly', () => {
  expect(
    splitOpeningsIntoDays([
      {
        startDay: Weekdays.Thursday,
        startTime: '00:00',
        endDay: Weekdays.Wednesday,
        endTime: '23:59',
      },
    ])
  ).toStrictEqual({
    MONDAY: [['-', '-']],
    TUESDAY: [['-', '-']],
    WEDNESDAY: [['-', '23:59']],
    THURSDAY: [['00:00', '-']],
    FRIDAY: [['-', '-']],
    SATURDAY: [['-', '-']],
    SUNDAY: [['-', '-']],
  });

  expect(
    splitOpeningsIntoDays([
      {
        startDay: Weekdays.Thursday,
        startTime: '12:00',
        endDay: Weekdays.Thursday,
        endTime: '11:59',
      },
    ])
  ).toStrictEqual({
    MONDAY: [['-', '-']],
    TUESDAY: [['-', '-']],
    WEDNESDAY: [['-', '-']],
    THURSDAY: [
      ['-', '11:59'],
      ['12:00', '-'],
    ],
    FRIDAY: [['-', '-']],
    SATURDAY: [['-', '-']],
    SUNDAY: [['-', '-']],
  });

  expect(
    splitOpeningsIntoDays([
      {
        startDay: Weekdays.Thursday,
        startTime: '22:00',
        endDay: Weekdays.Thursday,
        endTime: '08:00',
      },
    ])
  ).toStrictEqual({
    MONDAY: [['-', '-']],
    TUESDAY: [['-', '-']],
    WEDNESDAY: [['-', '-']],
    THURSDAY: [
      ['-', '08:00'],
      ['22:00', '-'],
    ],
    FRIDAY: [['-', '-']],
    SATURDAY: [['-', '-']],
    SUNDAY: [['-', '-']],
  });
});

test('Next day mornings are properly denoted', () => {
  // should not be changed
  expect(
    splitOpeningsIntoDays([
      {
        startDay: Weekdays.Monday,
        startTime: '00:00',
        endDay: Weekdays.Monday,
        endTime: '02:00',
      },
    ])
  ).toStrictEqual({
    MONDAY: [['00:00', '02:00']],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  });

  expect(
    splitOpeningsIntoDays([
      {
        startDay: Weekdays.Monday,
        startTime: '00:00',
        endDay: Weekdays.Tuesday,
        endTime: '02:00',
      },
    ])
  ).toStrictEqual({
    MONDAY: [['00:00', '02:00*']],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  });

  expect(
    splitOpeningsIntoDays([
      {
        startDay: Weekdays.Thursday,
        startTime: '00:00',
        endDay: Weekdays.Sunday,
        endTime: '02:00',
      },
    ])
  ).toStrictEqual({
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [['00:00', '-']],
    FRIDAY: [['-', '-']],
    SATURDAY: [['-', '02:00*']],
    SUNDAY: [],
  });
});

test('Many openings are properly split', () => {
  expect(
    splitOpeningsIntoDays(Calendars.SUMMER_SP_1_2.normalHours)
  ).toStrictEqual({
    MONDAY: [['09:00', '01:00*']],
    TUESDAY: [['09:00', '23:00']],
    WEDNESDAY: [['09:00', '23:00']],
    THURSDAY: [['09:00', '23:00']],
    FRIDAY: [
      ['09:00', '12:00'],
      ['13:30', '20:00'],
    ],
    SATURDAY: [['09:00', '20:00']],
    SUNDAY: [],
  });
});
