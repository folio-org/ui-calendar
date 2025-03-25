import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import withIntlConfiguration from '../../test/util/withIntlConfiguration';
import ExceptionField from './ExceptionField';
import RowType from './RowType';

describe('ExceptionField', () => {
  it('Renders successfully', () => {
    render(
      withIntlConfiguration(
        <ExceptionField
          fieldRefs={{ startDate: {}, startTime: {}, endDate: {}, endTime: {} }}
          error={undefined}
          localeTimeFormat="HH:mm a"
          submitAttempted={false}
          input={{
            name: 'exception-field',
            onBlur: jest.fn(),
            onChange: jest.fn(),
            onFocus: jest.fn(),
            value: [],
          }}
          meta={{ touched: true }}
        />,
      ),
    );

    // header and add row button
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('Renders successfully with rows', () => {
    render(
      withIntlConfiguration(
        <ExceptionField
          fieldRefs={{ startDate: {}, startTime: {}, endDate: {}, endTime: {} }}
          error={undefined}
          localeTimeFormat="HH:mm a"
          submitAttempted={false}
          input={{
            name: 'exception-field',
            onBlur: jest.fn(),
            onChange: jest.fn(),
            onFocus: jest.fn(),
            value: [
              {
                i: 0,
                type: RowType.Open,
                name: 'Foo',
                lastRowI: 1,
                rows: [
                  {
                    i: 0,
                    startDate: '2000-01-01',
                    startTime: ['00:00:00Z', null],
                    endDate: '2000-01-05',
                    endTime: ['03:00:00Z', null],
                  },
                  {
                    i: 1,
                    startDate: '2000-01-06',
                    startTime: ['00:00:00Z', null],
                    endDate: '2000-01-08',
                    endTime: ['03:00:00Z', null],
                  },
                ],
              },
              {
                i: 1,
                type: RowType.Closed,
                name: 'Sample closure',
                lastRowI: 0,
                rows: [
                  {
                    i: 0,
                    startDate: '2000-01-01',
                    startTime: undefined,
                    endDate: '2000-01-05',
                    endTime: undefined,
                  },
                ],
              },
            ],
          }}
          meta={{ touched: true }}
        />,
      ),
    );

    // header and add row button
    expect(screen.getAllByRole('row')).toHaveLength(4);
  });

  it('Adds rows on button click', async () => {
    render(
      withIntlConfiguration(
        <ExceptionField
          fieldRefs={{ startDate: {}, startTime: {}, endDate: {}, endTime: {} }}
          error={undefined}
          localeTimeFormat="HH:mm a"
          submitAttempted={false}
          input={{
            name: 'exception-field',
            onBlur: jest.fn(),
            onChange: jest.fn(),
            onFocus: jest.fn(),
            value: [],
          }}
          meta={{ touched: true }}
        />,
      ),
    );

    // header and add row button
    expect(screen.getAllByRole('row')).toHaveLength(2);
    await userEvent.click(screen.getByRole('button', { name: 'Add row' }));
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it('Removes row on button click', async () => {
    render(
      withIntlConfiguration(
        <ExceptionField
          fieldRefs={{ startDate: {}, startTime: {}, endDate: {}, endTime: {} }}
          error={undefined}
          localeTimeFormat="HH:mm a"
          submitAttempted={false}
          input={{
            name: 'exception-field',
            onBlur: jest.fn(),
            onChange: jest.fn(),
            onFocus: jest.fn(),
            value: [
              {
                i: 0,
                type: RowType.Open,
                name: 'Foo',
                lastRowI: 1,
                rows: [
                  {
                    i: 0,
                    startDate: '2000-01-01',
                    startTime: ['00:00:00Z', null],
                    endDate: '2000-01-05',
                    endTime: ['03:00:00Z', null],
                  },
                  {
                    i: 1,
                    startDate: '2000-01-06',
                    startTime: ['00:00:00Z', null],
                    endDate: '2000-01-08',
                    endTime: ['03:00:00Z', null],
                  },
                ],
              },
              {
                i: 1,
                type: RowType.Closed,
                name: 'Sample closure',
                lastRowI: 0,
                rows: [
                  {
                    i: 0,
                    startDate: '2000-01-01',
                    startTime: undefined,
                    endDate: '2000-01-05',
                    endTime: undefined,
                  },
                ],
              },
            ],
          }}
          meta={{ touched: true }}
        />,
      ),
    );

    // header and add row button
    expect(screen.getAllByRole('row')).toHaveLength(4);
    // 9 from open and 3 from closed
    expect(screen.getAllByRole('textbox')).toHaveLength(12);

    // delete open row
    await userEvent.click(screen.getAllByRole('button', { name: 'trash' })[0]);
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getAllByRole('textbox')).toHaveLength(3);

    // delete closed row
    await userEvent.click(screen.getAllByRole('button', { name: 'trash' })[0]);
    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(screen.queryAllByRole('textbox')).toHaveLength(0);
  });

  it('Adds inner row on button click', async () => {
    render(
      withIntlConfiguration(
        <ExceptionField
          fieldRefs={{ startDate: {}, startTime: {}, endDate: {}, endTime: {} }}
          error={undefined}
          localeTimeFormat="HH:mm a"
          submitAttempted={false}
          input={{
            name: 'exception-field',
            onBlur: jest.fn(),
            onChange: jest.fn(),
            onFocus: jest.fn(),
            value: [
              {
                i: 0,
                type: RowType.Open,
                name: 'Foo',
                lastRowI: 1,
                rows: [
                  {
                    i: 0,
                    startDate: '2000-01-01',
                    startTime: ['00:00:00Z', null],
                    endDate: '2000-01-05',
                    endTime: ['03:00:00Z', null],
                  },
                  {
                    i: 1,
                    startDate: '2000-01-06',
                    startTime: ['00:00:00Z', null],
                    endDate: '2000-01-08',
                    endTime: ['03:00:00Z', null],
                  },
                ],
              },
            ],
          }}
          meta={{ touched: true }}
        />,
      ),
    );

    // header and add row button
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getAllByRole('textbox')).toHaveLength(9);

    // create additional inner row (four more textboxes)
    await userEvent.click(screen.getByRole('button', { name: 'plus-sign' }));
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getAllByRole('textbox')).toHaveLength(13);
  });
});
