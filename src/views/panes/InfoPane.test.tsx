/* eslint-disable no-useless-concat */
import { Paneset } from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';
import {
  act,
  getAllByRole,
  getByRole,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ky, { ResponsePromise } from 'ky';
import { KyInstance } from 'ky/distribution/types/ky';
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import DataRepository from '../../data/DataRepository';
import * as Calendars from '../../test/data/Calendars';
import * as Users from '../../test/data/Users';
import withHistoryConfiguration from '../../test/util/withHistoryConfiguration';
import withIntlConfiguration from '../../test/util/withIntlConfiguration';
import { CalendarDTO, User } from '../../types/types';
import InfoPane, { InfoPaneProps } from './InfoPane';

const EN_DASH = '\u{2013}';
const NBSP = '\u{00a0}';

jest.mock('@folio/stripes/core');

const mockedUseOkapiKy = useOkapiKy as unknown as jest.Mock<typeof ky>;
mockedUseOkapiKy.mockImplementation(() => {
  const kyBase = jest.fn() as unknown as KyInstance;
  kyBase.get = (url) => {
    if (
      (url as string).startsWith('users/') &&
      Object.keys(Users).includes((url as string).substring(6))
    ) {
      return {
        json: () => Promise.resolve(
            (Users as Record<string, User>)[
              (url as string).substring(6)
            ] as User,
        ),
      } as unknown as ResponsePromise;
    } else {
      throw new Error(`ky attempted to GET an unknown URL ${url}`);
    }
  };
  return kyBase;
});

function withEverything(children: ReactNode, locale?: string) {
  return withHistoryConfiguration(
    withIntlConfiguration(
      <QueryClientProvider client={new QueryClient()}>
        {children}
      </QueryClientProvider>,
      locale,
    ),
  );
}

describe('Calendar info pane', () => {
  describe('Does not render when not appropriate', () => {
    test('null calendar', () => {
      const { container } = render(
        withEverything(
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
                dates: jest.fn(),
              })
            }
          />,
        ),
      );
      expect(container).toBeEmptyDOMElement();
    });

    test('undefined calendar', () => {
      const { container } = render(
        withEverything(
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
                dates: jest.fn(),
              })
            }
          />,
        ),
      );
      expect(container).toBeEmptyDOMElement();
    });
  });

  it('Renders empty calendar', () => {
    render(
      withEverything(
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
              dates: jest.fn(),
            })
          }
        />,
      ),
    );

    const rows = screen.getAllByRole('row');
    const rowsText = rows
      .slice(1)
      .map((row) => getAllByRole(row, 'gridcell').map((cell) => cell.textContent));

    expect(rowsText).toStrictEqual([
      ['Sunday', 'Closed', `${NBSP}Closed`],
      ['Monday', 'Closed', `${NBSP}Closed`],
      ['Tuesday', 'Closed', `${NBSP}Closed`],
      ['Wednesday', 'Closed', `${NBSP}Closed`],
      ['Thursday', 'Closed', `${NBSP}Closed`],
      ['Friday', 'Closed', `${NBSP}Closed`],
      ['Saturday', 'Closed', `${NBSP}Closed`],
    ]);
  });

  it('Renders complex calendar', () => {
    render(
      withEverything(
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
              dates: jest.fn(),
            })
          }
        />,
        'fr-FR',
      ),
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
      ['dimanche', 'Closed', `${NBSP}Closed`],
    ]);
  });

  it('Renders 24/7 calendar', () => {
    render(
      withEverything(
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
              dates: jest.fn(),
            })
          }
        />,
      ),
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
      ['Saturday', EN_DASH, EN_DASH],
    ]);
  });

  it('Renders overnight calendars', () => {
    render(
      withEverything(
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
              dates: jest.fn(),
            })
          }
        />,
      ),
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
      ['Saturday', '9:00 AM', '8:00 PM'],
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
        dates: jest.fn(),
      }),
    };

    render(
      withEverything(
        <Paneset>
          <InfoPane {...props} />
        </Paneset>,
      ),
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    });

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Duplicate' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it.skip('handles delete', async () => {
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
          updatedDate: '2022-08-01T01:02:03Z',
        },
      },
      onClose: jest.fn(),
      dataRepository: {
        getServicePointNamesFromIds: (list: string[]) => list,
        deleteCalendar: () => Promise.resolve(),
      } as unknown as DataRepository,
    } as InfoPaneProps;

    render(
      withEverything(
        <Paneset>
          <InfoPane {...props} />
        </Paneset>,
      ),
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      await waitFor(() => expect(screen.getByText('Confirm deletion')).toBeVisible());
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    });

    expect(props.onClose).toHaveBeenCalled();
  });

  it('Metadata when none is included', async () => {
    render(
      withEverything(
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
              dates: jest.fn(),
            })
          }
        />,
      ),
    );

    await act(async () => {
      await userEvent.click(
        screen.getByRole('button', { name: 'Record last updated: Unknown' }),
      );
    });
    const metadata = screen.getByRole('region', {
      name: 'Calendar information',
    });

    await waitFor(() => {
      expect(metadata).toHaveTextContent('Source: ' + 'Unknown');
      expect(metadata).toHaveTextContent('Record created: ' + 'Unknown');
      expect(metadata).toHaveTextContent('Source: ' + 'Unknown');
      expect(metadata).toHaveTextContent('Record last updated: ' + 'Unknown');
    });
  });

  it('Metadata when empty metadata object is provided', async () => {
    render(
      withEverything(
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
              dates: jest.fn(),
            })
          }
        />,
      ),
    );

    await act(async () => {
      await userEvent.click(
        screen.getByRole('button', { name: 'Record last updated: Unknown' }),
      );
    });
    const metadata = screen.getByRole('region', {
      name: 'Calendar information',
    });

    await waitFor(() => {
      expect(metadata).toHaveTextContent('Source: ' + 'Unknown');
      expect(metadata).toHaveTextContent('Record created: ' + 'Unknown');
      expect(metadata).toHaveTextContent('Source: ' + 'Unknown');
      expect(metadata).toHaveTextContent('Record last updated: ' + 'Unknown');
    });
  });

  it('Metadata when all is included', async () => {
    render(
      withEverything(
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
                updatedByUserId: 'JOHANN_DZIERZON',
              },
            } as CalendarDTO
          }
          onClose={jest.fn()}
          dataRepository={
            new DataRepository(undefined, undefined, {
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              dates: jest.fn(),
            })
          }
        />,
      ),
    );

    await act(async () => {
      await userEvent.click(
        screen.getByRole('button', {
          name: 'Record last updated: 9/28/2022 4:07 AM',
        }),
      );
    });
    const metadata = screen.getByRole('region', {
      name: 'Calendar information',
    });

    await waitFor(() => {
      expect(metadata).toHaveTextContent('Source: ' + 'Prokopovych, Petro');
      expect(metadata).toHaveTextContent(
        'Record created: ' + '9/20/2022 4:07 AM',
      );
      expect(metadata).toHaveTextContent('Source: ' + 'Dzierzon, Johann');
      expect(metadata).toHaveTextContent(
        'Record last updated: ' + '9/28/2022 4:07 AM',
      );
    });
  });

  it('MCL headings are clickable', async () => {
    render(
      withEverything(
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
              dates: jest.fn(),
            })
          }
        />,
      ),
    );

    // ensures column headers are there
    await act(async () => {
      await userEvent.click(
        getByRole(
          screen.getByRole('region', { name: 'Hours of operation' }),
          'columnheader',
          { name: 'Day' },
        ),
      );
      await userEvent.click(
        getByRole(
          screen.getByRole('region', { name: 'Exceptions — openings' }),
          'columnheader',
          { name: 'Start' },
        ),
      );
      await userEvent.click(
        getByRole(
          screen.getByRole('region', { name: 'Exceptions — closures' }),
          'columnheader',
          { name: 'Start' },
        ),
      );
    });
  });
});
