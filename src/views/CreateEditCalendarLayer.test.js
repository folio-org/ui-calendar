import React from 'react';
import { render, screen } from '@testing-library/react';
import withIntlConfiguration from '../test/util/withIntlConfiguration';
import CreateEditCalendarLayer, { getOpType } from './CreateEditCalendarLayer';
import * as Calendars from '../test/data/Calendars';


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


test('GetOpType works', () => {
  expect(getOpType(undefined, true)).toBe(0);
  expect(getOpType(Calendars.SPRING_SP_1_2, true)).toBe(1);
  expect(getOpType(Calendars.SPRING_SP_1_2, false)).toBe(2);
});
