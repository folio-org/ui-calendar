import { render, screen } from '@testing-library/react';
import React from 'react';
import MCLRowFormatter from './MCLRowFormatter';

test('MCLRowFormatter renders', async () => {
  render(
    <MCLRowFormatter
      rowClass="test-class"
      rowProps={{} as any}
      cells={[<h1 key="foo">test</h1>]}
    />
  );
  expect(await screen.findByRole('heading')).toBeInTheDocument();
  expect((await screen.findByRole('heading')).parentElement?.className).toBe(
    'test-class'
  );
});
