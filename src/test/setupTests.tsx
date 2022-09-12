import React from 'react';
import './__mocks__';

jest.mock('@folio/stripes-components/lib/Icon', () => {
  console.error('In mock for @folio/stripes-components/lib/Icon');
  // eslint-disable-next-line react/prop-types
  return (props: any) => <span data-testid={props?.['data-testid']}>Icon</span>;
});
jest.mock('@folio/stripes-components/lib/Icon/Icon.js', () => {
  console.error('In mock for @folio/stripes-components/lib/Icon/Icon.js');
  // eslint-disable-next-line react/prop-types
  return (props: any) => <span data-testid={props?.['data-testid']}>Icon</span>;
});
