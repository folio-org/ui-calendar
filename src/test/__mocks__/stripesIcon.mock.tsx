import React from 'react';

console.error('AAAAA');
jest.mock('@folio/stripes-components/lib/Icon', () => {
  console.error('Mocking @folio/stripes-components/lib/Icon');
  // eslint-disable-next-line react/prop-types
  return (props: any) => <span data-testid={props?.['data-testid']}>Icon</span>;
});
jest.mock('@folio/stripes-components/util/currencies', () => {
  console.error('Mocking @folio/stripes-components/util/currencies');
  return {};
});

jest.mock('@folio/stripes/components', () => {
  console.error('Mocking @folio/stripes/components');

  return {
    ...jest.requireActual('@folio/stripes-components'),
    Icon: (props: any) => <span data-testid={props?.['data-testid']}>Icon</span>
  };
});
