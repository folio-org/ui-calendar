import React from 'react';
import { render, screen } from '@testing-library/react';
import '../test/__mocks__/matchMedia.mock';
import useDataRepository from '../data/useDataRepository';
import withIntlConfiguration from '../test/util/withIntlConfiguration';
import withHistoryConfiguration from '../test/util/withHistoryConfiguration';
import CurrentAssignmentView from './CurrentAssignmentView';

jest.mock('../data/useDataRepository');

describe('CurrentAssignmentView', () => {
  describe('renders a loading pane', () => {
    beforeEach(() => {
      const mockUseDataRepository = useDataRepository;
      mockUseDataRepository.mockReturnValue({
        isLoaded: () => false
      });
    });

    it('renders', () => {
      render(
        withHistoryConfiguration(withIntlConfiguration(<CurrentAssignmentView />))
      );
      expect(screen.getByText('Current calendar assignments')).toBeInTheDocument();
    });
  });

  describe('should render CurrentAssignmentView', () => {
    beforeEach(() => {
      const mockUseDataRepository = useDataRepository;
      mockUseDataRepository.mockReturnValue({
        isLoaded: () => true,
        getCalendars: () => [],
        getServicePoints: () => []
      });
    });
    it('renders', () => {
      render(withHistoryConfiguration(withIntlConfiguration(<CurrentAssignmentView />)));
      expect(screen.getByText('Current calendar assignments')).toBeInTheDocument();
    });
  });
});
