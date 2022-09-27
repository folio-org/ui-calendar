import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import withIntlConfiguration from '../test/util/withIntlConfiguration';
import PurgeModal from './PurgeModal';
import DataRepository from '../data/DataRepository';

describe('PurgeModal', () => {
  it('correctly calls props.onClose', async () => {
    const onClose = jest.fn();
    const dataRepository = {
      getCalendars: jest.fn()
    } as unknown as DataRepository;

    render(
      withIntlConfiguration(
        <PurgeModal onClose={onClose} open dataRepository={dataRepository} />
      )
    );

    await userEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });
});
