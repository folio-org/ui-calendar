import { cleanup, render } from "@testing-library/react";
import React, { FunctionComponent } from "react";
import { IntlContext, IntlShape } from "react-intl";
import Permissions from "../../main/types/permissions";
import withIntlConfiguration from "../config/util/withIntlConfiguration";

let intl: IntlShape;

beforeAll(() => {
  const intlCapturer = jest.fn();

  const TestComponent: FunctionComponent<Record<string, never>> = () => (
    <IntlContext.Consumer>{intlCapturer}</IntlContext.Consumer>
  );
  render(withIntlConfiguration(<TestComponent />));

  expect(intlCapturer.mock.calls).toHaveLength(1);
  intl = intlCapturer.mock.calls[0][0];

  cleanup();
});

test("Permissions are valid", () => {
  expect(
    intl.formatMessage({
      id: Permissions.VIEW.replace("ui-calendar", "ui-calendar.permission"),
    })
  ).toMatch(/^Settings \(Calendar\)/);
  expect(
    intl.formatMessage({
      id: Permissions.CREATE.replace("ui-calendar", "ui-calendar.permission"),
    })
  ).toMatch(/^Settings \(Calendar\)/);
  expect(
    intl.formatMessage({
      id: Permissions.UPDATE.replace("ui-calendar", "ui-calendar.permission"),
    })
  ).toMatch(/^Settings \(Calendar\)/);
  expect(
    intl.formatMessage({
      id: Permissions.DELETE.replace("ui-calendar", "ui-calendar.permission"),
    })
  ).toMatch(/^Settings \(Calendar\)/);
});
