import { FormApi } from 'final-form';
import RowType from '../../components/fields/RowType';
import DataRepository from '../../data/DataRepository';
import * as Calendars from '../../test/data/Calendars';
import ServicePoints from '../../test/data/ServicePoints';
import * as Weekdays from '../../test/data/Weekdays';
import getIntl from '../../test/util/getIntl';
import { Calendar } from '../../types/types';
import calendarToInitialValues from '../calendarToInitialValues';
import onSubmit from './onSubmit';
import { FormValues } from './types';

const intl = getIntl();

const dataRepository = new DataRepository(
  {
    servicePoints: {
      records: ServicePoints,
      failed: false,
      hasLoaded: true,
      isPending: false,
      pendingMutations: [],
      successfulMutations: [],
    },
    calendars: {
      records: [],
      failed: false,
      hasLoaded: true,
      isPending: false,
      pendingMutations: [],
      successfulMutations: [],
    },
    dates: {
      records: [],
      failed: false,
      hasLoaded: true,
      isPending: false,
      pendingMutations: [],
      successfulMutations: [],
    },
  },
  {
    servicePoints: {
      cancel: jest.fn(),
      GET: jest.fn(),
      POST: jest.fn(),
      PUT: jest.fn(),
      DELETE: jest.fn(),
    },
    calendars: {
      cancel: jest.fn(),
      GET: jest.fn(),
      POST: jest.fn(),
      PUT: jest.fn(),
      DELETE: jest.fn(),
    },
    dates: {
      cancel: jest.fn(),
      GET: jest.fn(),
      POST: jest.fn(),
      PUT: jest.fn(),
      DELETE: jest.fn(),
    },
  }
);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const closeParentLayer = jest.fn((_redirectId?: string) => ({}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const setIsSubmitting = jest.fn((_isSubmitting: boolean) => ({}));
const submitter = jest.fn(
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  (_calendar: Calendar) => new Promise<Calendar>(() => ({}))
);

const calloutContext = {
  sendCallout: jest.fn(),
};

const validFormState = {
  getState: jest.fn(() => ({ hasValidationErrors: false })),
} as unknown as FormApi<FormValues>;
const invalidFormState = {
  getState: jest.fn(() => ({ hasValidationErrors: true })),
} as unknown as FormApi<FormValues>;

function resetMocks() {
  calloutContext.sendCallout.mockReset();
  closeParentLayer.mockReset();
  setIsSubmitting.mockReset();
  submitter.mockReset();
}

test.skip('Invalid form results in nothing happening', async () => {
  resetMocks();
  expect(
    await onSubmit(
      {
        closeParentLayer,
        dataRepository,
        setIsSubmitting,
        submitter,
      },
      calloutContext,
      intl,
      calendarToInitialValues(
        dataRepository,
        Calendars.SUMMER_SP_1_2
      ) as FormValues,
      invalidFormState
    )
  ).toBeUndefined();
  expect(submitter.mock.calls.length).toBe(0);
  expect(setIsSubmitting.mock.calls.length).toBe(0);
  expect(closeParentLayer.mock.calls.length).toBe(0);
  expect(calloutContext.sendCallout.mock.calls.length).toBe(0);
});

test.skip('Proper conversion of an empty calendar', async () => {
  resetMocks();
  submitter.mockReturnValue(Promise.resolve({ id: 'test-id' } as Calendar));
  expect(
    await onSubmit(
      {
        closeParentLayer,
        dataRepository,
        setIsSubmitting,
        submitter,
      },
      calloutContext,
      intl,
      {
        name: 'Foo',
        'start-date': '2000-01-01',
        'end-date': '2000-01-31',
        'service-points': [],
        'hours-of-operation': [],
        exceptions: [],
      },
      validFormState
    )
  ).toStrictEqual({});
  expect(submitter.mock.calls.length).toBe(1);
  expect(submitter.mock.calls[0][0]).toStrictEqual({
    id: null,
    name: 'Foo',
    startDate: '2000-01-01',
    endDate: '2000-01-31',
    assignments: [],
    normalHours: [],
    exceptions: [],
  });
  expect(setIsSubmitting.mock.calls.length).toBe(2);
  expect(setIsSubmitting.mock.calls[0][0]).toBe(true);
  expect(setIsSubmitting.mock.calls[1][0]).toBe(false);
  expect(closeParentLayer.mock.calls.length).toBe(1);
  expect(closeParentLayer.mock.calls[0][0]).toBe('test-id');
  expect(calloutContext.sendCallout.mock.calls.length).toBe(0);
});

test.skip('Proper conversion of an undefined empty calendar', async () => {
  resetMocks();
  submitter.mockReturnValue(Promise.resolve({ id: 'test-id' } as Calendar));
  expect(
    await onSubmit(
      {
        closeParentLayer,
        dataRepository,
        setIsSubmitting,
        submitter,
      },
      calloutContext,
      intl,
      {
        name: 'Foo',
        'start-date': '2000-01-01',
        'end-date': '2000-01-31',
      },
      validFormState
    )
  ).toStrictEqual({});
  expect(submitter.mock.calls.length).toBe(1);
  expect(submitter.mock.calls[0][0]).toStrictEqual({
    id: null,
    name: 'Foo',
    startDate: '2000-01-01',
    endDate: '2000-01-31',
    assignments: [],
    normalHours: [],
    exceptions: [],
  });
  expect(setIsSubmitting.mock.calls.length).toBe(2);
  expect(setIsSubmitting.mock.calls[0][0]).toBe(true);
  expect(setIsSubmitting.mock.calls[1][0]).toBe(false);
  expect(closeParentLayer.mock.calls.length).toBe(1);
  expect(closeParentLayer.mock.calls[0][0]).toBe('test-id');
  expect(calloutContext.sendCallout.mock.calls.length).toBe(0);
});

test.skip('Proper conversion of a complex calendar', async () => {
  resetMocks();
  submitter.mockReturnValue(
    Promise.resolve({ id: 'test-id-complex' } as Calendar)
  );
  expect(
    await onSubmit(
      {
        closeParentLayer,
        dataRepository,
        setIsSubmitting,
        submitter,
      },
      calloutContext,
      intl,
      {
        name: 'Longer test name',
        'start-date': '2000-01-01',
        'end-date': '2000-12-31',
        'service-points': dataRepository.getServicePoints(),
        'hours-of-operation': [
          {
            i: 0,
            type: RowType.Open,
            startDay: Weekdays.Monday,
            startTime: '02:00',
            endDay: Weekdays.Wednesday,
            endTime: '15:00',
          },
          {
            i: 1,
            type: RowType.Open,
            startDay: Weekdays.Wednesday,
            startTime: '17:00',
            endDay: Weekdays.Friday,
            endTime: '23:00',
          },
          {
            i: 2,
            type: RowType.Closed,
            startDay: Weekdays.Saturday,
            startTime: undefined,
            endDay: Weekdays.Saturday,
            endTime: undefined,
          },
        ],
        exceptions: [
          {
            i: 0,
            lastRowI: 0,
            type: RowType.Closed,
            name: 'Sample Holiday',
            rows: [
              {
                i: 0,
                startDate: '2000-06-01',
                startTime: undefined,
                endDate: '2000-06-01',
                endTime: undefined,
              },
            ],
          },
          {
            i: 0,
            lastRowI: 2,
            type: RowType.Open,
            name: 'Community Event (Longer Hours)',
            rows: [
              {
                i: 0,
                startDate: '2000-05-13',
                startTime: '07:00',
                endDate: '2000-05-13',
                endTime: '23:59',
              },
              {
                i: 1,
                startDate: '2000-05-14',
                startTime: '05:00',
                endDate: '2000-05-14',
                endTime: '21:59',
              },
              {
                i: 2,
                startDate: '2000-05-15',
                startTime: '06:00',
                endDate: '2000-05-15',
                endTime: '22:59',
              },
            ],
          },
        ],
      },
      validFormState
    )
  ).toStrictEqual({});
  expect(submitter.mock.calls.length).toBe(1);
  expect(submitter.mock.calls[0][0]).toStrictEqual({
    id: null,
    name: 'Longer test name',
    startDate: '2000-01-01',
    endDate: '2000-12-31',
    assignments: dataRepository.getServicePoints().map((sp) => sp.id),
    normalHours: [
      {
        startDay: Weekdays.Monday,
        startTime: '02:00',
        endDay: Weekdays.Wednesday,
        endTime: '15:00',
      },
      {
        startDay: Weekdays.Wednesday,
        startTime: '17:00',
        endDay: Weekdays.Friday,
        endTime: '23:00',
      },
    ],
    exceptions: [
      {
        name: 'Sample Holiday',
        startDate: '2000-06-01',
        endDate: '2000-06-01',
        openings: [],
      },
      {
        name: 'Community Event (Longer Hours)',
        startDate: '2000-05-13',
        endDate: '2000-05-15',
        openings: [
          {
            startDate: '2000-05-13',
            startTime: '07:00',
            endDate: '2000-05-13',
            endTime: '23:59',
          },
          {
            startDate: '2000-05-14',
            startTime: '05:00',
            endDate: '2000-05-14',
            endTime: '21:59',
          },
          {
            startDate: '2000-05-15',
            startTime: '06:00',
            endDate: '2000-05-15',
            endTime: '22:59',
          },
        ],
      },
    ],
  });
  expect(setIsSubmitting.mock.calls.length).toBe(2);
  expect(setIsSubmitting.mock.calls[0][0]).toBe(true);
  expect(setIsSubmitting.mock.calls[1][0]).toBe(false);
  expect(closeParentLayer.mock.calls.length).toBe(1);
  expect(closeParentLayer.mock.calls[0][0]).toBe('test-id-complex');
  expect(calloutContext.sendCallout.mock.calls.length).toBe(0);
});

// test.skip('Proper error display for a date overlap', async () => {
//   resetMocks();
//   submitter.mockReturnValue(
//     // eslint-disable-next-line prefer-promise-reject-errors
//     Promise.reject({
//       json: () =>
//         <ErrorResponse>{
//           timestamp: '',
//           status: 409,
//           errors: [],
//         },
//     })
//   );
//   expect(
//     await onSubmit(
//       {
//         closeParentLayer,
//         dataRepository,
//         setIsSubmitting,
//         submitter,
//       },
//       calloutContext,
//       intl,
//       calendarToInitialValues(
//         dataRepository,
//         Calendars.SUMMER_SP_1_2
//       ) as FormValues,
//       validFormState
//     )
//   ).toHaveProperty('service-points');
//   expect(setIsSubmitting.mock.calls.length).toBe(2);
//   expect(setIsSubmitting.mock.calls[0][0]).toBe(true);
//   expect(setIsSubmitting.mock.calls[1][0]).toBe(false);
//   expect(closeParentLayer.mock.calls.length).toBe(1);
//   expect(closeParentLayer.mock.calls[0][0]).toBe('test-id');
//   expect(calloutContext.sendCallout.mock.calls.length).toBe(0);
// });
