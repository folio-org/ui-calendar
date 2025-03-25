import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import TimeField from './TimeField';

describe('TimeField', () => {
  it('Renders the TimeField correctly', async () => {
    render(
      <IntlProvider locale="en">
        <TimeField
          display
          value={undefined}
          inputRef={() => {}}
          error={undefined}
          onBlur={() => {}}
          onChange={() => {}}
        />
      </IntlProvider>,
    );

    expect(await screen.findByRole('textbox')).toBeInTheDocument();
    expect(await screen.findByRole('textbox')).toHaveValue('');
  });

  it('Renders nothing when display is false', () => {
    render(
      <IntlProvider locale="en">
        <TimeField
          display={false}
          value={undefined}
          inputRef={() => {}}
          error={undefined}
          onBlur={() => {}}
          onChange={() => {}}
        />
      </IntlProvider>,
    );

    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('Formats time correctly', async () => {
    render(
      <IntlProvider locale="en">
        <TimeField
          display
          value={['12:30:00Z', null]}
          inputRef={() => {}}
          error={undefined}
          onBlur={() => {}}
          onChange={() => {}}
        />
      </IntlProvider>,
    );

    expect(await screen.findByRole('textbox')).toHaveValue('12:30 PM');
  });
});
