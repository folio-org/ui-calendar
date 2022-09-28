import React from 'react';
import { render, screen } from '@testing-library/react';
import withIntlConfiguration from '../test/util/withIntlConfiguration';
import CreateEditCalendarLayer from './CreateEditCalendarLayer';

jest.mock('@folio/stripes-components/lib/Layer/Layer', () => {
  return jest.fn(({
    contentLabel,
    isOpen,
  }) => <div contentLabel={contentLabel} isOpen={isOpen}>Layer</div>);
});

jest.mock('@folio/stripes-components/lib/Loading/LoadingPane', () => {
  return <div>LoadingPane</div>;
});

describe('CreateEditCalendarLayer', () => {
  describe('renders a loading pane', () => {
    const dataRepository = {
      isLoaded: () => false
    };
    it('renders', () => {
      render(withIntlConfiguration(<CreateEditCalendarLayer dataRepository={dataRepository} />));
      expect(screen.getByText('Layer')).toBeInTheDocument();
    });
  });

  describe('should render CreateEditCalendarLayer', () => {
    it('should render CreateEditCalendarLayer', () => {
      const dataRepository = {
        isLoaded: () => true,
        initialValue: undefined
      };
      render(withIntlConfiguration(<CreateEditCalendarLayer dataRepository={dataRepository} />));
      expect(screen.getByText('Layer')).toBeInTheDocument();
    });
  });

  describe('should render CreateEditCalendarLayer', () => {
    it('should render CreateEditCalendarLayer', () => {
      const dataRepository = {
        isLoaded: () => true,
        initialValue: 'initialValue',
        isEdit: true
      };
      render(withIntlConfiguration(<CreateEditCalendarLayer dataRepository={dataRepository} />));
      expect(screen.getByText('Layer')).toBeInTheDocument();
    });
  });
  describe('should render CreateEditCalendarLayer', () => {
    it('should render CreateEditCalendarLayer', () => {
      const dataRepository = {
        isLoaded: () => true,
        initialValue: 'initialValue',
        isEdit: false
      };
      render(withIntlConfiguration(<CreateEditCalendarLayer dataRepository={dataRepository} />));
      expect(screen.getByText('Layer')).toBeInTheDocument();
    });
  });
});
