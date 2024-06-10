import { fireEvent, render, screen } from "@testing-library/react";
import React from 'react'
import { IntlProvider } from "react-intl";
import TimeField from "./TimeField";
import userEvent from "@testing-library/user-event";

describe('TimeField', () => {
  it('Renders the TimeField correctly', async () => {
    render(
      <IntlProvider locale="en">
        <TimeField
          display={true}
          value={undefined}
          inputRef={() => {}}
          error={undefined}
          onBlur={() => {}}
          onChange={() => {}}
        />
      </IntlProvider>
    );

    expect(await screen.findByRole('textbox')).toBeInTheDocument();
    expect(await screen.findByRole('textbox')).toHaveValue('');
  });

  it('Renders nothing when display is false', async () => {
    render(
      <IntlProvider locale="en">
        <TimeField
          display={false}
          value='test'
          inputRef={() => {}}
          error={undefined}
          onBlur={() => {}}
          onChange={() => {}}
        />
      </IntlProvider>
    );

    expect(await screen.queryByRole('textbox')).toBeNull();
  });

  it('Formatse time correctly', async () => {
    render(
      <IntlProvider locale="en">
        <TimeField
          display={true}
          value='12:30:00'
          inputRef={() => {}}
          error={undefined}
          onBlur={() => {}}
          onChange={() => {}}
        />
      </IntlProvider>
    );

    expect(await screen.findByRole('textbox')).toHaveValue('12:30 PM');
  });
});
