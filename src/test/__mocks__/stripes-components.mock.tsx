import React, { ReactNode } from 'react';

// needed for Jest to properly require UMD-global React
global.React = React;

// relies on Webpack's require.context
jest.mock('@folio/stripes-components/lib/Icon', () => {
  return (props: Record<string, unknown>) => (
    <span data-testid={props?.['data-testid']}>
      {props.children as ReactNode}
    </span>
  );
});

jest.mock('@folio/stripes-components/util/currencies', () => {
  return {};
});

// re-export our mocks
jest.mock('@folio/stripes/components', () => jest.requireActual('@folio/stripes-components'));
