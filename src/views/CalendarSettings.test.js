import React from 'react';
import { render, screen } from '@testing-library/react';
import CalendarSettings from './CalendarSettings';

jest.mock('@folio/stripes-smart-components/lib/Settings', () => jest.fn().mockReturnValue('Settings'));

const renderCalendarSettings = () => render(<CalendarSettings />);

describe('Calender Settings', () => {
  it('should render Calendar Settings', () => {
    renderCalendarSettings();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});
