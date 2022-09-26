import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import RowType from './RowType';

import OpenClosedSelect from './OpenClosedSelect';

jest.mock('react-intl', () => {
  const intl = {
    formatMessage: ({ id }) => id,
  };

  return {
    ...jest.requireActual('react-intl'),
    FormattedMessage: jest.fn(({ id, children }) => {
      if (children) {
        return children([id]);
      }

      return id;
    }),
    FormattedTime: jest.fn(({ value, children }) => {
      if (children) {
        return children([value]);
      }

      return value;
    }),
    useIntl: () => intl,
    injectIntl: (Component) => (props) => <Component {...props} intl={intl} />,
  };
});

describe('OpenClosedSelect', () => {
  it('includes open', () => {
    const onBlur = jest.fn();
    const onChange = jest.fn();

    render(<OpenClosedSelect onBlur={onBlur} onChange={onChange} />);

    expect(screen.getByText('ui-calendar.calendarForm.openClosedSelect.open')).toBeInTheDocument();
  });

  it('includes close', () => {
    const onBlur = jest.fn();
    const onChange = jest.fn();

    render(<OpenClosedSelect onBlur={onBlur} onChange={onChange} />);

    expect(screen.getByText('ui-calendar.calendarForm.openClosedSelect.closed')).toBeInTheDocument();
  });

  it('calls onBlur and onChange callbacks', () => {
    const onBlur = jest.fn();
    const onChange = jest.fn();

    render(<OpenClosedSelect onBlur={onBlur} onChange={onChange} />);
    userEvent.selectOptions(screen.getByRole('combobox'), [RowType.Open]);

    expect(onBlur).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalled();
  });
});
