import "@testing-library/jest-dom";
import { cleanup, render } from "@testing-library/react";
import React, { FunctionComponent, ReactNode } from "react";
import { IntlContext, IntlShape } from "react-intl";
import {
  generateDisplayRows,
  generateExceptionalOpeningRows,
  get247Rows,
  splitOpeningsIntoDays,
} from "../../main/utils/InfoPaneUtils";
import { LocaleWeekdayInfo } from "../../main/utils/WeekdayUtils";
import * as Calendars from "../config/data/Calendars";
import * as Weekdays from "../config/data/Weekdays";
import withIntlConfiguration from "../config/util/withIntlConfiguration";

let intl: IntlShape;

beforeAll(() => {
  const intlCapturer = jest.fn();

  const TestComponent: FunctionComponent<Record<string, never>> = () => (
    <IntlContext.Consumer>{intlCapturer}</IntlContext.Consumer>
  );
  render(withIntlConfiguration(<TestComponent />, "en-US", "UTC"));

  expect(intlCapturer.mock.calls).toHaveLength(1);
  intl = intlCapturer.mock.calls[0][0];

  cleanup();
});

function renderToTextContent(elements: ReactNode[][]): (string | null)[][] {
  const results = elements.map((row) =>
    row.map((el) => render(withIntlConfiguration(el)).container.textContent)
  );
  cleanup();
  return results;
}

test("No exceptions display correctly", () => {
  expect(generateExceptionalOpeningRows(intl, [])).toStrictEqual([]);
});

test("An opening exception displays correctly", () => {
  expect(
    renderToTextContent(
      generateExceptionalOpeningRows(intl, [
        Calendars.SUMMER_SP_1_2.exceptions[1],
      ]).map((row) => [row.name, row.start, row.end])
    )
  ).toStrictEqual([
    [
      "Community Event (Longer Hours)",
      "5/13/20007:00 AM5/14/20005:00 AM5/15/20006:00 AM",
      "5/14/2000Midnight5/15/20009:59 PM5/16/200010:59 PM",
    ],
  ]);
});
