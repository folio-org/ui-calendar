import React from 'react';
import { render, screen } from '@testing-library/react';
import { useIntl } from 'react-intl';
import useDataRepository from '../data/useDataRepository';
import withIntlConfiguration from '../test/util/withIntlConfiguration';
import withHistoryConfiguration from '../test/util/withHistoryConfiguration';
import ServicePoints from '../test/data/ServicePoints';
import MonthlyCalendarPickerView, { dailyOpeningToCalendarDisplay } from './MonthlyCalendarPickerView';
import * as Dates from '../test/data/Dates';
import * as Times from '../test/data/DateTimes';

jest.mock('../data/useDataRepository');
jest.mock('../components/Calendar.tsx', () => {
  return jest.fn(() => (<div>Calendar</div>));
});

describe('MonthlyCalendarPickerView', () => {
  describe('renders a loading pane', () => {
    beforeEach(() => {
      const mockUseDataRepository = useDataRepository;
      mockUseDataRepository.mockReturnValue({
        isLoaded: () => false
      });
    });

    it('renders', () => {
      render(
        withHistoryConfiguration(withIntlConfiguration(<MonthlyCalendarPickerView />))
      );
      expect(screen.getByText('Monthly calendar view')).toBeInTheDocument();
    });
  });
  describe('renders a MonthlyCalendarPickerView', () => {
    beforeEach(() => {
      const mockUseDataRepository = useDataRepository;
      mockUseDataRepository.mockReturnValue({
        isLoaded: () => true,
        getServicePoints: () => ServicePoints,
        getServicePointFromId: () => {}
      });
    });

    it('renders', () => {
      render(
        withHistoryConfiguration(withIntlConfiguration(<MonthlyCalendarPickerView />))
      );
      expect(screen.getByText('Monthly calendar view')).toBeInTheDocument();
    });

    it('should render 5 nav items', () => {
      render(
        withHistoryConfiguration(withIntlConfiguration(<MonthlyCalendarPickerView />))
      );

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(5);

      expect(links[0].textContent).toEqual('Service point 1');
      expect(links[0].href).toContain('/3a40852d-49fd-4df2-a1f9-6e2641a6e91f');

      expect(links[1].textContent).toEqual('Service point 2');
      expect(links[1].href).toContain('/3b071ddf-14ad-58a1-9fb5-b3737da888de');

      expect(links[2].textContent).toEqual('c085c999-3600-5e06-a758-d052565f89fd');
      expect(links[2].href).toContain('/c085c999-3600-5e06-a758-d052565f89fd');

      expect(links[3].textContent).toEqual('7a5e720f-2dc2-523a-b77e-3c996578e241');
      expect(links[3].href).toContain('/7a5e720f-2dc2-523a-b77e-3c996578e241');

      expect(links[4].textContent).toEqual('Online');
      expect(links[4].href).toContain('/7c5abc9f-f3d7-4856-b8d7-6712462ca007');
    });
  });
});

test('dailyOpeningToCalendarDisplay', () => {
  const openingInfo = {
    date: Dates.DEC_1,
    allDay: true,
    open: true,
    exceptional: false,
    openings: { startTime: '12:00', endTime: '18:00' }
  };
  expect(dailyOpeningToCalendarDisplay(useIntl, openingInfo).key).toBe('975628800000');
});

test('dailyOpeningToCalendarDisplay', () => {
  const openingInfo = {
    date: Dates.DEC_1,
    allDay: true,
    open: true,
    exceptional: true,
    openings: { startTime: '12:00', endTime: '18:00' }
  };
  expect(dailyOpeningToCalendarDisplay(useIntl, openingInfo).key).toBe('975628800000');
});

test('dailyOpeningToCalendarDisplay', () => {
  const openingInfo = {
    date: Dates.DEC_1,
    allDay: true,
    open: false,
    exceptional: true,
    openings: { startTime: '12:00', endTime: '18:00' }
  };
  expect(dailyOpeningToCalendarDisplay(useIntl, openingInfo).key).toBe('975628800000');
});
