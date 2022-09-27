import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import withIntlConfiguration from '../test/util/withIntlConfiguration';
import PurgeModal from './PurgeModal';

describe('PurgeModal', () => {
  it('correctly calls props.onClose', () => {
    const onClose = jest.fn();
    const dataRepository = {
      getCalendars: jest.fn(),
    };

    render(withIntlConfiguration(<PurgeModal onClose={onClose} open dataRepository={dataRepository} />));

    userEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });
});
