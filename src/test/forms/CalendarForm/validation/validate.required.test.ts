import { render } from "@testing-library/react";
import validate from "../../../../main/forms/CalendarForm/validation/validate";
import withIntlConfiguration from "../../../config/util/withIntlConfiguration";

const EMPTY_VALIDATE_PARAMETERS = [
  "",
  "",
  {
    startDateRef: { current: null as null },
    endDateRef: { current: null as null },
  },
  {
    hoursOfOperation: {
      startTime: {},
      endTime: {},
    },
    exceptions: {
      startDate: {},
      startTime: {},
      endDate: {},
      endTime: {},
    },
  },
] as const;

test("Required does not error when the value is present", () => {
  expect(
    validate(...EMPTY_VALIDATE_PARAMETERS, { name: "Foo" })
  ).not.toHaveProperty("name");
});

test("Required returns error when the value is missing or undefined", () => {
  expect(validate(...EMPTY_VALIDATE_PARAMETERS, {})).toHaveProperty("name");
  expect(
    validate(...EMPTY_VALIDATE_PARAMETERS, { name: undefined })
  ).toHaveProperty("name");
});

test("Required returns error when the value is a whitespace string", () => {
  expect(validate(...EMPTY_VALIDATE_PARAMETERS, { name: "  " })).toHaveProperty(
    "name"
  );
  expect(
    validate(...EMPTY_VALIDATE_PARAMETERS, { name: " \t\t " })
  ).toHaveProperty("name");
  expect(
    validate(...EMPTY_VALIDATE_PARAMETERS, { name: " \tfoo\t " })
  ).not.toHaveProperty("name");
});

test("Required returns error when the value is an empty array", () => {
  // solely for testing, as required is not directly exposed
  expect(
    validate(...EMPTY_VALIDATE_PARAMETERS, { name: [] as unknown as string })
  ).toHaveProperty("name");
  expect(
    validate(...EMPTY_VALIDATE_PARAMETERS, {
      name: ["", undefined] as unknown as string,
    })
  ).toHaveProperty("name");
  expect(
    validate(...EMPTY_VALIDATE_PARAMETERS, {
      name: ["foo"] as unknown as string,
    })
  ).not.toHaveProperty("name");
});

test("Required error has the expected translation", () => {
  const validationResult = validate(...EMPTY_VALIDATE_PARAMETERS, {});
  expect(validationResult).toHaveProperty("name");

  expect(
    render(withIntlConfiguration(validationResult.name)).container
  ).toHaveTextContent("Please fill this in to continue");
});
