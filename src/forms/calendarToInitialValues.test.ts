import DataRepository from '../data/DataRepository';
import * as ServicePoints from '../test/data/ServicePoints';
import * as Calendars from '../test/data/Calendars';
import * as Weekdays from '../test/data/Weekdays';
import calendarToInitialValues from './calendarToInitialValues';
import { FormValues } from './CalendarForm/types';
import RowType from '../components/fields/RowType';

describe('calendar to initial form values conversion', () => {
  test('Undefined calendar results in no form values', () => {
    expect(calendarToInitialValues({} as DataRepository)).toStrictEqual({});
  });

  test('Calendar is properly converted', () => {
    const conversion = calendarToInitialValues(
      new DataRepository(
        [],
        [ServicePoints.SERVICE_POINT_1_DTO, ServicePoints.SERVICE_POINT_2_DTO],
        {} as any,
      ),
      Calendars.SUMMER_SP_1_2,
    );

    expect(conversion).toStrictEqual<FormValues>({
      name: '2000 Summer Hours',
      'start-date': '2000-05-01',
      'end-date': '2000-08-01',
      'service-points': [ServicePoints.SERVICE_POINT_1, ServicePoints.SERVICE_POINT_2],
      'hours-of-operation': [
        {
          i: -1,
          type: RowType.Open,
          startDay: Weekdays.Saturday,
          startTime: ['09:00:00Z', null],
          endDay: Weekdays.Saturday,
          endTime: ['20:00:00Z', null],
        },
        {
          i: -2,
          type: RowType.Open,
          startDay: Weekdays.Monday,
          startTime: ['09:00:00Z', null],
          endDay: Weekdays.Tuesday,
          endTime: ['01:00:00Z', null],
        },
        {
          i: -3,
          type: RowType.Open,
          startDay: Weekdays.Tuesday,
          startTime: ['09:00:00Z', null],
          endDay: Weekdays.Tuesday,
          endTime: ['23:00:00Z', null],
        },
        {
          i: -4,
          type: RowType.Open,
          startDay: Weekdays.Wednesday,
          startTime: ['09:00:00Z', null],
          endDay: Weekdays.Wednesday,
          endTime: ['23:00:00Z', null],
        },
        {
          i: -5,
          type: RowType.Open,
          startDay: Weekdays.Thursday,
          startTime: ['09:00:00Z', null],
          endDay: Weekdays.Thursday,
          endTime: ['23:00:00Z', null],
        },
        {
          i: -6,
          type: RowType.Open,
          startDay: Weekdays.Friday,
          startTime: ['09:00:00Z', null],
          endDay: Weekdays.Friday,
          endTime: ['12:00:00Z', null],
        },
        {
          i: -7,
          type: RowType.Open,
          startDay: Weekdays.Friday,
          startTime: ['13:30:00Z', null],
          endDay: Weekdays.Friday,
          endTime: ['20:00:00Z', null],
        },
      ],
      exceptions: [
        {
          i: -1,
          lastRowI: 0,
          name: 'Sample Holiday',
          type: RowType.Closed,
          rows: [
            {
              i: -1,
              startDate: '2000-06-01',
              startTime: undefined,
              endDate: '2000-06-01',
              endTime: undefined,
            },
          ],
        },
        {
          i: -2,
          lastRowI: 0,
          name: 'Community Event (Longer Hours)',
          type: RowType.Open,
          rows: [
            {
              i: -1,
              startDate: '2000-05-13',
              startTime: ['07:00:00Z', null],
              endDate: '2000-05-13',
              endTime: ['23:59:00Z', null],
            },
            {
              i: -2,
              startDate: '2000-05-14',
              startTime: ['05:00:00Z', null],
              endDate: '2000-05-14',
              endTime: ['21:59:00Z', null],
            },
            {
              i: -3,
              startDate: '2000-05-15',
              startTime: ['06:00:00Z', null],
              endDate: '2000-05-15',
              endTime: ['22:59:00Z', null],
            },
          ],
        },
      ],
    });
  });
});
