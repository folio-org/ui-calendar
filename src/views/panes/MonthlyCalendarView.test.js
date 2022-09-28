import React from 'react';
import { render, screen } from '@testing-library/react';
import withIntlConfiguration from '../../test/util/withIntlConfiguration';
import { SERVICE_POINT_1 } from '../../test/data/ServicePoints';
import MonthlyCalendarView from './MonthlyCalendarView';

jest.mock('../../components/Calendar.tsx', () => {
  return jest.fn(() => (<div>Calendar</div>));
});

describe('MonthlyCalendarView', () => {
  it('should render MonthlyCalendarView', () => {
    const events = {};
    render(withIntlConfiguration(
      <MonthlyCalendarView
        servicePoint={SERVICE_POINT_1}
        events={events}
        requestEvents={jest.fn()}
      />
    ));
    expect(screen.getByText('Calendar')).toBeInTheDocument();
  });
});
