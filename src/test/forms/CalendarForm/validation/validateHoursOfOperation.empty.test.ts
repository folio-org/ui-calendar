import RowType from "../../../../main/components/fields/RowType";
import { validateHoursOfOperationEmpty } from "../../../../main/forms/CalendarForm/validation/validateHoursOfOperation";
import * as Weekdays from "../../../config/data/Weekdays";
import expectRender from "../../../config/util/expectRender";

test("No rows is a valid state", () => {
  expect(validateHoursOfOperationEmpty([])).toBeUndefined();
});

test("An open row with nothing filled in is invalid", () => {
  const openAllEmptyResult = validateHoursOfOperationEmpty([
    {
      i: 0,
      type: RowType.Open,
      startDay: undefined,
      startTime: undefined,
      endDay: undefined,
      endTime: undefined,
    },
  ]);
  expect(openAllEmptyResult).toHaveProperty("empty.startDay.0");
  expect(openAllEmptyResult).toHaveProperty("empty.startTime.0");
  expect(openAllEmptyResult).toHaveProperty("empty.endDay.0");
  expect(openAllEmptyResult).toHaveProperty("empty.endTime.0");
});

test("A closed row with nothing filled in is invalid", () => {
  const closedAllEmptyResult = validateHoursOfOperationEmpty([
    {
      i: 0,
      type: RowType.Closed,
      startDay: undefined,
      startTime: undefined,
      endDay: undefined,
      endTime: undefined,
    },
  ]);
  expect(closedAllEmptyResult).toHaveProperty("empty.startDay.0");
  expect(closedAllEmptyResult).not.toHaveProperty("empty.startTime.0");
  expect(closedAllEmptyResult).toHaveProperty("empty.endDay.0");
  expect(closedAllEmptyResult).not.toHaveProperty("empty.endTime.0");
});

test("A closed row with days filled in is valid", () => {
  const closedValidResult = validateHoursOfOperationEmpty([
    {
      i: 0,
      type: RowType.Closed,
      startDay: Weekdays.Monday,
      startTime: "09:00", // should not affect result
      endDay: Weekdays.Monday,
      endTime: undefined,
    },
  ]);
  expect(closedValidResult).toBeUndefined();
});

test("An open row with only days filled in is invalid", () => {
  const openHalfValidResult = validateHoursOfOperationEmpty([
    {
      i: 0,
      type: RowType.Open,
      startDay: Weekdays.Monday,
      startTime: undefined,
      endDay: Weekdays.Monday,
      endTime: undefined,
    },
  ]);
  expect(openHalfValidResult).not.toHaveProperty("empty.startDay.0");
  expect(openHalfValidResult).toHaveProperty("empty.startTime.0");
  expect(openHalfValidResult).not.toHaveProperty("empty.endDay.0");
  expect(openHalfValidResult).toHaveProperty("empty.endTime.0");
});

test("Multiple valid rows produces expected valid result", () => {
  const mixedValidResult = validateHoursOfOperationEmpty([
    {
      i: 0,
      type: RowType.Closed,
      startDay: Weekdays.Monday,
      startTime: undefined,
      endDay: Weekdays.Monday,
      endTime: undefined,
    },
    {
      i: 1,
      type: RowType.Open,
      startDay: Weekdays.Monday,
      startTime: "09:00",
      endDay: Weekdays.Monday,
      endTime: "09:00",
    },
  ]);
  expect(mixedValidResult).toBeUndefined();
});

test("Multiple rows with different statuses produces expected invalid result", () => {
  const mixedInvalidResult = validateHoursOfOperationEmpty([
    {
      i: 0,
      type: RowType.Closed,
      startDay: Weekdays.Monday,
      startTime: undefined,
      endDay: Weekdays.Monday,
      endTime: undefined,
    },
    {
      i: 1,
      type: RowType.Open,
      startDay: Weekdays.Monday,
      startTime: "09:00",
      endDay: Weekdays.Monday,
      endTime: undefined,
    },
    {
      i: 2,
      type: RowType.Closed,
      startDay: undefined,
      startTime: undefined,
      endDay: Weekdays.Monday,
      endTime: "09:00",
    },
  ]);
  expect(mixedInvalidResult).not.toHaveProperty("empty.startDay.0");
  expect(mixedInvalidResult).not.toHaveProperty("empty.startTime.0");
  expect(mixedInvalidResult).not.toHaveProperty("empty.endDay.0");
  expect(mixedInvalidResult).not.toHaveProperty("empty.endTime.0");
  expect(mixedInvalidResult).not.toHaveProperty("empty.startDay.1");
  expect(mixedInvalidResult).not.toHaveProperty("empty.startTime.1");
  expect(mixedInvalidResult).not.toHaveProperty("empty.endDay.1");
  expect(mixedInvalidResult).toHaveProperty("empty.endTime.1");
  expect(mixedInvalidResult).toHaveProperty("empty.startDay.2");
  expect(mixedInvalidResult).not.toHaveProperty("empty.startTime.2");
  expect(mixedInvalidResult).not.toHaveProperty("empty.endDay.2");
  expect(mixedInvalidResult).not.toHaveProperty("empty.endTime.2");
});

test("Error messages translate properly", () => {
  const openAllEmptyResult = validateHoursOfOperationEmpty([
    {
      i: 0,
      type: RowType.Open,
      startDay: undefined,
      startTime: undefined,
      endDay: undefined,
      endTime: undefined,
    },
  ]);
  expect(openAllEmptyResult).toHaveProperty("empty.startDay.0");
  expect(openAllEmptyResult).toHaveProperty("empty.startTime.0");
  expect(openAllEmptyResult).toHaveProperty("empty.endDay.0");
  expect(openAllEmptyResult).toHaveProperty("empty.endTime.0");

  expectRender(openAllEmptyResult?.empty?.startDay[0]).toBe(
    "Please fill this in to continue"
  );
  expectRender(openAllEmptyResult?.empty?.startTime[0]).toBe(
    "Please fill this in to continue"
  );
  expectRender(openAllEmptyResult?.empty?.endDay[0]).toBe(
    "Please fill this in to continue"
  );
  expectRender(openAllEmptyResult?.empty?.endTime[0]).toBe(
    "Please fill this in to continue"
  );
});
