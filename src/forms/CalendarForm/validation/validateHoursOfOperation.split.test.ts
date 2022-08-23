import RowType from '../../../components/fields/RowType';
import * as Weekdays from '../../../test/data/Weekdays';
import { WEEKDAY_INDEX } from '../../../utils/WeekdayUtils';
import { splitRowsIntoWeekdays } from './validateHoursOfOperation';

test('No rows split into nothing', () => {
  const split = splitRowsIntoWeekdays([]);
  expect(split).toHaveProperty(Weekdays.Sunday, []);
  expect(split).toHaveProperty(Weekdays.Monday, []);
  expect(split).toHaveProperty(Weekdays.Tuesday, []);
  expect(split).toHaveProperty(Weekdays.Wednesday, []);
  expect(split).toHaveProperty(Weekdays.Thursday, []);
  expect(split).toHaveProperty(Weekdays.Friday, []);
  expect(split).toHaveProperty(Weekdays.Saturday, []);
});

test('A single-day closure splits correctly', () => {
  const split = splitRowsIntoWeekdays([
    {
      i: 5,
      type: RowType.Closed,
      startDay: Weekdays.Monday,
      startTime: undefined,
      endDay: Weekdays.Monday,
      endTime: undefined,
    },
  ]);
  expect(split).toHaveProperty(Weekdays.Sunday, []);
  expect(split[Weekdays.Monday]).toHaveLength(1);
  expect(split[Weekdays.Monday][0].row).toBe(5);
  expect(split[Weekdays.Monday][0].start.format('HH:mm')).toBe('00:00');
  expect(split[Weekdays.Monday][0].end.format('HH:mm')).toBe('23:59');
  expect(split).toHaveProperty(Weekdays.Tuesday, []);
  expect(split).toHaveProperty(Weekdays.Wednesday, []);
  expect(split).toHaveProperty(Weekdays.Thursday, []);
  expect(split).toHaveProperty(Weekdays.Friday, []);
  expect(split).toHaveProperty(Weekdays.Saturday, []);
});

test('A multi-day closure splits correctly', () => {
  const split = splitRowsIntoWeekdays([
    {
      i: 5,
      type: RowType.Closed,
      startDay: Weekdays.Friday,
      startTime: undefined,
      endDay: Weekdays.Monday,
      endTime: undefined,
    },
  ]);
  expect(split[Weekdays.Sunday]).toHaveLength(1);
  expect(split[Weekdays.Sunday][0].row).toBe(5);
  expect(split[Weekdays.Sunday][0].start.format('HH:mm')).toBe('00:00');
  expect(split[Weekdays.Sunday][0].end.format('HH:mm')).toBe('23:59');
  expect(split[Weekdays.Monday]).toHaveLength(1);
  expect(split[Weekdays.Monday][0].row).toBe(5);
  expect(split[Weekdays.Monday][0].start.format('HH:mm')).toBe('00:00');
  expect(split[Weekdays.Monday][0].end.format('HH:mm')).toBe('23:59');
  expect(split).toHaveProperty(Weekdays.Tuesday, []);
  expect(split).toHaveProperty(Weekdays.Wednesday, []);
  expect(split).toHaveProperty(Weekdays.Thursday, []);
  expect(split[Weekdays.Friday]).toHaveLength(1);
  expect(split[Weekdays.Friday][0].row).toBe(5);
  expect(split[Weekdays.Friday][0].start.format('HH:mm')).toBe('00:00');
  expect(split[Weekdays.Friday][0].end.format('HH:mm')).toBe('23:59');
  expect(split[Weekdays.Saturday]).toHaveLength(1);
  expect(split[Weekdays.Saturday][0].row).toBe(5);
  expect(split[Weekdays.Saturday][0].start.format('HH:mm')).toBe('00:00');
  expect(split[Weekdays.Saturday][0].end.format('HH:mm')).toBe('23:59');
});

test('A single-day opening splits correctly', () => {
  const split = splitRowsIntoWeekdays([
    {
      i: 5,
      type: RowType.Open,
      startDay: Weekdays.Monday,
      startTime: '09:00',
      endDay: Weekdays.Monday,
      endTime: '23:00',
    },
  ]);
  expect(split).toHaveProperty(Weekdays.Sunday, []);
  expect(split[Weekdays.Monday]).toHaveLength(1);
  expect(split[Weekdays.Monday][0].row).toBe(5);
  expect(split[Weekdays.Monday][0].start.format('HH:mm')).toBe('09:00');
  expect(split[Weekdays.Monday][0].end.format('HH:mm')).toBe('23:00');
  expect(split).toHaveProperty(Weekdays.Tuesday, []);
  expect(split).toHaveProperty(Weekdays.Wednesday, []);
  expect(split).toHaveProperty(Weekdays.Thursday, []);
  expect(split).toHaveProperty(Weekdays.Friday, []);
  expect(split).toHaveProperty(Weekdays.Saturday, []);
});

