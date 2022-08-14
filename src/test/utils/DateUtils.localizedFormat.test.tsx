import { cleanup, render } from "@testing-library/react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import React, { FunctionComponent } from "react";
import { IntlContext, IntlShape } from "react-intl";
import { getLocalizedDate, getLocalizedTime } from "../../main/utils/DateUtils";
import * as Dates from "../config/data/Dates";
import withIntlConfiguration from "../config/util/withIntlConfiguration";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

let intlEn: IntlShape;
let intlFr: IntlShape;

beforeAll(() => {
  const intlCapturer = jest.fn();

  const TestComponent: FunctionComponent<Record<string, never>> = () => (
    <IntlContext.Consumer>{intlCapturer}</IntlContext.Consumer>
  );
  render(withIntlConfiguration(<TestComponent />, "en-US", "EST"));

  expect(intlCapturer.mock.calls).toHaveLength(1);
  intlEn = intlCapturer.mock.calls[0][0];

  intlCapturer.mockClear();
  render(withIntlConfiguration(<TestComponent />, "fr-FR", "CET"));

  expect(intlCapturer.mock.calls).toHaveLength(1);
  intlFr = intlCapturer.mock.calls[0][0];

  cleanup();
});

test("Localization time formatting methods return the expected results for en-us", () => {
  expect(getLocalizedTime(intlEn, "00:00")).toBe("Midnight");
  expect(getLocalizedTime(intlEn, "23:59")).toBe("Midnight");
  expect(getLocalizedTime(intlEn, dayjs("00:00", "HH:mm"))).toBe("Midnight");
  expect(getLocalizedTime(intlEn, dayjs("23:59", "HH:mm"))).toBe("Midnight");

  expect(getLocalizedTime(intlEn, "08:00")).toBe("3:00 AM");
  expect(getLocalizedTime(intlEn, "20:00")).toBe("3:00 PM");
  expect(getLocalizedTime(intlEn, dayjs("08:00", "HH:mm"))).toBe("3:00 AM");
  expect(getLocalizedTime(intlEn, dayjs("20:00", "HH:mm"))).toBe("3:00 PM");
});

test("Localization time formatting methods return the expected results for fr-fr", () => {
  // all translations use "Midnight" in mocking
  expect(getLocalizedTime(intlFr, "00:00")).toBe("Midnight");
  expect(getLocalizedTime(intlFr, "23:59")).toBe("Midnight");
  expect(getLocalizedTime(intlEn, dayjs("00:00", "HH:mm"))).toBe("Midnight");
  expect(getLocalizedTime(intlEn, dayjs("23:59", "HH:mm"))).toBe("Midnight");

  expect(getLocalizedTime(intlFr, "08:00")).toBe("10:00");
  expect(getLocalizedTime(intlFr, "15:00")).toBe("17:00");
  expect(getLocalizedTime(intlFr, dayjs("08:00", "HH:mm"))).toBe("10:00");
  expect(getLocalizedTime(intlFr, dayjs("15:00", "HH:mm"))).toBe("17:00");
});

test("Localization date formatting methods return the expected results for en-us", () => {
  console.log(Dates.MAY_14.format());
  console.log(intlEn);
  expect(getLocalizedDate(intlEn, Dates.MAY_14)).toBe("5/14/2000");
  expect(getLocalizedDate(intlEn, "2000-05-14")).toBe("5/14/2000");
});

test("Localization date formatting methods return the expected results for fr-fr", () => {
  expect(getLocalizedDate(intlFr, Dates.MAY_14)).toBe("14/05/2000");
  expect(getLocalizedDate(intlFr, "2000-05-14")).toBe("14/05/2000");
});
