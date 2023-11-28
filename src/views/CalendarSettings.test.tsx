import React from 'react';
import { render, screen } from '@testing-library/react';
import { SettingsProps } from '@folio/stripes/smart-components';
import CalendarSettings from './CalendarSettings';
import withIntlConfiguration from '../test/util/withIntlConfiguration';

jest.mock('@folio/stripes-smart-components/lib/Settings', () => jest.fn().mockReturnValue('Settings'));

const renderCalendarSettings = () => render(withIntlConfiguration(
  <CalendarSettings {...({} as unknown as SettingsProps)} />
));

describe('Calender Settings', () => {
  it('should render Calendar Settings', () => {
    renderCalendarSettings();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});
