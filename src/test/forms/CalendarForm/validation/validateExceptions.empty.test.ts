import RowType from "../../../../main/components/fields/RowType";
import { validateExceptionsEmpty } from "../../../../main/forms/CalendarForm/validation/validateExceptions";
import expectRender from "../../../config/util/expectRender";

test("No rows is a valid state", () => {
  expect(
    validateExceptionsEmpty([], {
      startDate: {},
      startTime: {},
      endDate: {},
      endTime: {},
    })
  ).toBeUndefined();
  expect(
    validateExceptionsEmpty(
      [
        {
          i: 0,
          lastRowI: 0,
          type: RowType.Closed,
          name: "Foo",
          rows: [],
        },
      ],
      { startDate: {}, startTime: {}, endDate: {}, endTime: {} }
    )
  ).toBeUndefined();
});

test("Missing names are properly reported", () => {
  expect(
    validateExceptionsEmpty(
      [
        {
          i: 0,
          lastRowI: 0,
          type: RowType.Closed,
          name: " ",
          rows: [],
        },
      ],
      { startDate: {}, startTime: {}, endDate: {}, endTime: {} }
    )
  ).toHaveProperty("empty.name.0");
  expectRender(
    validateExceptionsEmpty(
      [
        {
          i: 0,
          lastRowI: 0,
          type: RowType.Closed,
          name: " ",
          rows: [],
        },
      ],
      { startDate: {}, startTime: {}, endDate: {}, endTime: {} }
    )?.empty?.name[0]
  ).toBe("Please fill this in to continue");
});

test("Undefined inner closure rows are properly reported", () => {
  const validationResult = validateExceptionsEmpty(
    [
      {
        i: 2,
        lastRowI: 3,
        type: RowType.Closed,
        name: " ",
        rows: [
          {
            i: 3,
            startDate: undefined,
            startTime: undefined,
            endDate: undefined,
            endTime: undefined,
          },
        ],
      },
    ],
    { startDate: {}, startTime: {}, endDate: {}, endTime: {} }
  );
  expect(validationResult).toHaveProperty("empty.startDate.2.3");
  expect(validationResult).not.toHaveProperty("empty.startTime.2.3");
  expect(validationResult).toHaveProperty("empty.endDate.2.3");
  expect(validationResult).not.toHaveProperty("empty.endTime.2.3");
  expectRender(validationResult?.empty?.startDate[2][3]).toBe(
    "Please fill this in to continue"
  );
  expectRender(validationResult?.empty?.endDate[2][3]).toBe(
    "Please fill this in to continue"
  );
});

test("Empty string inner closure rows are properly reported", () => {
  const validationResult = validateExceptionsEmpty(
    [
      {
        i: 2,
        lastRowI: 3,
        type: RowType.Closed,
        name: " ",
        rows: [
          {
            i: 3,
            startDate: "",
            startTime: undefined,
            endDate: "",
            endTime: undefined,
          },
        ],
      },
    ],
    { startDate: {}, startTime: {}, endDate: {}, endTime: {} }
  );
  expect(validationResult).toHaveProperty("empty.startDate.2.3");
  expect(validationResult).not.toHaveProperty("empty.startTime.2.3");
  expect(validationResult).toHaveProperty("empty.endDate.2.3");
  expect(validationResult).not.toHaveProperty("empty.endTime.2.3");
  expectRender(validationResult?.empty?.startDate[2][3]).toBe(
    "Please fill this in to continue"
  );
  expectRender(validationResult?.empty?.endDate[2][3]).toBe(
    "Please fill this in to continue"
  );
});

test("Bad ref inner closure rows are properly reported", () => {
  const validationResult = validateExceptionsEmpty(
    [
      {
        i: 2,
        lastRowI: 3,
        type: RowType.Closed,
        name: " ",
        rows: [
          {
            i: 3,
            startDate: "2000-01-01",
            startTime: undefined,
            endDate: "2000-01-01",
            endTime: undefined,
          },
        ],
      },
    ],
    { startDate: {}, startTime: {}, endDate: {}, endTime: {} }
  );
  expect(validationResult).toHaveProperty("empty.startDate.2.3");
  expect(validationResult).not.toHaveProperty("empty.startTime.2.3");
  expect(validationResult).toHaveProperty("empty.endDate.2.3");
  expect(validationResult).not.toHaveProperty("empty.endTime.2.3");
  expectRender(validationResult?.empty?.startDate[2][3]).toBe(
    "Please fill this in to continue"
  );
  expectRender(validationResult?.empty?.endDate[2][3]).toBe(
    "Please fill this in to continue"
  );
});

