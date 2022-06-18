import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { Calendar, ServicePoint } from "../types/types";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);

export const MOCKED_DATE = "2022-05-17";
export const MOCKED_DATE_OBJ = dayjs(MOCKED_DATE);
export const MOCKED_DATE_TIME = "2022-05-17 02:01:00";
export const MOCKED_DATE_TIME_OBJ = dayjs(MOCKED_DATE_TIME);

export const SERVICE_POINT_LIST: ServicePoint[] = [
  {
    id: "43194c57-5af8-5626-b4e5-e2ba9fa2d9a4",
    name: "3a40852d-49fd-4df2-a1f9-6e2641a6e91f",
    inactive: false,
  },
  {
    id: "60869fc6-10ee-53a4-9861-118b61bf4544",
    name: "Service point 2",
    inactive: true,
  },
  {
    id: "3b071ddf-14ad-58a1-9fb5-b3737da888de",
    name: "3b071ddf-14ad-58a1-9fb5-b3737da888de",
    inactive: false,
  },
  {
    id: "c085c999-3600-5e06-a758-d052565f89fd",
    name: "c085c999-3600-5e06-a758-d052565f89fd",
    inactive: false,
  },
  {
    id: "7a5e720f-2dc2-523a-b77e-3c996578e241",
    name: "7a5e720f-2dc2-523a-b77e-3c996578e241",
    inactive: false,
  },
  {
    id: "db775bbc-6a0b-537b-877a-34b2fd68d6d7",
    name: "7c5abc9f-f3d7-4856-b8d7-6712462ca007",
    inactive: false,
  },
];

export const CALENDARS: Calendar[] = [
  {
    id: "d3f3354c-2986-5d31-a84c-1ef3fd613ac6",
    name: "2022 Spring Hours (1,3)",
    servicePoints: [
      "3a40852d-49fd-4df2-a1f9-6e2641a6e91f",
      "3b071ddf-14ad-58a1-9fb5-b3737da888de",
    ],
    startDate: "2022-01-01",
    endDate: "2022-04-30",
    openings: [],
    exceptions: [],
  },
  {
    id: "a5e030ac-7381-531c-926c-4f18eb7ed18e",
    name: "Online 24/7",
    servicePoints: ["7c5abc9f-f3d7-4856-b8d7-6712462ca007"],
    startDate: "2022-01-01",
    endDate: "2022-12-31",
    openings: [
      {
        startDay: "MONDAY",
        startTime: "00:00",
        endDay: "SUNDAY",
        endTime: "23:59",
      },
    ],
    exceptions: [],
  },
  {
    id: "25a5c12f-a29b-5128-9287-9e23823cc8fa",
    name: "2022 Spring Hours (4,5)",
    servicePoints: [
      "c085c999-3600-5e06-a758-d052565f89fd",
      "Service point 5 (overnight)",
    ],
    startDate: "2022-01-01",
    endDate: "2022-04-30",
    openings: [],
    exceptions: [],
  },
  {
    id: "1a741011-7ccf-585e-9762-93a63d130909",
    name: "2022 Summer Hours",
    servicePoints: [
      "3a40852d-49fd-4df2-a1f9-6e2641a6e91f",
      "3b071ddf-14ad-58a1-9fb5-b3737da888de",
    ],
    startDate: "2022-05-01",
    endDate: "2022-08-01",
    openings: [
      {
        startDay: "SATURDAY",
        startTime: "09:00",
        endDay: "SATURDAY",
        endTime: "20:00",
      },
      {
        startDay: "MONDAY",
        startTime: "09:00",
        endDay: "TUESDAY",
        endTime: "01:00",
      },
      {
        startDay: "TUESDAY",
        startTime: "09:00",
        endDay: "TUESDAY",
        endTime: "23:00",
      },
      {
        startDay: "WEDNESDAY",
        startTime: "09:00",
        endDay: "WEDNESDAY",
        endTime: "23:00",
      },
      {
        startDay: "THURSDAY",
        startTime: "09:00",
        endDay: "THURSDAY",
        endTime: "23:00",
      },
      {
        startDay: "FRIDAY",
        startTime: "09:00",
        endDay: "FRIDAY",
        endTime: "12:00",
      },
      {
        startDay: "FRIDAY",
        startTime: "13:30",
        endDay: "FRIDAY",
        endTime: "20:00",
      },
    ],
    exceptions: [
      {
        name: "Sample Holiday",
        startDate: "2022-06-01",
        endDate: "2022-06-01",
        openings: [],
      },
      {
        name: "Community Event (Longer Hours)",
        startDate: "2022-05-13",
        endDate: "2022-05-13",
        openings: [
          {
            startDate: "2022-05-13",
            startTime: "07:00",
            endDate: "2022-05-13",
            endTime: "23:59",
          },
        ],
      },
    ],
  },
  {
    id: "4047ecea-bb24-5f76-9403-d44144c57b66",
    name: "SP 4 Modified Construction Calendar",
    servicePoints: ["c085c999-3600-5e06-a758-d052565f89fd"],
    startDate: "2022-05-01",
    endDate: "2022-06-30",
    openings: [
      {
        startDay: "SUNDAY",
        startTime: "09:00",
        endDay: "SUNDAY",
        endTime: "20:00",
      },
      {
        startDay: "MONDAY",
        startTime: "09:00",
        endDay: "TUESDAY",
        endTime: "01:00",
      },
      {
        startDay: "TUESDAY",
        startTime: "09:00",
        endDay: "TUESDAY",
        endTime: "23:00",
      },
      {
        startDay: "WEDNESDAY",
        startTime: "09:00",
        endDay: "WEDNESDAY",
        endTime: "23:00",
      },
      {
        startDay: "THURSDAY",
        startTime: "09:00",
        endDay: "THURSDAY",
        endTime: "23:00",
      },
      {
        startDay: "FRIDAY",
        startTime: "09:00",
        endDay: "FRIDAY",
        endTime: "12:00",
      },
      {
        startDay: "FRIDAY",
        startTime: "13:30",
        endDay: "FRIDAY",
        endTime: "20:00",
      },
      {
        startDay: "SATURDAY",
        startTime: "09:00",
        endDay: "SATURDAY",
        endTime: "20:00",
      },
    ],
    exceptions: [
      {
        name: "Remodeling",
        startDate: "2022-05-08",
        endDate: "2022-05-20",
        openings: [],
      },
    ],
  },
  {
    id: "45970748-2d45-5fcb-9add-b59c12f20b6f",
    name: "24-Hour Summer Calendar",
    servicePoints: ["7a5e720f-2dc2-523a-b77e-3c996578e241"],
    startDate: "2022-05-01",
    endDate: "2022-08-01",
    openings: [
      {
        startDay: "SUNDAY",
        startTime: "09:00",
        endDay: "FRIDAY",
        endTime: "20:00",
      },
      {
        startDay: "SATURDAY",
        startTime: "09:00",
        endDay: "SATURDAY",
        endTime: "20:00",
      },
    ],
    exceptions: [],
  },
];
