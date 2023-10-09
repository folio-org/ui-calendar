import React from 'react';
import CalendarRouting from '.';
import expectRender from './test/util/expectRender';
import * as CalendarSettingsRaw from './views/CalendarSettings';

jest.mock('./views/CalendarSettings');
const CalendarSettings = CalendarSettingsRaw.default as jest.MockedFunction<typeof CalendarSettingsRaw.default>;

CalendarSettings.mockReturnValue(<div>settings shown here</div>);

describe('Main index.tsx entry point', () => {
  it('renders appropriately when it should not be showing', () => {
    expectRender(
      <CalendarRouting
        location={{ pathname: 'foo', search: '', hash: '' } as Location}
        forceRender={0}
      />
    ).toContain('How did you get to foo?');
  });

  it('renders appropriately when it should be showing', () => {
    expectRender(
      <CalendarRouting
        location={{ pathname: 'foo', search: '', hash: '' } as Location}
        forceRender={0}
        showSettings
      />
    ).toContain('settings shown here');
  });
});
