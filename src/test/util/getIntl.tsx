import { cleanup, render } from '@testing-library/react';
import type { FunctionComponent } from 'react';
import React from 'react';
import type { IntlShape } from 'react-intl';
import { IntlContext } from 'react-intl';
import withIntlConfiguration from './withIntlConfiguration';

export default function getIntl(locale = 'en-US', timeZone = 'UTC'): IntlShape {
  const intlCapturer = jest.fn();

  const TestComponent: FunctionComponent<Record<string, never>> = () => (
    <IntlContext.Consumer>{intlCapturer}</IntlContext.Consumer>
  );
  render(withIntlConfiguration(<TestComponent />, locale, timeZone));

  expect(intlCapturer).toHaveBeenCalled();
  const intl = intlCapturer.mock.calls[0][0] as IntlShape;

  cleanup();

  return intl;
}
