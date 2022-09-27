import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import RowType from './RowType';
import OpenClosedSelect from './OpenClosedSelect';
import withIntlConfiguration from '../../test/util/withIntlConfiguration';

describe('OpenClosedSelect', () => {
  it('includes open', () => {
    const onBlur = jest.fn();
    const onChange = jest.fn();

    render(
      withIntlConfiguration(
        <OpenClosedSelect
          onBlur={onBlur}
          onChange={onChange}
          value={RowType.Open}
        />
      )
    );

    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('includes close', () => {
    const onBlur = jest.fn();
    const onChange = jest.fn();

    render(
      withIntlConfiguration(
        <OpenClosedSelect
          onBlur={onBlur}
          onChange={onChange}
          value={RowType.Open}
        />
      )
    );

    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('calls onBlur and onChange callbacks', async () => {
    const onBlur = jest.fn();
    const onChange = jest.fn();

    render(
      withIntlConfiguration(
        <OpenClosedSelect
          onBlur={onBlur}
          onChange={onChange}
          value={RowType.Open}
        />
      )
    );
    await userEvent.selectOptions(screen.getByRole('combobox'), [RowType.Open]);

    expect(onBlur).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalled();
  });
});
