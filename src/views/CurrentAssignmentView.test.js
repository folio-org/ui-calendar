import React from 'react';
import { render, screen } from '@testing-library/react';
import '../test/__mocks__/matchMedia.mock';
import useDataRepository from '../data/useDataRepository';
import withIntlConfiguration from '../test/util/withIntlConfiguration';
import withHistoryConfiguration from '../test/util/withHistoryConfiguration';
import CurrentAssignmentView, { getPageTitle } from './CurrentAssignmentView';

jest.mock('../data/useDataRepository');

describe('CurrentAssignmentView', () => {
  describe('renders a loading pane', () => {
    beforeEach(() => {
      const mockUseDataRepository = useDataRepository;
      mockUseDataRepository.mockReturnValue({
        isLoaded: () => false,
      });
    });

    it('renders', () => {
      render(withHistoryConfiguration(withIntlConfiguration(<CurrentAssignmentView />)));
      expect(screen.getByText('Current calendar assignments')).toBeInTheDocument();
    });
  });

  describe('should render CurrentAssignmentView', () => {
    beforeEach(() => {
      const mockUseDataRepository = useDataRepository;
      mockUseDataRepository.mockReturnValue({
        isLoaded: () => true,
        getCalendar: () => [],
        getServicePoints: () => [],
      });
    });
    it('renders', () => {
      render(withHistoryConfiguration(withIntlConfiguration(<CurrentAssignmentView />)));
      expect(screen.getByText('Current calendar assignments')).toBeInTheDocument();
    });
  });

  it('has a title with the correct information', () => {
    expect(getPageTitle({ formatMessage: () => 'test' }, undefined)).toBe('test - test');
    expect(getPageTitle({ formatMessage: () => 'test' }, { name: 'calendar name' })).toBe(
      'test - test - calendar name',
    );
  });
});