test("Undefined inner opening rows are properly reported", () => {
  const validationResult = validateExceptionsEmpty(
    [
      {
        i: 2,
        lastRowI: 3,
        type: RowType.Open,
        name: " ",
        rows: [
          {
            i: 3,
            startDate: "foo",
            startTime: undefined,
            endDate: undefined,
            endTime: undefined,
          },
        ],
      },
    ],
    {
      startDate: { 2: { 3: document.createElement("input") } },
      startTime: {},
      endDate: {},
      endTime: {},
    }
  );
  expect(validationResult).not.toHaveProperty("empty.startDate.2.3");
  expect(validationResult).toHaveProperty("empty.startTime.2.3");
  expect(validationResult).toHaveProperty("empty.endDate.2.3");
  expect(validationResult).toHaveProperty("empty.endTime.2.3");
  expectRender(validationResult?.empty?.startTime[2][3]).toBe(
    "Please fill this in to continue"
  );
  expectRender(validationResult?.empty?.endDate[2][3]).toBe(
    "Please fill this in to continue"
  );
  expectRender(validationResult?.empty?.endTime[2][3]).toBe(
    "Please fill this in to continue"
  );
});

test("Empty string open date rows are properly reported", () => {
  const validationResult = validateExceptionsEmpty(
    [
      {
        i: 2,
        lastRowI: 3,
        type: RowType.Open,
        name: " ",
        rows: [
          {
            i: 3,
            startDate: "",
            startTime: "valid",
            endDate: "",
            endTime: undefined,
          },
        ],
      },
    ],
    {
      startDate: {},
      startTime: {
        2: { 3: document.createElement("input") },
      },
      endDate: {},
      endTime: {},
    }
  );
  expect(validationResult).toHaveProperty("empty.startDate.2.3");
  expect(validationResult).not.toHaveProperty("empty.startTime.2.3");
  expect(validationResult).toHaveProperty("empty.endDate.2.3");
  expect(validationResult).toHaveProperty("empty.endTime.2.3");
  expectRender(validationResult?.empty?.startDate[2][3]).toBe(
    "Please fill this in to continue"
  );
  expectRender(validationResult?.empty?.endDate[2][3]).toBe(
    "Please fill this in to continue"
  );
  expectRender(validationResult?.empty?.endTime[2][3]).toBe(
    "Please fill this in to continue"
  );
});

test("Bad ref inner opening row dates are properly reported", () => {
  const validationResult = validateExceptionsEmpty(
    [
      {
        i: 1,
        lastRowI: 3,
        type: RowType.Open,
        name: " ",
        rows: [
          {
            i: 3,
            startDate: "2000-01-01",
            startTime: "00:00",
            endDate: "2000-01-01",
            endTime: "09:00",
          },
        ],
      },
      {
        i: 2,
        lastRowI: 3,
        type: RowType.Open,
        name: " ",
        rows: [
          {
            i: 3,
            startDate: "2000-01-01",
            startTime: "00:00",
            endDate: "2000-01-01",
            endTime: "09:00",
          },
        ],
      },
      {
        i: 3,
        lastRowI: 0,
        type: RowType.Open,
        name: "",
        rows: [
          {
            i: 0,
            startDate: "2000-01-01",
            startTime: "00:00",
            endDate: "2000-01-01",
            endTime: "09:00",
          },
        ],
      },
    ],
    {
      startDate: { 2: {}, 3: { 0: {} as HTMLInputElement } },
      startTime: { 2: {}, 3: { 0: {} as HTMLInputElement } },
      endDate: { 2: {}, 3: { 0: {} as HTMLInputElement } },
      endTime: { 2: {}, 3: { 0: {} as HTMLInputElement } },
    }
  );
  expect(validationResult).toHaveProperty("empty.startDate.1.3");
  expect(validationResult).not.toHaveProperty("empty.startTime.1.3");
  expect(validationResult).toHaveProperty("empty.endDate.1.3");
  expect(validationResult).not.toHaveProperty("empty.endTime.1.3");

  expect(validationResult).toHaveProperty("empty.startDate.2.3");
  expect(validationResult).not.toHaveProperty("empty.startTime.2.3");
  expect(validationResult).toHaveProperty("empty.endDate.2.3");
  expect(validationResult).not.toHaveProperty("empty.endTime.2.3");

  expect(validationResult).toHaveProperty("empty.startDate.3.0");
  expect(validationResult).not.toHaveProperty("empty.startTime.3.0");
  expect(validationResult).toHaveProperty("empty.endDate.3.0");
  expect(validationResult).not.toHaveProperty("empty.endTime.3.0");

  expectRender(validationResult?.empty?.startDate[2][3]).toBe(
    "Please fill this in to continue"
  );
});
