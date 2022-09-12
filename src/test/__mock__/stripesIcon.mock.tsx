import React from 'react';

jest.mock('@folio/stripes-components/lib/Icon', () => {
  // eslint-disable-next-line react/prop-types
  return (props: any) => <span data-testid={props?.['data-testid']}>Icon</span>;
});
