import "@testing-library/jest-dom";
import {
  containsFullOvernightSpans,
  containsNextDayOvernight,
  splitOpeningsIntoDays,
} from "../../main/utils/InfoPaneUtils";
import * as Weekdays from "../config/data/Weekdays";

test("No openings results in no helper text", () => {
  const noOpenings = splitOpeningsIntoDays([]);

  expect(containsNextDayOvernight(noOpenings)).toBe(false);
  expect(containsFullOvernightSpans(noOpenings)).toBe(false);
});

test("A single day opening will not cause helper text to be shown", () => {
  const singleDayOpening = splitOpeningsIntoDays([
    {
      startDay: Weekdays.Monday,
      startTime: "00:00",
      endDay: Weekdays.Monday,
      endTime: "13:00",
    },
  ]);

  expect(containsNextDayOvernight(singleDayOpening)).toBe(false);
  expect(containsFullOvernightSpans(singleDayOpening)).toBe(false);
});

test("A multi-day opening shows full overnight helper text", () => {
  const splitHours = splitOpeningsIntoDays([
    {
      startDay: Weekdays.Monday,
      startTime: "00:00",
      endDay: Weekdays.Tuesday,
      endTime: "13:00",
    },
  ]);

  expect(containsNextDayOvernight(splitHours)).toBe(false);
  expect(containsFullOvernightSpans(splitHours)).toBe(true);
});

test("An opening with overnight and next morning spans results in both helper texts", () => {
  const splitHours = splitOpeningsIntoDays([
    {
      startDay: Weekdays.Thursday,
      startTime: "02:00",
      endDay: Weekdays.Tuesday,
      endTime: "03:00",
    },
  ]);

  expect(containsNextDayOvernight(splitHours)).toBe(true);
  expect(containsFullOvernightSpans(splitHours)).toBe(true);
});
