/* eslint-disable no-useless-concat */
import {
  act,
  getAllByRole,
  getAllByText,
  getByRole,
  logRoles,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import React from 'react';
import { Paneset } from '@folio/stripes/components';
import userEvent from '@testing-library/user-event';
import DataRepository from '../../data/DataRepository';
import withIntlConfiguration from '../../test/util/withIntlConfiguration';
import InfoPane from './InfoPane';
import * as Calendars from '../../test/data/Calendars';
import * as Users from '../../test/data/Users';
import withHistoryConfiguration from '../../test/util/withHistoryConfiguration';
import { CalendarDTO, User } from '../../types/types';

const EN_DASH = '\u{2013}';
const NBSP = '\u{00a0}';

describe('Calendar info pane', () => {
  describe('Does not render when not appropriate', () => {
    test('null calendar', () => {
      const { container } = render(
        withIntlConfiguration(
          <InfoPane
            creationBasePath=""
            editBasePath=""
            calendar={null}
            onClose={jest.fn()}
            dataRepository={
              new DataRepository(undefined, undefined, {
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                getUser: jest.fn(),
                dates: jest.fn()
              })
            }
          />
        )
      );
      expect(container).toBeEmptyDOMElement();
    });

    test('undefined calendar', () => {
      const { container } = render(
        withIntlConfiguration(
          <InfoPane
            creationBasePath=""
            editBasePath=""
            calendar={undefined}
            onClose={jest.fn()}
            dataRepository={
              new DataRepository(undefined, undefined, {
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                getUser: jest.fn(),
                dates: jest.fn()
              })
            }
          />
        )
      );
      expect(container).toBeEmptyDOMElement();
    });
  });

  it('Renders empty calendar', () => {
    render(
      withHistoryConfiguration(
        withIntlConfiguration(
          <InfoPane
            creationBasePath=""
            editBasePath=""
            calendar={Calendars.SPRING_SP_1_2}
            onClose={jest.fn()}
            dataRepository={
              new DataRepository(undefined, undefined, {
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                getUser: jest.fn(),
                dates: jest.fn()
              })
            }
          />
        )
      )
    );

    const rows = screen.getAllByRole('row');
    const rowsText = rows
      .slice(1)
      .map((row) => getAllByRole(row, 'gridcell').map((cell) => cell.textContent));

    expect(rowsText).toStrictEqual([
      ['Sunday', 'Closed', ''],
      ['Monday', 'Closed', ''],
      ['Tuesday', 'Closed', ''],
      ['Wednesday', 'Closed', ''],
      ['Thursday', 'Closed', ''],
      ['Friday', 'Closed', ''],
      ['Saturday', 'Closed', '']
    ]);
  });

  it('Renders complex calendar', () => {
    render(
      withHistoryConfiguration(
        withIntlConfiguration(
          <InfoPane
            creationBasePath=""
            editBasePath=""
            calendar={Calendars.SUMMER_SP_1_2}
            onClose={jest.fn()}
            dataRepository={
              new DataRepository(undefined, undefined, {
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                getUser: jest.fn(),
                dates: jest.fn()
              })
            }
          />,
          'fr-FR'
        )
      )
    );

    const rows = screen.getAllByRole('row');
    const rowsText = rows
      .slice(1, 8)
      .map((row) => getAllByRole(row, 'gridcell').map((cell) => cell.textContent));

    expect(rowsText).toStrictEqual([
      ['lundi', '09:00', `01:00${NBSP}*`],
      ['mardi', '09:00', '23:00'],
      ['mercredi', '09:00', '23:00'],
      ['jeudi', '09:00', '23:00'],
      ['vendredi', '09:00' + '13:30', '12:00' + '20:00'],
      ['samedi', '09:00', '20:00'],
      ['dimanche', 'Closed', '']
    ]);
  });

  it('Renders 24/7 calendar', () => {
    render(
      withHistoryConfiguration(
        withIntlConfiguration(
          <InfoPane
            creationBasePath=""
            editBasePath=""
            calendar={Calendars.ALL_YEAR_SP_ONLINE_247}
            onClose={jest.fn()}
            dataRepository={
              new DataRepository(undefined, undefined, {
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                getUser: jest.fn(),
                dates: jest.fn()
              })
            }
          />
        )
      )
    );

    const rows = screen.getAllByRole('row');
    const rowsText = rows
      .slice(1, 8)
      .map((row) => getAllByRole(row, 'gridcell').map((cell) => cell.textContent));

    expect(rowsText).toStrictEqual([
      ['Sunday', EN_DASH, EN_DASH],
      ['Monday', EN_DASH, EN_DASH],
      ['Tuesday', EN_DASH, EN_DASH],
      ['Wednesday', EN_DASH, EN_DASH],
      ['Thursday', EN_DASH, EN_DASH],
      ['Friday', EN_DASH, EN_DASH],
      ['Saturday', EN_DASH, EN_DASH]
    ]);
  });

  it('Renders overnight calendars', () => {
    render(
      withHistoryConfiguration(
        withIntlConfiguration(
          <InfoPane
            creationBasePath=""
            editBasePath=""
            calendar={Calendars.SUMMER_SP_4_245}
            onClose={jest.fn()}
            dataRepository={
              new DataRepository(undefined, undefined, {
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                getUser: jest.fn(),
                dates: jest.fn()
              })
            }
          />
        )
      )
    );

    const rows = screen.getAllByRole('row');
    const rowsText = rows
      .slice(1, 8)
      .map((row) => getAllByRole(row, 'gridcell').map((cell) => cell.textContent));

    expect(rowsText).toStrictEqual([
      ['Sunday', '9:00 AM', EN_DASH],
      ['Monday', EN_DASH, EN_DASH],
      ['Tuesday', EN_DASH, EN_DASH],
      ['Wednesday', EN_DASH, EN_DASH],
      ['Thursday', EN_DASH, EN_DASH],
      ['Friday', EN_DASH, '8:00 PM'],
      ['Saturday', '9:00 AM', '8:00 PM']
    ]);
  });

  it('should render action buttons', async () => {
    const props = {
      creationBasePath: '',
      editBasePath: '',
      calendar: Calendars.SPRING_SP_1_2,
      onClose: jest.fn(),
      dataRepository: new DataRepository(undefined, undefined, {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        getUser: jest.fn(),
        dates: jest.fn()
      })
    };

    render(
      withHistoryConfiguration(
        withIntlConfiguration(
          <Paneset>
            <InfoPane {...props} />
          </Paneset>
        )
      )
    );

    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Duplicate' })
    ).toBeInTheDocument();
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
        startDate: '2022-09-01',
        endDate: '2022-09-30',
        normalHours: [],
        exceptions: [],
        metadata: {
          createdDate: '2022-08-01T01:02:03Z',
          updatedDate: '2022-08-01T01:02:03Z'
        }
      },
      onClose: jest.fn(),
      dataRepository: {
        getServicePointNamesFromIds: (list: string[]) => list,
        deleteCalendar: () => Promise.resolve()
      } as unknown as DataRepository
    };

    render(
      withHistoryConfiguration(
        withIntlConfiguration(
          <Paneset>
            <InfoPane {...props} />
          </Paneset>
        )
      )
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      expect(screen.getByText('Confirm deletion')).toBeVisible();
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    });

    expect(props.onClose).toHaveBeenCalled();
  });

  it('Metadata when none is included', () => {
    render(
      withHistoryConfiguration(
        withIntlConfiguration(
          <InfoPane
            creationBasePath=""
            editBasePath=""
            calendar={Calendars.SUMMER_SP_1_2}
            onClose={jest.fn()}
            dataRepository={
              new DataRepository(undefined, undefined, {
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                getUser: jest.fn(),
                dates: jest.fn()
              })
            }
          />
        )
      )
    );

    const metadata = screen.getByRole('region', { name: 'Record metadata' });

    expect(metadata).toHaveTextContent('Created by' + 'Unknown');
    expect(metadata).toHaveTextContent('Created at' + 'Unknown');
    expect(metadata).toHaveTextContent('Last edited by' + 'Unknown');
    expect(metadata).toHaveTextContent('Last edited at' + 'Unknown');
  });

  it('Metadata when empty metadata object is provided', () => {
    render(
      withHistoryConfiguration(
        withIntlConfiguration(
          <InfoPane
            creationBasePath=""
            editBasePath=""
            calendar={{ ...Calendars.SUMMER_SP_1_2, metadata: {} }}
            onClose={jest.fn()}
            dataRepository={
              new DataRepository(undefined, undefined, {
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                getUser: jest.fn(),
                dates: jest.fn()
              })
            }
          />
        )
      )
    );

    const metadata = screen.getByRole('region', { name: 'Record metadata' });

    expect(metadata).toHaveTextContent('Created by' + 'Unknown');
    expect(metadata).toHaveTextContent('Created at' + 'Unknown');
    expect(metadata).toHaveTextContent('Last edited by' + 'Unknown');
    expect(metadata).toHaveTextContent('Last edited at' + 'Unknown');
  });

  it('Metadata when all is included', async () => {
    const userMock = jest.fn(({ userId }: { userId: string }) => Promise.resolve((Users as Record<string, User>)[userId] as User));

    render(
      withHistoryConfiguration(
        withIntlConfiguration(
          <InfoPane
            creationBasePath=""
            editBasePath=""
            calendar={
              {
                ...Calendars.SUMMER_SP_1_2,
                metadata: {
                  createdDate: '2022-09-20T04:07:00.557Z',
                  createdByUserId: 'PETRO_PROKOPOVYCH',
                  updatedDate: '2022-09-28T04:07:00.557Z',
                  updatedByUserId: 'JOHANN_DZIERZON'
                }
              } as CalendarDTO
            }
            onClose={jest.fn()}
            dataRepository={
              new DataRepository(undefined, undefined, {
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                getUser: userMock,
                dates: jest.fn()
              })
            }
          />
        )
      )
    );

    await waitFor(() => expect(userMock).toHaveBeenCalledTimes(2));

    const metadata = screen.getByRole('region', { name: 'Record metadata' });

    expect(metadata).toHaveTextContent('Created by' + 'Prokopovych, Petro');
    expect(metadata).toHaveTextContent('Created at' + '9/20/2022 4:07 AM');
    expect(metadata).toHaveTextContent('Last edited by' + 'Dzierzon, Jan');
    expect(metadata).toHaveTextContent('Last edited at' + '9/28/2022 4:07 AM');
  });

  it('Metadata handles unknown errors gracefully', async () => {
    const userMock = jest.fn(() => Promise.reject());

    render(
      withHistoryConfiguration(
        withIntlConfiguration(
          <InfoPane
            creationBasePath=""
            editBasePath=""
            calendar={
              {
                ...Calendars.SUMMER_SP_1_2,
                metadata: {
                  createdDate: '2022-09-20T04:07:00.557Z',
                  createdByUserId: 'PETRO_PROKOPOVYCH',
                  updatedDate: '2022-09-28T04:07:00.557Z',
                  updatedByUserId: 'JOHANN_DZIERZON'
                }
              } as CalendarDTO
            }
            onClose={jest.fn()}
            dataRepository={
              new DataRepository(undefined, undefined, {
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                getUser: userMock,
                dates: jest.fn()
              })
            }
          />
        )
      )
    );

    const consoleMock = jest.spyOn(console, 'error').mockImplementation();

    await waitFor(() => expect(userMock).toHaveBeenCalledTimes(2));

    const metadata = screen.getByRole('region', { name: 'Record metadata' });

    // would normally fallback to UUIDs but we supply these names for testing
    expect(metadata).toHaveTextContent('Created by' + 'PETRO_PROKOPOVYCH');
    expect(metadata).toHaveTextContent('Created at' + '9/20/2022 4:07 AM');
    expect(metadata).toHaveTextContent('Last edited by' + 'JOHANN_DZIERZON');
    expect(metadata).toHaveTextContent('Last edited at' + '9/28/2022 4:07 AM');

    expect(consoleMock).toHaveBeenCalledTimes(2);

    consoleMock.mockRestore();
  });

  it('MCL headings are clickable', async () => {
    render(
      withHistoryConfiguration(
        withIntlConfiguration(
          <InfoPane
            creationBasePath=""
            editBasePath=""
            calendar={Calendars.SUMMER_SP_1_2}
            onClose={jest.fn()}
            dataRepository={
              new DataRepository(undefined, undefined, {
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                getUser: jest.fn(),
                dates: jest.fn()
              })
            }
          />
        )
      )
    );

    // ensures column headers are there
    await userEvent.click(
      getByRole(
        screen.getByRole('region', { name: 'Hours of operation' }),
        'columnheader',
        { name: 'Day' }
      )
    );
    await userEvent.click(
      getByRole(
        screen.getByRole('region', { name: 'Exceptions — openings' }),
        'columnheader',
        { name: 'Start' }
      )
    );
    await userEvent.click(
      getByRole(
        screen.getByRole('region', { name: 'Exceptions — closures' }),
        'columnheader',
        { name: 'Start' }
      )
    );
  });
});
