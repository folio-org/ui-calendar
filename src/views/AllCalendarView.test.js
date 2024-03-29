import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import { useStripes } from '@folio/stripes/core';
import useDataRepository from '../data/useDataRepository';
import withHistoryConfiguration from '../test/util/withHistoryConfiguration';
import withIntlConfiguration from '../test/util/withIntlConfiguration';
import AllCalendarView from './AllCalendarView';

jest.mock('../data/useDataRepository');
// jest.mock('@folio/stripes/core');

describe('AllCalendarView', () => {
  describe('renders a loading pane', () => {
    beforeEach(() => {
      const mockUseDataRepository = useDataRepository;
      mockUseDataRepository.mockReturnValue({
        isLoaded: () => false
      });
    });

    it('renders', () => {
      render(
        withHistoryConfiguration(withIntlConfiguration(<AllCalendarView />))
      );
      expect(screen.getByText('All calendars')).toBeInTheDocument();
    });
  });

  describe('correctly populates action menu', () => {
    beforeEach(() => {
      const mockUseDataRepository = useDataRepository;
      mockUseDataRepository.mockReturnValue({
        isLoaded: () => true,
        getCalendars: () => []
      });
    });

    it('renders action-menu buttons when menu is open', async () => {
      render(
        withHistoryConfiguration(withIntlConfiguration(<AllCalendarView />))
      );

      await userEvent.click(screen.getByRole('button'));
      const buttons = await screen.findAllByRole('button');
      expect(buttons).toHaveLength(3);
    });
  });
});
