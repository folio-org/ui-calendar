import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import * as Weekdays from '../../test/data/Weekdays';
import withIntlConfiguration from '../../test/util/withIntlConfiguration';
import HoursOfOperationField from './HoursOfOperationField';
import RowType from './RowType';

describe('HoursOfOperationField', () => {
  it('renders successfully with no rows', () => {
    render(
      withIntlConfiguration(
        <HoursOfOperationField
          timeFieldRefs={{ startTime: {}, endTime: {} }}
          error={undefined}
          localeTimeFormat="HH:mm a"
          submitAttempted={false}
          input={{
            name: 'exception-field',
            onBlur: jest.fn(),
            onChange: jest.fn(),
            onFocus: jest.fn(),
            value: []
          }}
          meta={{ touched: true }}
          isNewCalendar={false}
        />
      )
    );

    // should generate single filler row, headers, and add
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it('renders entirely empty on calendar creation', () => {
    render(
      withIntlConfiguration(
        <HoursOfOperationField
          timeFieldRefs={{ startTime: {}, endTime: {} }}
          error={undefined}
          localeTimeFormat="HH:mm a"
          submitAttempted={false}
          input={{
            name: 'exception-field',
            onBlur: jest.fn(),
            onChange: jest.fn(),
            onFocus: jest.fn(),
            value: []
          }}
          meta={{ touched: true }}
          isNewCalendar
        />
      )
    );

    // should generate single empty row, headers, and add
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it('renders complex calendar appropriately', () => {
    render(
      withIntlConfiguration(
        <HoursOfOperationField
          timeFieldRefs={{ startTime: {}, endTime: {} }}
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
                startDay: Weekdays.Wednesday,
                startTime: '00:00',
                endDay: Weekdays.Wednesday,
                endTime: '20:00'
              }
            ]
          }}
          meta={{ touched: true }}
          isNewCalendar={false}
        />
      )
    );

    // should generate opening, surrounding closings on each side,
    // headers, and add row
    expect(screen.getAllByRole('row')).toHaveLength(5);
  });

  it('delete removes rows', async () => {
    render(
      withIntlConfiguration(
        <HoursOfOperationField
          timeFieldRefs={{ startTime: {}, endTime: {} }}
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
                startDay: Weekdays.Wednesday,
                startTime: '00:00',
                endDay: Weekdays.Wednesday,
                endTime: '20:00'
              }
            ]
          }}
          meta={{ touched: true }}
          isNewCalendar={false}
        />
      )
    );

    // should generate opening, surrounding closings on each side,
    // headers, and add row
    expect(screen.getAllByRole('row')).toHaveLength(5);

    await userEvent.click(screen.getAllByRole('button', { name: 'trash' })[0]);
    expect(screen.getAllByRole('row')).toHaveLength(4);

    await userEvent.click(screen.getAllByRole('button', { name: 'trash' })[0]);
    expect(screen.getAllByRole('row')).toHaveLength(3);

    // only the add new button and headers remain
    await userEvent.click(screen.getAllByRole('button', { name: 'trash' })[0]);
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('can add rows', async () => {
    render(
      withIntlConfiguration(
        <HoursOfOperationField
          timeFieldRefs={{ startTime: {}, endTime: {} }}
          error={undefined}
          localeTimeFormat="HH:mm a"
          submitAttempted={false}
          input={{
            name: 'exception-field',
            onBlur: jest.fn(),
            onChange: jest.fn(),
            onFocus: jest.fn(),
            value: []
          }}
          meta={{ touched: true }}
          isNewCalendar
        />
      )
    );

    // headers, default empty row, and add row
    expect(screen.getAllByRole('row')).toHaveLength(3);

    await userEvent.click(screen.getByRole('button', { name: 'Add row' }));
    expect(screen.getAllByRole('row')).toHaveLength(4);

    await userEvent.click(screen.getByRole('button', { name: 'Add row' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add row' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add row' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add row' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add row' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add row' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add row' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add row' }));
    expect(screen.getAllByRole('row')).toHaveLength(12);
  });

  it('shows the expected amount of fields when changing open/closed', async () => {
    render(
      withIntlConfiguration(
        <HoursOfOperationField
          timeFieldRefs={{ startTime: {}, endTime: {} }}
          error={undefined}
          localeTimeFormat="HH:mm a"
          submitAttempted={false}
          input={{
            name: 'exception-field',
            onBlur: jest.fn(),
            onChange: jest.fn(),
            onFocus: jest.fn(),
            value: []
          }}
          meta={{ touched: true }}
          isNewCalendar
        />
      )
    );

    // headers, default empty row, and add row
    expect(screen.getAllByRole('row')).toHaveLength(3);
    // 2 time fields per open row (and open is default)
    expect(screen.getAllByRole('textbox')).toHaveLength(2);

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Status' }),
      RowType.Closed
    );
    await waitFor(() => expect(screen.queryAllByRole('textbox')).toHaveLength(0));

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Status' }),
      RowType.Open
    );
    await waitFor(() => expect(screen.getAllByRole('textbox')).toHaveLength(2));
  });
});
