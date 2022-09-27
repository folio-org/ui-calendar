import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import withIntlConfiguration from '../../test/util/withIntlConfiguration';
import * as Weekdays from '../../test/data/Weekdays';
import WeekdayPicker from './WeekdayPicker';

describe('WeekdayPicker', () => {
  it('correctly calls props.onChange', async () => {
    const day = Weekdays.Sunday;
    const onChange = jest.fn();
    render(
      withIntlConfiguration(
        <WeekdayPicker value={undefined} onChange={onChange} />
      )
    );

    await userEvent.selectOptions(screen.getByRole('combobox'), [day]);
    await userEvent.selectOptions(screen.getByRole('combobox'), ['']);

    expect(onChange).toHaveBeenNthCalledWith(1, day);
    expect(onChange).toHaveBeenNthCalledWith(2, undefined);
  });
});
