import { StripesType } from '@folio/stripes/core';
import React from 'react';
import CalendarRouting from '.';
import expectRender from './test/util/expectRender';

describe('Main index.tsx entry point', () => {
  it('renders appropriately when it should not be showing', () => {
    expectRender(
      <CalendarRouting
        stripes={{ hasPerm: () => true, connect: () => ({}) } as StripesType}
        location={{ pathname: 'foo', search: '', state: undefined, hash: '', key: 'foo' }}
        forceRender={0}
      />
    ).toContain('How did you get to foo?');
  });

  it('renders appropriately when it should be showing', () => {
    expectRender(
      <CalendarRouting
        stripes={{ hasPerm: () => true, connect: () => ({}) } as StripesType}
        location={{ pathname: 'foo', search: '', state: undefined, hash: '', key: 'foo' }}
        forceRender={0}
        showSettings
      />
    ).not.toContain('How did you get to');
  });
});
