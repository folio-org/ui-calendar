import React from 'react';
import CalendarRouting from '.';
import expectRender from './test/util/expectRender';

describe('Main index.tsx entry point', () => {
  it('renders appropriately when it should not be showing', () => {
    expectRender(
      <CalendarRouting
        location={{ pathname: 'foo', search: '', hash: '', key: 'foo' } as unknown as Location}
        forceRender={0}
      />,
    ).toContain('How did you get to foo?');
  });

  it('renders appropriately when it should be showing', () => {
    expectRender(
      <CalendarRouting
        location={{ pathname: 'foo', search: '', hash: '', key: 'foo' } as unknown as Location}
        forceRender={0}
        showSettings
      />,
    ).not.toContain('How did you get to');
  });
});
