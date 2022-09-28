import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import {
  Paneset
} from '@folio/stripes/components';

import InfoPane from './InfoPane';
import withHistoryConfiguration from '../../test/util/withHistoryConfiguration';

describe('InfoPane', () => {
  it('should render action buttons', async () => {
    const props = {
      creationBasePath: '',
      editBasePath: '',
      calendar: {
        id: 'some-id',
        name: 'some-name',
        assignments: [],
        startDate: new Date('2022-09-01T01:02:03Z'),
        endDate: new Date('2022-09-30T23:59:59Z'),
        normalHours: [],
        exceptions: [],
      },
      onClose: jest.fn(),
      dataRepository: {
        getServicePointNamesFromIds: (list) => list,
      },
    };

    render(withHistoryConfiguration(<Paneset><InfoPane {...props} /></Paneset>));

    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Duplicate' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('handles delete', async () => {
    const props = {
      creationBasePath: '',
      editBasePath: '',
      calendar: {
        id: 'some-id',
        name: 'some-name',
        assignments: [],
        startDate: new Date('2022-09-01T01:02:03Z'),
        endDate: new Date('2022-09-30T23:59:59Z'),
        normalHours: [],
        exceptions: [],
        metadata: {
          createdDate: '2022-08-01T01:02:03Z',
          updatedDate: '2022-08-01T01:02:03Z',
        }
      },
      onClose: jest.fn(),
      dataRepository: {
        getServicePointNamesFromIds: (list) => list,
        deleteCalendar: () => Promise.resolve(),
      },
    };

    render(withHistoryConfiguration(<Paneset><InfoPane {...props} /></Paneset>));

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      expect(screen.getByText('Confirm deletion')).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    });

    expect(props.onClose).toHaveBeenCalled();
  });
});
