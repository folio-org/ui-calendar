import dayjs from "dayjs";
import devHelper from "dayjs/plugin/devHelper";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

export const MOCKED_DATE = "2022-05-17";
export const MOCKED_DATE_OBJ = dayjs
  .extend(isSameOrAfter)
  .extend(isSameOrBefore)
  .extend(isBetween)(/* .extend(devHelper) */ MOCKED_DATE);
export const MOCKED_DATE_TIME = "2022-05-17 02:01:00";
export const MOCKED_DATE_TIME_OBJ = dayjs
  .extend(isSameOrAfter)
  .extend(isSameOrBefore)
  .extend(isBetween)(/* .extend(devHelper) */ MOCKED_DATE_TIME);

export const SERVICE_POINT_LIST = [
  { label: "Service point 1", inactive: false },
  { label: "Service point 2", inactive: true },
  { label: "Service point 3", inactive: false },
  { label: "Service point 4", inactive: false },
  { label: "Service point 5", inactive: false },
  { label: "Online", inactive: false },
];

export const CALENDARS = [
  {
    servicePoints: ["Service point 1", "Service point 3"],
    name: "2022 Spring Hours (1,3)",
    startDate: "2022-01-01",
    endDate: "2022-04-30",
    openings: [],
    exceptions: [],
  },
  {
    servicePoints: ["Online"],
    name: "Online 24/7",
    startDate: "2022-01-01",
    endDate: "2022-12-31",
    openings: [
      {
        startDay: "MONDAY",
        startTime: "08:00",
        endDay: "MONDAY",
        endTime: "07:59",
      },
    ],
    exceptions: [],
  },
  {
    servicePoints: ["Service point 4", "Service point 5 (overnight)"],
    name: "2022 Spring Hours (4,5)",
    startDate: "2022-01-01",
    endDate: "2022-04-30",
    openings: [],
    exceptions: [],
  },
  {
    servicePoints: ["Service point 1", "Service point 3"],
    name: "2022 Summer Hours",
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
    servicePoints: ["Service point 4"],
    name: "SP 4 Modified Construction Calendar",
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
    servicePoints: ["Service point 5"],
    name: "24-Hour Summer Calendar",
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
