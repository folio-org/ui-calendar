import { render } from "@testing-library/react";
import { ReactNode } from "react";
import { validateDate } from "../../../../main/forms/CalendarForm/validation/validateDateTime";
import withIntlConfiguration from "../../../config/util/withIntlConfiguration";

const localeDateFormat = "MM/DD/YYYY";

function checkErrorMessage(error: ReactNode, expected: string) {
  expect(render(withIntlConfiguration(error)).container.textContent).toBe(
    expected
  );
}

test("Missing ref results in no error (caught elsewhere)", () => {
  expect(
    validateDate({}, "start-date", { current: null }, localeDateFormat)
  ).toStrictEqual({});
});

test("Missing or empty value results in missing error", () => {
  const ref = { current: document.createElement("input") };
  ref.current.value = "";

  let validationResult = validateDate({}, "start-date", ref, localeDateFormat);
  expect(validationResult).toHaveProperty("start-date");
  checkErrorMessage(
    validationResult["start-date"],
    "Please fill this in to continue"
  );

  validationResult = validateDate({}, "start-date", ref, localeDateFormat);
  expect(validationResult).toHaveProperty("start-date");
  checkErrorMessage(
    validationResult["start-date"],
    "Please fill this in to continue"
  );

  validationResult = validateDate(
    { "start-date": undefined },
    "start-date",
    ref,
    localeDateFormat
  );
  expect(validationResult).toHaveProperty("start-date");
  checkErrorMessage(
    validationResult["start-date"],
    "Please fill this in to continue"
  );
});

test("Proper inputs results in no error", () => {
  const ref = { current: document.createElement("input") };
  ref.current.value = "11/22/2000";

  expect(
    validateDate(
      { "start-date": "2000-11-22" },
      "start-date",
      ref,
      localeDateFormat
    )
  ).toStrictEqual({});
});

test("Improper inputs results in no error", () => {
  const ref = { current: document.createElement("input") };

  ref.current.value = "01/01/2000";

  let validationResult = validateDate(
    { "start-date": "2000-11-22" },
    "start-date",
    ref,
    localeDateFormat
  );
  expect(validationResult).toHaveProperty("start-date");
  checkErrorMessage(
    validationResult["start-date"],
    "Please enter a date in the MM/DD/YYYY format"
  );

  validationResult = validateDate(
    { "start-date": "invalid" },
    "start-date",
    ref,
    localeDateFormat
  );
  expect(validationResult).toHaveProperty("start-date");
  checkErrorMessage(
    validationResult["start-date"],
    "Please enter a date in the MM/DD/YYYY format"
  );

  ref.current.value = "invalid";
  validationResult = validateDate(
    { "start-date": "2000-11-22" },
    "start-date",
    ref,
    localeDateFormat
  );
  expect(validationResult).toHaveProperty("start-date");
  checkErrorMessage(
    validationResult["start-date"],
    "Please enter a date in the MM/DD/YYYY format"
  );

  // input field should be locale format
  ref.current.value = "2000-11-22";
  validationResult = validateDate(
    { "start-date": "2000-11-22" },
    "start-date",
    ref,
    localeDateFormat
  );
  expect(validationResult).toHaveProperty("start-date");
  checkErrorMessage(
    validationResult["start-date"],
    "Please enter a date in the MM/DD/YYYY format"
  );
});
