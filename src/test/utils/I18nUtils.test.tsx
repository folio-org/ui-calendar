import { cleanup, render } from "@testing-library/react";
import React, { FunctionComponent } from "react";
import { IntlContext, IntlShape } from "react-intl";
import { getLocalizedDate, getLocalizedTime } from "../../main/utils/DateUtils";
import { formatList } from "../../main/utils/I18nUtils";
import withIntlConfiguration from "../config/util/withIntlConfiguration";

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

test("Localizing a list gives the expected result in en-us", () => {
  expect(formatList(intlEn, ["A"])).toBe("A");
  expect(formatList(intlEn, ["A", "B"])).toBe("A and B");
  expect(formatList(intlEn, ["A", "B", "C"])).toBe("A, B, and C");
  expect(formatList(intlEn, ["A", "B", "C", "D"])).toBe("A, B, C, and D");
});

test("Localizing a list gives the expected result in fr-fr", () => {
  expect(formatList(intlFr, ["A"])).toBe("A");
  expect(formatList(intlFr, ["A", "B"])).toBe("A et B");
  expect(formatList(intlFr, ["A", "B", "C"])).toBe("A, B et C");
  expect(formatList(intlFr, ["A", "B", "C", "D"])).toBe("A, B, C et D");
});
