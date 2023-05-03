import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import DataRepository from '../../data/DataRepository';
import * as Calendars from '../../test/data/Calendars';
import * as ServicePoints from '../../test/data/ServicePoints';
import withIntlConfiguration from '../../test/util/withIntlConfiguration';
import CalendarFormWrapper, { FORM_ID } from './CalendarFormWrapper';

// eslint-disable-next-line func-names
window.matchMedia =
  window.matchMedia ||
  ((() => {
    return {
      matches: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      addListener() {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      removeListener() {},
    };
  }) as any);

const mutators = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  dates: jest.fn(),
  getUser: jest.fn(),
};

describe('CalendarFormWrapper', () => {
  describe('Creates Calendar Form', () => {
    const dataRepository = new DataRepository(
      [Calendars.SPRING_SP_1_2],
      [ServicePoints.SERVICE_POINT_1_DTO],
      mutators
    );
    const closeParentLayer = jest.fn();
    const setIsSubmitting = jest.fn();
    const submitter = jest.fn();

    it('renders', async () => {
      render(
        withIntlConfiguration(
          <MemoryRouter>
            <CalendarFormWrapper
              closeParentLayer={closeParentLayer}
              dataRepository={dataRepository}
              setIsSubmitting={setIsSubmitting}
              submitter={submitter}
              initialValues={Calendars.SPRING_SP_1_2}
            />
            <button type="submit" form={FORM_ID}>
              submitter
            </button>
          </MemoryRouter>
        )
      );
      expect(screen.getByText('Calendar name')).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: 'submitter' }));
      expect(submitter).toHaveBeenCalled();
    });
  });
});
