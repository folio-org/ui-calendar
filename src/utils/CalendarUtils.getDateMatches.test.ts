import * as Calendars from '../test/data/Calendars';
import * as Dates from '../test/data/Dates';
import { getDateMatches } from './CalendarUtils';

test('24/7 calendars get expected openings', () => {
  expect(
    getDateMatches(Dates.JAN_1_DATE, Calendars.ALL_YEAR_SP_ONLINE_247)
  ).toStrictEqual({
    openings: Calendars.ALL_YEAR_SP_ONLINE_247.normalHours,
    exceptions: []
  });
  expect(
    getDateMatches(Dates.DEC_1_DATE, Calendars.ALL_YEAR_SP_ONLINE_247)
  ).toStrictEqual({
    openings: Calendars.ALL_YEAR_SP_ONLINE_247.normalHours,
    exceptions: []
  });
});

test('Empty calendars get expected openings', () => {
  expect(
    getDateMatches(Dates.JAN_1_DATE, Calendars.SPRING_SP_1_2)
  ).toStrictEqual({
    openings: [],
    exceptions: []
  });
  expect(
    getDateMatches(Dates.FEB_1_DATE, Calendars.SPRING_SP_1_2)
  ).toStrictEqual({
    openings: [],
    exceptions: []
  });
});

test('Expected normal openings are returned', () => {
  const openings = Calendars.SUMMER_SP_1_2.normalHours;

  // Monday
  expect(
    getDateMatches(Dates.MAY_1_DATE, Calendars.SUMMER_SP_1_2)
  ).toStrictEqual({
    openings: [openings[1]],
    exceptions: []
  });
  // Tuesday
  expect(
    getDateMatches(Dates.MAY_2_DATE, Calendars.SUMMER_SP_1_2)
  ).toStrictEqual({
    openings: [openings[1], openings[2]],
    exceptions: []
  });
  // Wednesday
  expect(
    getDateMatches(Dates.MAY_3_DATE, Calendars.SUMMER_SP_1_2)
  ).toStrictEqual({
    openings: [openings[3]],
    exceptions: []
  });
  // Thursday
  expect(
    getDateMatches(Dates.MAY_4_DATE, Calendars.SUMMER_SP_1_2)
  ).toStrictEqual({
    openings: [openings[4]],
    exceptions: []
  });
  // Friday
  expect(
    getDateMatches(Dates.MAY_5_DATE, Calendars.SUMMER_SP_1_2)
  ).toStrictEqual({
    openings: [openings[5], openings[6]],
    exceptions: []
  });
  // Saturday
  expect(
    getDateMatches(Dates.MAY_6_DATE, Calendars.SUMMER_SP_1_2)
  ).toStrictEqual({
    openings: [openings[0]],
    exceptions: []
  });
  // Sunday
  expect(
    getDateMatches(Dates.MAY_7_DATE, Calendars.SUMMER_SP_1_2)
  ).toStrictEqual({
    openings: [],
    exceptions: []
  });
});

test('Expected exceptions are returned', () => {
  // Sunday
  expect(
    getDateMatches(Dates.MAY_14_DATE, Calendars.SUMMER_SP_1_2)
  ).toStrictEqual({
    openings: [],
    exceptions: [Calendars.SUMMER_SP_1_2.exceptions[1]]
  });
  // Sunday
  expect(
    getDateMatches(Dates.JUN_1_DATE, Calendars.SUMMER_SP_1_2)
  ).toStrictEqual({
    openings: [Calendars.SUMMER_SP_1_2.normalHours[4]],
    exceptions: [Calendars.SUMMER_SP_1_2.exceptions[0]]
  });
});
