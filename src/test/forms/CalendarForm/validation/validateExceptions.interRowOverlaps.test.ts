import RowType from "../../../../main/components/fields/RowType";
import { validateExceptionInterOverlaps } from "../../../../main/forms/CalendarForm/validation/validateExceptions";

test("No rows is a valid state", () => {
  expect(validateExceptionInterOverlaps([])).toBeUndefined();
});

test("Single rows result in no overlaps", () => {
  expect(
    validateExceptionInterOverlaps([
      {
        i: 1,
        lastRowI: 0,
        name: "Foo",
        type: RowType.Closed,
        rows: [
          {
            i: 2,
            startDate: "2000-01-01",
            startTime: undefined,
            endDate: "2000-01-01",
            endTime: undefined,
          },
        ],
      },
    ])
  ).toBeUndefined();
  expect(
    validateExceptionInterOverlaps([
      {
        i: 1,
        lastRowI: 0,
        name: "Foo",
        type: RowType.Open,
        rows: [
          {
            i: 2,
            startDate: "2000-01-01",
            startTime: undefined,
            endDate: "2000-01-01",
            endTime: undefined,
          },
          {
            i: 3,
            startDate: "2000-01-02",
            startTime: undefined,
            endDate: "2000-01-04",
            endTime: undefined,
          },
        ],
      },
    ])
  ).toBeUndefined();
});

test("Multiple non-overlapping rows result in no overlaps", () => {
  expect(
    validateExceptionInterOverlaps([
      {
        i: 1,
        lastRowI: 0,
        name: "Foo",
        type: RowType.Closed,
        rows: [
          {
            i: 0,
            startDate: "2000-01-01",
            startTime: undefined,
            endDate: "2000-01-01",
            endTime: undefined,
          },
        ],
      },
      {
        i: 2,
        lastRowI: 0,
        name: "Foo",
        type: RowType.Closed,
        rows: [
          {
            i: 0,
            startDate: "2000-01-04",
            startTime: undefined,
            endDate: "2000-01-04",
            endTime: undefined,
          },
        ],
      },
      {
        i: 2,
        lastRowI: 0,
        name: "Foo",
        type: RowType.Open,
        rows: [
          {
            i: 0,
            startDate: "2000-01-02",
            startTime: undefined,
            endDate: "2000-01-02",
            endTime: undefined,
          },
          {
            i: 0,
            startDate: "2000-01-03",
            startTime: undefined,
            endDate: "2000-01-03",
            endTime: undefined,
          },
        ],
      },
    ])
  ).toBeUndefined();
});

test("Overlapping rows are reported as overlaps", () => {
  expect(
    validateExceptionInterOverlaps([
      {
        i: 1,
        lastRowI: 0,
        name: "Foo",
        type: RowType.Closed,
        rows: [
          {
            i: 0,
            startDate: "2000-01-01",
            startTime: undefined,
            endDate: "2000-01-05",
            endTime: undefined,
          },
        ],
      },
      {
        i: 2,
        lastRowI: 0,
        name: "Foo",
        type: RowType.Closed,
        rows: [
          {
            i: 0,
            startDate: "2000-01-05",
            startTime: undefined,
            endDate: "2000-01-08",
            endTime: undefined,
          },
        ],
      },
    ])
  ).toHaveProperty("interConflicts", new Set([1, 2]));
  expect(
    validateExceptionInterOverlaps([
      {
        i: 1,
        lastRowI: 0,
        name: "Foo",
        type: RowType.Closed,
        rows: [
          {
            i: 0,
            startDate: "2000-01-01",
            startTime: undefined,
            endDate: "2000-01-02",
            endTime: undefined,
          },
        ],
      },
      {
        i: 4,
        lastRowI: 0,
        name: "Foo",
        type: RowType.Closed,
        rows: [
          {
            i: 0,
            startDate: "2000-01-06",
            startTime: undefined,
            endDate: "2000-01-08",
            endTime: undefined,
          },
        ],
      },
      {
        i: 7,
        lastRowI: 0,
        name: "Foo",
        type: RowType.Open,
        rows: [
          {
            i: 0,
            startDate: "2000-01-05",
            startTime: undefined,
            endDate: "2000-01-05",
            endTime: undefined,
          },
          {
            i: 1,
            startDate: "2000-01-09",
            startTime: undefined,
            endDate: "2000-01-09",
            endTime: undefined,
          },
        ],
      },
    ])
  ).toHaveProperty("interConflicts", new Set([4, 7]));
});
