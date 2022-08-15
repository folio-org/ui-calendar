import { cleanup, render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import React, { FunctionComponent } from "react";
import { IntlContext, IntlShape } from "react-intl";
import {
  getLocaleWeekdays,
  useLocaleWeekdays,
} from "../../main/utils/WeekdayUtils";
import * as Weekdays from "../config/data/Weekdays";
import withIntlConfiguration from "../config/util/withIntlConfiguration";

// United States
let intlEn: IntlShape;
// France
let intlFr: IntlShape;
// Algeria
let intlAr: IntlShape;

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

  intlCapturer.mockClear();
  render(withIntlConfiguration(<TestComponent />, "ar-DZ", "CET"));

  expect(intlCapturer.mock.calls).toHaveLength(1);
  intlAr = intlCapturer.mock.calls[0][0];

  cleanup();
});

test("Locale weekdays are properly retrieved", () => {
  expect(getLocaleWeekdays(intlEn)).toStrictEqual([
    { weekday: Weekdays.Sunday, long: "Sunday", short: "Sun" },
    { weekday: Weekdays.Monday, long: "Monday", short: "Mon" },
    { weekday: Weekdays.Tuesday, long: "Tuesday", short: "Tue" },
    { weekday: Weekdays.Wednesday, long: "Wednesday", short: "Wed" },
    { weekday: Weekdays.Thursday, long: "Thursday", short: "Thu" },
    { weekday: Weekdays.Friday, long: "Friday", short: "Fri" },
    { weekday: Weekdays.Saturday, long: "Saturday", short: "Sat" },
  ]);
  expect(getLocaleWeekdays(intlFr)).toStrictEqual([
    { weekday: Weekdays.Monday, long: "lundi", short: "lun." },
    { weekday: Weekdays.Tuesday, long: "mardi", short: "mar." },
    { weekday: Weekdays.Wednesday, long: "mercredi", short: "mer." },
    { weekday: Weekdays.Thursday, long: "jeudi", short: "jeu." },
    { weekday: Weekdays.Friday, long: "vendredi", short: "ven." },
    { weekday: Weekdays.Saturday, long: "samedi", short: "sam." },
    { weekday: Weekdays.Sunday, long: "dimanche", short: "dim." },
  ]);
  expect(getLocaleWeekdays(intlAr)).toStrictEqual([
    { weekday: Weekdays.Saturday, long: "السبت", short: "السبت" },
    { weekday: Weekdays.Sunday, long: "الأحد", short: "الأحد" },
    { weekday: Weekdays.Monday, long: "الاثنين", short: "الاثنين" },
    { weekday: Weekdays.Tuesday, long: "الثلاثاء", short: "الثلاثاء" },
    { weekday: Weekdays.Wednesday, long: "الأربعاء", short: "الأربعاء" },
    { weekday: Weekdays.Thursday, long: "الخميس", short: "الخميس" },
    { weekday: Weekdays.Friday, long: "الجمعة", short: "الجمعة" },
  ]);
});

test("useLocaleWeekdays hook works like getLocaleWeekdays", () => {
  let intlToTest = intlEn;
  const { result, rerender } = renderHook(() => useLocaleWeekdays(intlToTest));

  intlToTest = intlEn;
  rerender();
  expect(result.current).toStrictEqual([
    { weekday: Weekdays.Sunday, long: "Sunday", short: "Sun" },
    { weekday: Weekdays.Monday, long: "Monday", short: "Mon" },
    { weekday: Weekdays.Tuesday, long: "Tuesday", short: "Tue" },
    { weekday: Weekdays.Wednesday, long: "Wednesday", short: "Wed" },
    { weekday: Weekdays.Thursday, long: "Thursday", short: "Thu" },
    { weekday: Weekdays.Friday, long: "Friday", short: "Fri" },
    { weekday: Weekdays.Saturday, long: "Saturday", short: "Sat" },
  ]);

  intlToTest = intlFr;
  rerender();
  expect(result.current).toStrictEqual([
    { weekday: Weekdays.Monday, long: "lundi", short: "lun." },
    { weekday: Weekdays.Tuesday, long: "mardi", short: "mar." },
    { weekday: Weekdays.Wednesday, long: "mercredi", short: "mer." },
    { weekday: Weekdays.Thursday, long: "jeudi", short: "jeu." },
    { weekday: Weekdays.Friday, long: "vendredi", short: "ven." },
    { weekday: Weekdays.Saturday, long: "samedi", short: "sam." },
    { weekday: Weekdays.Sunday, long: "dimanche", short: "dim." },
  ]);

  intlToTest = intlAr;
  rerender();
  expect(result.current).toStrictEqual([
    { weekday: Weekdays.Saturday, long: "السبت", short: "السبت" },
    { weekday: Weekdays.Sunday, long: "الأحد", short: "الأحد" },
    { weekday: Weekdays.Monday, long: "الاثنين", short: "الاثنين" },
    { weekday: Weekdays.Tuesday, long: "الثلاثاء", short: "الثلاثاء" },
    { weekday: Weekdays.Wednesday, long: "الأربعاء", short: "الأربعاء" },
    { weekday: Weekdays.Thursday, long: "الخميس", short: "الخميس" },
    { weekday: Weekdays.Friday, long: "الجمعة", short: "الجمعة" },
  ]);
});
