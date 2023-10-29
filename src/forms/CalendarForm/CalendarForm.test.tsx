import React from 'react';
import { render, screen } from '@testing-library/react';
import * as Calendars from '../../test/data/Calendars';
import withIntlConfiguration from '../../test/util/withIntlConfiguration';
import CreateCalendarForm from './CalendarForm';
import DataRepository from '../../data/DataRepository';
import * as ServicePoints from '../../test/data/ServicePoints';


// eslint-disable-next-line func-names
window.matchMedia = window.matchMedia || function () {
  return {
    matches: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    addListener() {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    removeListener() {}
  };
} as any;

const mutators = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  dates: jest.fn(),
};


describe('CreateCalendarForm', () => {
  describe('Creates Calendar Form', () => {
    const dataRepository = new DataRepository([Calendars.SPRING_SP_1_2], [ServicePoints.SERVICE_POINT_1_DTO], mutators);
    const closeParentLayer = jest.fn();
    const setIsSubmitting = jest.fn();
    const submitter = jest.fn();
    it('renders', () => {
      render(
        withIntlConfiguration(
          <CreateCalendarForm closeParentLayer={closeParentLayer} dataRepository={dataRepository} submitAttempted setIsSubmitting={setIsSubmitting} submitter={submitter} />
        )
      );
      expect(screen.getByText('Calendar name')).toBeInTheDocument();
    });
  });
});
