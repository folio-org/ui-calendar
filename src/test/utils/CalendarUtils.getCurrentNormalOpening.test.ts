import { getCurrentNormalOpening } from "../../main/utils/CalendarUtils";
import dayjs from "../../main/utils/dayjs";
import * as Calendars from "../config/data/Calendars";
import * as Weekdays from "../config/data/Weekdays";

const SUNDAY_00_00 = dayjs("00:00", "HH:mm").day(0).utc(true);
const SUNDAY_12_00 = dayjs("12:00", "HH:mm").day(0).utc(true);
const SUNDAY_23_59 = dayjs("23:59", "HH:mm").day(0).utc(true);
const MONDAY_00_00 = dayjs("00:00", "HH:mm").day(1).utc(true);
const MONDAY_12_00 = dayjs("12:00", "HH:mm").day(1).utc(true);
const MONDAY_23_59 = dayjs("23:59", "HH:mm").day(1).utc(true);
const TUESDAY_00_00 = dayjs("00:00", "HH:mm").day(2).utc(true);
const TUESDAY_12_00 = dayjs("12:00", "HH:mm").day(2).utc(true);
const TUESDAY_23_59 = dayjs("23:59", "HH:mm").day(2).utc(true);
const WEDNESDAY_00_00 = dayjs("00:00", "HH:mm").day(3).utc(true);
const WEDNESDAY_12_00 = dayjs("12:00", "HH:mm").day(3).utc(true);
const WEDNESDAY_23_59 = dayjs("23:59", "HH:mm").day(3).utc(true);
const THURSDAY_00_00 = dayjs("00:00", "HH:mm").day(4).utc(true);
const THURSDAY_12_00 = dayjs("12:00", "HH:mm").day(4).utc(true);
const THURSDAY_23_59 = dayjs("23:59", "HH:mm").day(4).utc(true);
const FRIDAY_00_00 = dayjs("00:00", "HH:mm").day(5).utc(true);
const FRIDAY_12_00 = dayjs("12:00", "HH:mm").day(5).utc(true);
const FRIDAY_23_59 = dayjs("23:59", "HH:mm").day(5).utc(true);
const SATURDAY_00_00 = dayjs("00:00", "HH:mm").day(6).utc(true);
const SATURDAY_12_00 = dayjs("12:00", "HH:mm").day(6).utc(true);
const SATURDAY_23_59 = dayjs("23:59", "HH:mm").day(6).utc(true);

test("No normal openings return no current openings", () => {
  expect(getCurrentNormalOpening(SUNDAY_00_00, [])).toBeNull();
  expect(getCurrentNormalOpening(SUNDAY_12_00, [])).toBeNull();
  expect(getCurrentNormalOpening(SUNDAY_23_59, [])).toBeNull();
  expect(getCurrentNormalOpening(MONDAY_00_00, [])).toBeNull();
  expect(getCurrentNormalOpening(MONDAY_12_00, [])).toBeNull();
  expect(getCurrentNormalOpening(MONDAY_23_59, [])).toBeNull();
  expect(getCurrentNormalOpening(TUESDAY_00_00, [])).toBeNull();
  expect(getCurrentNormalOpening(TUESDAY_12_00, [])).toBeNull();
  expect(getCurrentNormalOpening(TUESDAY_23_59, [])).toBeNull();
  expect(getCurrentNormalOpening(WEDNESDAY_00_00, [])).toBeNull();
  expect(getCurrentNormalOpening(WEDNESDAY_12_00, [])).toBeNull();
  expect(getCurrentNormalOpening(WEDNESDAY_23_59, [])).toBeNull();
  expect(getCurrentNormalOpening(THURSDAY_00_00, [])).toBeNull();
  expect(getCurrentNormalOpening(THURSDAY_12_00, [])).toBeNull();
  expect(getCurrentNormalOpening(THURSDAY_23_59, [])).toBeNull();
  expect(getCurrentNormalOpening(FRIDAY_00_00, [])).toBeNull();
  expect(getCurrentNormalOpening(FRIDAY_12_00, [])).toBeNull();
  expect(getCurrentNormalOpening(FRIDAY_23_59, [])).toBeNull();
  expect(getCurrentNormalOpening(SATURDAY_00_00, [])).toBeNull();
  expect(getCurrentNormalOpening(SATURDAY_12_00, [])).toBeNull();
  expect(getCurrentNormalOpening(SATURDAY_23_59, [])).toBeNull();
});

