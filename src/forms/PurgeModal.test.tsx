import { CalloutContext } from '@folio/stripes/core';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HTTPError } from 'ky';
import React from 'react';
import DataRepository from '../data/DataRepository';
import * as Calendars from '../test/data/Calendars';
import withIntlConfiguration from '../test/util/withIntlConfiguration';
import PurgeModal, { AgeCriteria, AssignmentCriteria } from './PurgeModal';

const mutators = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  dates: jest.fn(),
  getUser: jest.fn(),
};

const mutatorsReject = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(() => {
    throw new HTTPError(
      { text: () => Promise.resolve('foo') } as any,
      null as any,
      null as any
    );
  }),
  dates: jest.fn(),
  getUser: jest.fn(),
};

describe('PurgeModal', () => {
  it('correctly calls props.onClose', async () => {
    const onClose = jest.fn();
    const dataRepository = {
      getCalendars: jest.fn(),
    } as unknown as DataRepository;

    render(
      withIntlConfiguration(
        <PurgeModal onClose={onClose} open dataRepository={dataRepository} />
      )
    );

    await userEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('correctly purges calendars', async () => {
    const onClose = jest.fn();
    const ageCriteria = AgeCriteria.YEARS_2;
    const assignmentCriteria = AssignmentCriteria.ANY;
    const repository = new DataRepository(
      [Calendars.SPRING_SP_1_2],
      [],
      mutators
    );
    render(
      withIntlConfiguration(
        <PurgeModal onClose={onClose} open dataRepository={repository} />
      )
    );
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Purge calendars that ended...' }),
      ageCriteria
    );
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'And were...' }),
      assignmentCriteria
    );
    await userEvent.click(screen.getByText('Delete'));

    await waitFor(() => expect(mutators.delete).toHaveBeenCalled());
  });

  it('correctly purges calendars', async () => {
    const onClose = jest.fn();
    const ageCriteria = AgeCriteria.YEARS_2;
    const assignmentCriteria = AssignmentCriteria.ANY;
    const repository = new DataRepository([], [], mutators);
    render(
      withIntlConfiguration(
        <PurgeModal onClose={onClose} open dataRepository={repository} />
      )
    );
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Purge calendars that ended...' }),
      ageCriteria
    );
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'And were...' }),
      assignmentCriteria
    );
    await userEvent.click(screen.getByText('Delete'));

    await waitFor(() => expect(mutators.delete).toHaveBeenCalled());
  });

  it('handles failures gracefully', async () => {
    const repository = new DataRepository(
      [Calendars.SPRING_UNASSIGNED],
      [],
      mutatorsReject
    );
    const sendCallout = jest.fn();
    render(
      withIntlConfiguration(
        <CalloutContext.Provider value={{ sendCallout }}>
          <PurgeModal onClose={jest.fn()} open dataRepository={repository} />
        </CalloutContext.Provider>
      )
    );
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Purge calendars that ended...' }),
      AgeCriteria.YEARS_2
    );
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'And were...' }),
      AssignmentCriteria.NONE
    );
    await userEvent.click(screen.getByText('Delete'));

    await waitFor(() => expect(mutatorsReject.delete).toHaveBeenCalled());
  });
});
