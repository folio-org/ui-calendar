import RowType from "../../../../main/components/fields/RowType";
import { validateHoursOfOperationTimes } from "../../../../main/forms/CalendarForm/validation/validateHoursOfOperation";
import expectRender from "../../../config/util/expectRender";

const localeTimeFormat12 = "hh:mm A";

test("No rows is a valid state", () => {
  expect(
    validateHoursOfOperationTimes(
      [],
      { startTime: {}, endTime: {} },
      localeTimeFormat12
    )
  ).toBeUndefined();
});

test("Otherwise invalid closed rows results in valid (checked elsewhere, no times to validate here)", () => {
  expect(
    validateHoursOfOperationTimes(
      [
        {
          i: 0,
          type: RowType.Closed,
          startDay: undefined,
          startTime: undefined,
          endDay: undefined,
          endTime: undefined,
        },
      ],
      { startTime: {}, endTime: {} },
      localeTimeFormat12
    )
  ).toBeUndefined();
});

test("Invalid row causes proper invalid time errors", () => {
  const validationResult = validateHoursOfOperationTimes(
    [
      {
        i: 0,
        type: RowType.Open,
        startDay: undefined,
        startTime: undefined,
        endDay: undefined,
        endTime: undefined,
      },
    ],
    {
      startTime: { 0: { value: "Invalid" } as HTMLInputElement },
      endTime: { 0: { value: "Invalid" } as HTMLInputElement },
    },
    localeTimeFormat12
  );
  expect(validationResult).toHaveProperty("invalidTimes.startTime.0");
  expect(validationResult).toHaveProperty("invalidTimes.endTime.0");
});

test("Missing refs cause no invalid time errors", () => {
  const validationResult = validateHoursOfOperationTimes(
    [
      {
        i: 0,
        type: RowType.Open,
        startDay: undefined,
        startTime: "09:00",
        endDay: undefined,
        endTime: "23:00",
      },
    ],
    {
      startTime: {},
      endTime: {},
    },
    localeTimeFormat12
  );
  expect(validationResult).toBeUndefined();
});

test("Invalid refs cause no invalid time errors", () => {
  const validationResult = validateHoursOfOperationTimes(
    [
      {
        i: 0,
        type: RowType.Open,
        startDay: undefined,
        startTime: "09:00",
        endDay: undefined,
        endTime: "23:00",
      },
    ],
    {
      startTime: { 0: {} as HTMLInputElement },
      endTime: { 0: {} as HTMLInputElement },
    },
    localeTimeFormat12
  );
  expect(validationResult).toBeUndefined();
});

test("Mixed validity rows causes proper invalid time errors", () => {
  const validationResult = validateHoursOfOperationTimes(
    [
      {
        i: 0,
        type: RowType.Open,
        startDay: undefined,
        startTime: "12:00",
        endDay: undefined,
        endTime: undefined,
      },
      {
        i: 1,
        type: RowType.Open,
        startDay: undefined,
        startTime: "13:00",
        endDay: undefined,
        endTime: "13:00",
      },
      {
        i: 2,
        type: RowType.Open,
        startDay: undefined,
        startTime: "09:00",
        endDay: undefined,
        endTime: "09:00",
      },
    ],
    {
      startTime: {
        0: { value: "12:00 PM" },
        1: { value: "invalid" },
      } as unknown as Record<number, HTMLInputElement>,
      endTime: {
        1: { value: "1:00 PM" },
        2: { value: "8:00 AM" },
      } as unknown as Record<number, HTMLInputElement>,
    },
    localeTimeFormat12
  );
  expect(validationResult).not.toHaveProperty("invalidTimes.startTime.0");
  expect(validationResult).not.toHaveProperty("invalidTimes.endTime.0");
  expect(validationResult).toHaveProperty("invalidTimes.startTime.1");
  expect(validationResult).not.toHaveProperty("invalidTimes.endTime.1");
  expect(validationResult).not.toHaveProperty("invalidTimes.startTime.2");
  expect(validationResult).toHaveProperty("invalidTimes.endTime.2");
});

test("Error messages have the proper text", () => {
  const sampleInput = document.createElement("input");
  sampleInput.value = "invalid";

  const validationResult = validateHoursOfOperationTimes(
    [
      {
        i: 0,
        type: RowType.Open,
        startDay: undefined,
        startTime: undefined,
        endDay: undefined,
        endTime: undefined,
      },
    ],
    {
      startTime: { 0: sampleInput },
      endTime: { 0: sampleInput },
    },
    localeTimeFormat12
  );
  expect(validationResult).toHaveProperty("invalidTimes.startTime.0");
  expect(validationResult).toHaveProperty("invalidTimes.endTime.0");

  expectRender(validationResult?.invalidTimes?.startTime[0]).toBe(
    "Please enter a time in the hh:mm A format"
  );
  expectRender(validationResult?.invalidTimes?.endTime[0]).toBe(
    "Please enter a time in the hh:mm A format"
  );
});
