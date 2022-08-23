import { Calendar } from '../../../main/types/types';
import {
  ONLINE,
  SERVICE_POINT_1,
  SERVICE_POINT_2,
  SERVICE_POINT_3,
  SERVICE_POINT_4,
} from './ServicePoints';

export const SPRING_SP_1_2: Calendar = {
  id: 'd3f3354c-2986-5d31-a84c-1ef3fd613ac6',
  name: '2000 Spring Hours (1,2)',
  assignments: [SERVICE_POINT_1.id, SERVICE_POINT_2.id],
  startDate: '2000-01-01',
  endDate: '2000-04-30',
  normalHours: [],
  exceptions: [],
};

export const SPRING_SP_3_4: Calendar = {
  id: '25a5c12f-a29b-5128-9287-9e23823cc8fa',
  name: '2000 Spring Hours (3,4)',
  assignments: [SERVICE_POINT_3.id, SERVICE_POINT_4.id],
  startDate: '2000-01-01',
  endDate: '2000-04-30',
  normalHours: [],
  exceptions: [],
};

export const SPRING_UNASSIGNED: Calendar = {
  id: '4439ad8d-0ba9-55c8-955e-9255e1813ba7',
  name: '2000 Spring Hours (unassigned)',
  assignments: [],
  startDate: '2000-01-01',
  endDate: '2000-04-30',
  normalHours: [],
  exceptions: [],
};

export const ALL_YEAR_SP_ONLINE_247: Calendar = {
  id: 'a5e030ac-7381-531c-926c-4f18eb7ed18e',
  name: 'Online 24/7',
  assignments: [ONLINE.id],
  startDate: '2000-01-01',
  endDate: '2000-12-31',
  normalHours: [
    {
      startDay: 'MONDAY',
      startTime: '00:00',
      endDay: 'SUNDAY',
      endTime: '23:59',
    },
  ],
  exceptions: [],
};

export const SUMMER_SP_1_2: Calendar = {
  id: '1a741011-7ccf-585e-9762-93a63d130909',
  name: '2000 Summer Hours',
  assignments: [SERVICE_POINT_1.id, SERVICE_POINT_2.id],
  startDate: '2000-05-01',
  endDate: '2000-08-01',
  normalHours: [
    {
      startDay: 'SATURDAY',
      startTime: '09:00',
      endDay: 'SATURDAY',
      endTime: '20:00',
    },
    {
      startDay: 'MONDAY',
      startTime: '09:00',
      endDay: 'TUESDAY',
      endTime: '01:00',
    },
    {
      startDay: 'TUESDAY',
      startTime: '09:00',
      endDay: 'TUESDAY',
      endTime: '23:00',
    },
    {
      startDay: 'WEDNESDAY',
      startTime: '09:00',
      endDay: 'WEDNESDAY',
      endTime: '23:00',
    },
    {
      startDay: 'THURSDAY',
      startTime: '09:00',
      endDay: 'THURSDAY',
      endTime: '23:00',
    },
    {
      startDay: 'FRIDAY',
      startTime: '09:00',
      endDay: 'FRIDAY',
      endTime: '12:00',
    },
    {
      startDay: 'FRIDAY',
      startTime: '13:30',
      endDay: 'FRIDAY',
      endTime: '20:00',
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
};

export const SUMMER_SP_3: Calendar = {
  id: '4047ecea-bb24-5f76-9403-d44144c57b66',
  name: 'SP 3 Modified Construction Calendar',
  assignments: [SERVICE_POINT_3.id],
  startDate: '2000-05-01',
  endDate: '2000-06-30',
  normalHours: [
    {
      startDay: 'SUNDAY',
      startTime: '09:00',
      endDay: 'SUNDAY',
      endTime: '20:00',
    },
    {
      startDay: 'MONDAY',
      startTime: '09:00',
      endDay: 'TUESDAY',
      endTime: '01:00',
    },
    {
      startDay: 'TUESDAY',
      startTime: '09:00',
      endDay: 'TUESDAY',
      endTime: '23:00',
    },
    {
      startDay: 'WEDNESDAY',
      startTime: '09:00',
      endDay: 'WEDNESDAY',
      endTime: '23:00',
    },
    {
      startDay: 'THURSDAY',
      startTime: '09:00',
      endDay: 'THURSDAY',
      endTime: '23:00',
    },
    {
      startDay: 'FRIDAY',
      startTime: '09:00',
      endDay: 'FRIDAY',
      endTime: '12:00',
    },
    {
      startDay: 'FRIDAY',
      startTime: '13:30',
      endDay: 'FRIDAY',
      endTime: '20:00',
    },
    {
      startDay: 'SATURDAY',
      startTime: '09:00',
      endDay: 'SATURDAY',
      endTime: '20:00',
    },
  ],
  exceptions: [
    {
      name: 'Remodeling',
      startDate: '2000-05-08',
      endDate: '2000-05-20',
      openings: [],
    },
  ],
};

export const SUMMER_SP_4_245: Calendar = {
  id: '45970748-2d45-5fcb-9add-b59c12f20b6f',
  name: '24/5 Summer Calendar (4)',
  assignments: [SERVICE_POINT_4.id],
  startDate: '2000-05-01',
  endDate: '2000-08-01',
  normalHours: [
    {
      startDay: 'SUNDAY',
      startTime: '09:00',
      endDay: 'FRIDAY',
      endTime: '20:00',
    },
    {
      startDay: 'SATURDAY',
      startTime: '09:00',
      endDay: 'SATURDAY',
      endTime: '20:00',
    },
  ],
  exceptions: [],
};