test('A multi-day opening splits correctly', () => {
  const split = splitRowsIntoWeekdays([
    {
      i: 5,
      type: RowType.Open,
      startDay: Weekdays.Monday,
      startTime: '09:00',
      endDay: Weekdays.Wednesday,
      endTime: '23:00',
    },
  ]);
  expect(split).toHaveProperty(Weekdays.Sunday, []);
  expect(split[Weekdays.Monday]).toHaveLength(1);
  expect(split[Weekdays.Monday][0].row).toBe(5);
  expect(split[Weekdays.Monday][0].start.format('HH:mm')).toBe('09:00');
  expect(split[Weekdays.Monday][0].end.format('HH:mm')).toBe('23:59');
  expect(split[Weekdays.Monday]).toHaveLength(1);
  expect(split[Weekdays.Tuesday][0].row).toBe(5);
  expect(split[Weekdays.Tuesday][0].start.format('HH:mm')).toBe('00:00');
  expect(split[Weekdays.Tuesday][0].end.format('HH:mm')).toBe('23:59');
  expect(split[Weekdays.Tuesday]).toHaveLength(1);
  expect(split[Weekdays.Wednesday][0].row).toBe(5);
  expect(split[Weekdays.Wednesday][0].start.format('HH:mm')).toBe('00:00');
  expect(split[Weekdays.Wednesday][0].end.format('HH:mm')).toBe('23:00');
  expect(split).toHaveProperty(Weekdays.Thursday, []);
  expect(split).toHaveProperty(Weekdays.Friday, []);
  expect(split).toHaveProperty(Weekdays.Saturday, []);
});

test('A 24/7 opening splits correctly', () => {
  const split = splitRowsIntoWeekdays([
    {
      i: 3,
      type: RowType.Open,
      startDay: Weekdays.Monday,
      startTime: '00:00',
      endDay: Weekdays.Sunday,
      endTime: '23:59',
    },
  ]);
  WEEKDAY_INDEX.forEach((weekday) => {
    expect(split[weekday]).toHaveLength(1);
    expect(split[weekday][0].row).toBe(3);
    expect(split[weekday][0].start.format('HH:mm')).toBe('00:00');
    expect(split[weekday][0].end.format('HH:mm')).toBe('23:59');
  });
});

test('A myriad of openings split correctly', () => {
  const split = splitRowsIntoWeekdays([
    {
      i: 2,
      type: RowType.Closed,
      startDay: Weekdays.Saturday,
      startTime: undefined,
      endDay: Weekdays.Sunday,
      endTime: undefined,
    },
    {
      i: 3,
      type: RowType.Open,
      startDay: Weekdays.Friday,
      startTime: '14:00',
      endDay: Weekdays.Friday,
      endTime: '23:00',
    },
    {
      i: 4,
      type: RowType.Open,
      startDay: Weekdays.Thursday,
      startTime: '09:00',
      endDay: Weekdays.Friday,
      endTime: '16:00',
    },
  ]);

  expect(split[Weekdays.Sunday]).toHaveLength(1);
  expect(split[Weekdays.Sunday][0].row).toBe(2);
  expect(split[Weekdays.Sunday][0].start.format('HH:mm')).toBe('00:00');
  expect(split[Weekdays.Sunday][0].end.format('HH:mm')).toBe('23:59');
  expect(split[Weekdays.Monday]).toStrictEqual([]);
  expect(split[Weekdays.Tuesday]).toStrictEqual([]);
  expect(split[Weekdays.Wednesday]).toStrictEqual([]);
  expect(split[Weekdays.Thursday]).toHaveLength(1);
  expect(split[Weekdays.Thursday][0].row).toBe(4);
  expect(split[Weekdays.Thursday][0].start.format('HH:mm')).toBe('09:00');
  expect(split[Weekdays.Thursday][0].end.format('HH:mm')).toBe('23:59');
  expect(split[Weekdays.Friday]).toHaveLength(2);
  expect(split[Weekdays.Friday][0].row).toBe(3);
  expect(split[Weekdays.Friday][0].start.format('HH:mm')).toBe('14:00');
  expect(split[Weekdays.Friday][0].end.format('HH:mm')).toBe('23:00');
  expect(split[Weekdays.Friday][1].row).toBe(4);
  expect(split[Weekdays.Friday][1].start.format('HH:mm')).toBe('00:00');
  expect(split[Weekdays.Friday][1].end.format('HH:mm')).toBe('16:00');
  expect(split[Weekdays.Saturday]).toHaveLength(1);
  expect(split[Weekdays.Saturday][0].row).toBe(2);
  expect(split[Weekdays.Saturday][0].start.format('HH:mm')).toBe('00:00');
  expect(split[Weekdays.Saturday][0].end.format('HH:mm')).toBe('23:59');
});
