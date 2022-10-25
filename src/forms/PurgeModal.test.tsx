import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Calendars from '../test/data/Calendars';
import withIntlConfiguration from '../test/util/withIntlConfiguration';
import PurgeModal, { AgeCriteria, AssignmentCriteria } from './PurgeModal';
import DataRepository from '../data/DataRepository';

const mutators = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  dates: jest.fn(),
  getUser: jest.fn()
};

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

describe('PurgeModal', () => {
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
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Purge calendars that ended...' }), ageCriteria);
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'And were...' }), assignmentCriteria);
    await userEvent.click(screen.getByText('Delete'));

    await waitFor(() => expect(mutators.delete).toHaveBeenCalled());
  });
});

describe('PurgeModal', () => {
  it('correctly purges calendars', async () => {
    const onClose = jest.fn();
    const ageCriteria = AgeCriteria.YEARS_2;
    const assignmentCriteria = AssignmentCriteria.ANY;
    const repository = new DataRepository(
      [],
      [],
      mutators
    );
    render(
      withIntlConfiguration(
        <PurgeModal onClose={onClose} open dataRepository={repository} />
      )
    );
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Purge calendars that ended...' }), ageCriteria);
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'And were...' }), assignmentCriteria);
    await userEvent.click(screen.getByText('Delete'));

    await waitFor(() => expect(mutators.delete).toHaveBeenCalled());
  });
});
