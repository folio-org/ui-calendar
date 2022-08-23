import {
  getCurrentExceptionalOpening,
  getNextExceptionalOpening,
} from '../../main/utils/CalendarUtils';
import dayjs from '../../main/utils/dayjs';
import * as Calendars from '../config/data/Calendars';
import * as Dates from '../config/data/Dates';

const MAY_13_00_00 = dayjs('2000-05-13 00:00');
const MAY_13_12_00 = dayjs('2000-05-13 12:00');
const MAY_13_14_00 = dayjs('2000-05-13 14:00');
const MAY_13_23_59 = dayjs('2000-05-13 23:59');
const MAY_14_00_00 = dayjs('2000-05-14 00:00');
const MAY_14_12_00 = dayjs('2000-05-14 12:00');
const MAY_15_12_00 = dayjs('2000-05-15 12:00');

const CLOSED_EXCEPTION = Calendars.SUMMER_SP_1_2.exceptions[0];
const OPEN_EXCEPTION = {
  name: 'Complex open exception',
  startDate: '2000-05-13',
  endDate: '2000-05-15',
  openings: [
    {
      startDate: '2000-05-13',
      startTime: '07:00',
      endDate: '2000-05-13',
      endTime: '12:59',
    },
    {
      startDate: '2000-05-13',
      startTime: '13:00',
      endDate: '2000-05-13',
      endTime: '14:59',
    },
    {
      startDate: '2000-05-15',
      startTime: '06:00',
      endDate: '2000-05-15',
      endTime: '22:59',
    },
  ],
};

test('Closed exceptions return no current exceptional openings', () => {
  expect(
    getCurrentExceptionalOpening(Dates.JAN_1, CLOSED_EXCEPTION)
  ).toBeNull();
  expect(
    getCurrentExceptionalOpening(Dates.JUN_1, CLOSED_EXCEPTION)
  ).toBeNull();
  expect(
    getCurrentExceptionalOpening(Dates.DEC_1, CLOSED_EXCEPTION)
  ).toBeNull();
});

test('Closed exceptions return no next exceptional openings', () => {
  expect(getNextExceptionalOpening(Dates.JAN_1, CLOSED_EXCEPTION)).toBeNull();
  expect(getNextExceptionalOpening(Dates.JUN_1, CLOSED_EXCEPTION)).toBeNull();
  expect(getNextExceptionalOpening(Dates.DEC_1, CLOSED_EXCEPTION)).toBeNull();
});

test('Opening exceptions return the expected current exceptions', () => {
  expect(getCurrentExceptionalOpening(Dates.JAN_1, OPEN_EXCEPTION)).toBeNull();
  expect(getCurrentExceptionalOpening(MAY_13_00_00, OPEN_EXCEPTION)).toBeNull();
  expect(getCurrentExceptionalOpening(MAY_13_12_00, OPEN_EXCEPTION)).toBe(
    OPEN_EXCEPTION.openings[0]
  );
  expect(getCurrentExceptionalOpening(MAY_13_14_00, OPEN_EXCEPTION)).toBe(
    OPEN_EXCEPTION.openings[1]
  );
  expect(getCurrentExceptionalOpening(MAY_13_23_59, OPEN_EXCEPTION)).toBeNull();
  expect(getCurrentExceptionalOpening(MAY_14_00_00, OPEN_EXCEPTION)).toBeNull();
  expect(getCurrentExceptionalOpening(MAY_14_12_00, OPEN_EXCEPTION)).toBeNull();
  expect(getCurrentExceptionalOpening(MAY_15_12_00, OPEN_EXCEPTION)).toBe(
    OPEN_EXCEPTION.openings[2]
  );
  expect(getCurrentExceptionalOpening(Dates.DEC_1, OPEN_EXCEPTION)).toBeNull();
});

test('Opening exceptions return the expected next exceptions', () => {
  expect(getNextExceptionalOpening(Dates.JAN_1, OPEN_EXCEPTION)).toBe(
    OPEN_EXCEPTION.openings[0]
  );
  expect(getNextExceptionalOpening(MAY_13_00_00, OPEN_EXCEPTION)).toBe(
    OPEN_EXCEPTION.openings[0]
  );
  expect(getNextExceptionalOpening(MAY_13_12_00, OPEN_EXCEPTION)).toBe(
    OPEN_EXCEPTION.openings[1]
  );
  expect(getNextExceptionalOpening(MAY_13_14_00, OPEN_EXCEPTION)).toBe(
    OPEN_EXCEPTION.openings[2]
  );
  expect(getNextExceptionalOpening(MAY_13_23_59, OPEN_EXCEPTION)).toBe(
    OPEN_EXCEPTION.openings[2]
  );
  expect(getNextExceptionalOpening(MAY_14_00_00, OPEN_EXCEPTION)).toBe(
    OPEN_EXCEPTION.openings[2]
  );
  expect(getNextExceptionalOpening(MAY_14_12_00, OPEN_EXCEPTION)).toBe(
    OPEN_EXCEPTION.openings[2]
  );
  // already in the only one this day
  expect(getNextExceptionalOpening(MAY_15_12_00, OPEN_EXCEPTION)).toBeNull();
  expect(getNextExceptionalOpening(Dates.DEC_1, OPEN_EXCEPTION)).toBeNull();
});