test("Complex normal openings return appropriate current openings", () => {
  const OPENINGS = Calendars.SUMMER_SP_1_2.normalHours;
  expect(getCurrentNormalOpening(SUNDAY_00_00, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(SUNDAY_12_00, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(SUNDAY_23_59, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(MONDAY_00_00, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(MONDAY_12_00, OPENINGS)).toBe(OPENINGS[1]);
  expect(getCurrentNormalOpening(MONDAY_23_59, OPENINGS)).toBe(OPENINGS[1]);
  expect(getCurrentNormalOpening(TUESDAY_00_00, OPENINGS)).toBe(OPENINGS[1]);
  expect(getCurrentNormalOpening(TUESDAY_12_00, OPENINGS)).toBe(OPENINGS[2]);
  expect(getCurrentNormalOpening(TUESDAY_23_59, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(WEDNESDAY_00_00, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(WEDNESDAY_12_00, OPENINGS)).toBe(OPENINGS[3]);
  expect(getCurrentNormalOpening(WEDNESDAY_23_59, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(THURSDAY_00_00, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(THURSDAY_12_00, OPENINGS)).toBe(OPENINGS[4]);
  expect(getCurrentNormalOpening(THURSDAY_23_59, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(FRIDAY_00_00, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(FRIDAY_12_00, OPENINGS)).toBe(OPENINGS[5]);
  expect(getCurrentNormalOpening(FRIDAY_23_59, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(SATURDAY_00_00, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(SATURDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(SATURDAY_23_59, OPENINGS)).toBeNull();
});

test("Long range normal openings return appropriate current openings", () => {
  const OPENINGS = [
    {
      startDay: Weekdays.Monday,
      startTime: "07:00",
      endDay: Weekdays.Friday,
      endTime: "23:00",
    },
  ];
  expect(getCurrentNormalOpening(SUNDAY_00_00, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(SUNDAY_12_00, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(SUNDAY_23_59, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(MONDAY_00_00, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(MONDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(MONDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(TUESDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(TUESDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(TUESDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(WEDNESDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(WEDNESDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(WEDNESDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(THURSDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(THURSDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(THURSDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(FRIDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(FRIDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(FRIDAY_23_59, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(SATURDAY_00_00, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(SATURDAY_12_00, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(SATURDAY_23_59, OPENINGS)).toBeNull();
});

test("Long range wrapping normal openings return appropriate current openings", () => {
  const OPENINGS = [
    {
      startDay: Weekdays.Thursday,
      startTime: "07:00",
      endDay: Weekdays.Tuesday,
      endTime: "23:00",
    },
  ];
  expect(getCurrentNormalOpening(SUNDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(SUNDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(SUNDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(MONDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(MONDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(MONDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(TUESDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(TUESDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(TUESDAY_23_59, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(WEDNESDAY_00_00, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(WEDNESDAY_12_00, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(WEDNESDAY_23_59, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(THURSDAY_00_00, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(THURSDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(THURSDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(FRIDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(FRIDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(FRIDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(SATURDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(SATURDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(SATURDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
});

test("247 on day boundary normal openings return appropriate current openings", () => {
  const OPENINGS = [
    {
      startDay: Weekdays.Sunday,
      startTime: "00:00",
      endDay: Weekdays.Saturday,
      endTime: "23:59",
    },
  ];
  expect(getCurrentNormalOpening(SUNDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(SUNDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(SUNDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(MONDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(MONDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(MONDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(TUESDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(TUESDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(TUESDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(WEDNESDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(WEDNESDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(WEDNESDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(THURSDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(THURSDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(THURSDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(FRIDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(FRIDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(FRIDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(SATURDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(SATURDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(SATURDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
});

test("247 on mid-day boundary normal openings return appropriate current openings", () => {
  const OPENINGS = [
    {
      startDay: Weekdays.Sunday,
      startTime: "12:00",
      endDay: Weekdays.Sunday,
      endTime: "11:59",
    },
  ];
  expect(getCurrentNormalOpening(SUNDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(SUNDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(SUNDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(MONDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(MONDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(MONDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(TUESDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(TUESDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(TUESDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(WEDNESDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(WEDNESDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(WEDNESDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(THURSDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(THURSDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(THURSDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(FRIDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(FRIDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(FRIDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(SATURDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(SATURDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(SATURDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
});

test("247-ish with mid-day gap normal openings return appropriate current openings", () => {
  const OPENINGS = [
    {
      startDay: Weekdays.Sunday,
      startTime: "23:00",
      endDay: Weekdays.Sunday,
      endTime: "07:59",
    },
  ];
  expect(getCurrentNormalOpening(SUNDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(SUNDAY_12_00, OPENINGS)).toBeNull();
  expect(getCurrentNormalOpening(SUNDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(MONDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(MONDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(MONDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(TUESDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(TUESDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(TUESDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(WEDNESDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(WEDNESDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(WEDNESDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(THURSDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(THURSDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(THURSDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(FRIDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(FRIDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(FRIDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(SATURDAY_00_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(SATURDAY_12_00, OPENINGS)).toBe(OPENINGS[0]);
  expect(getCurrentNormalOpening(SATURDAY_23_59, OPENINGS)).toBe(OPENINGS[0]);
});
