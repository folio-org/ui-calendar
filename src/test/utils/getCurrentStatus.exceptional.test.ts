import "@testing-library/jest-dom";
import { render as _render } from "@testing-library/react";
import dayjs from "dayjs";
import { ReactNode } from "react";
import { IntlShape } from "react-intl";
import { Calendar } from "../../main/types/types";
import getCurrentStatus, {
  getCurrentStatusNonFormatted,
} from "../../main/utils/getCurrentStatus";
import { LocaleWeekdayInfo } from "../../main/utils/WeekdayUtils";
import * as Calendars from "../config/data/Calendars";
import * as Dates from "../config/data/Dates";
import * as Weekdays from "../config/data/Weekdays";
import withIntlConfiguration from "../config/util/withIntlConfiguration";

const intl = {
  formatTime: jest.fn((t) => `||${dayjs(t).utc(false).format("HH:mm")}||`),
  formatDate: jest.fn((d) => `||${dayjs(d).utc(false).format("YYYY-MM-DD")}||`),
  formatMessage: jest.fn((m) => m.id),
} as unknown as IntlShape;

const localeWeekdays: LocaleWeekdayInfo[] = [
  { weekday: Weekdays.Sunday, short: "XXXXX", long: "||Sunday||" },
  { weekday: Weekdays.Monday, short: "XXXXX", long: "||Monday||" },
  { weekday: Weekdays.Tuesday, short: "XXXXX", long: "||Tuesday||" },
  { weekday: Weekdays.Wednesday, short: "XXXXX", long: "||Wednesday||" },
  { weekday: Weekdays.Thursday, short: "XXXXX", long: "||Thursday||" },
  { weekday: Weekdays.Friday, short: "XXXXX", long: "||Friday||" },
  { weekday: Weekdays.Saturday, short: "XXXXX", long: "||Saturday||" },
];

const calendarTemplate: Calendar = {
  id: "00000000-0000-0000-0000-000000000000",
  name: "Sample calendar",
  assignments: [],
  startDate: "2000-01-01",
  endDate: "2000-12-31",
  normalHours: [],
  exceptions: [],
};

function render(el: ReactNode): HTMLElement {
  return _render(withIntlConfiguration(el)).container;
}

test("Closed exceptions return as such", () => {
  expect(
    getCurrentStatusNonFormatted(intl, Dates.JUN_1, Calendars.SUMMER_SP_1_2)
  ).toStrictEqual({
    open: false,
    exceptional: true,
    exceptionName: "Sample Holiday",
  });
  expect(
    render(
      getCurrentStatus(
        intl,
        localeWeekdays,
        Dates.JUN_1,
        Calendars.SUMMER_SP_1_2
      )
    ).textContent
  ).toBe("Closed (Sample Holiday)");
});

test("Opening exception closing more than week from now returns appropriate status", () => {
  // closing a long time away
  const closingLongAwayCalendar: Calendar = {
    ...calendarTemplate,
    exceptions: [
      {
        name: "Sample exception",
        startDate: "2000-05-01",
        endDate: "2000-05-31",
        openings: [
          {
            startDate: "2000-05-01",
            startTime: "00:00",
            endDate: "2000-05-31",
            endTime: "22:00",
          },
        ],
      },
    ],
  };
  expect(
    getCurrentStatusNonFormatted(intl, Dates.MAY_14, closingLongAwayCalendar)
  ).toStrictEqual({
    open: true,
    exceptional: true,
    exceptionName: "Sample exception",
    nextEvent: {
      date: "||2000-05-31||",
      proximity: "sameElse",
      time: "||22:00||",
      weekday: Weekdays.Wednesday,
    },
  });
  expect(
    render(
      getCurrentStatus(
        intl,
        localeWeekdays,
        Dates.MAY_14,
        closingLongAwayCalendar
      )
    ).textContent
  ).toBe("Open (Sample exception) until ||2000-05-31|| at ||22:00||");
});

test("Opening exception closing next week returns appropriate status", () => {
  // closing within the next week
  const closingNextWeekCalendar: Calendar = {
    ...calendarTemplate,
    exceptions: [
      {
        name: "Sample exception",
        startDate: "2000-05-01",
        endDate: "2000-05-31",
        openings: [
          {
            startDate: "2000-05-01",
            startTime: "00:00",
            endDate: "2000-05-19",
            endTime: "22:00",
          },
        ],
      },
    ],
  };
  expect(
    getCurrentStatusNonFormatted(intl, Dates.MAY_14, closingNextWeekCalendar)
  ).toStrictEqual({
    open: true,
    exceptional: true,
    exceptionName: "Sample exception",
    nextEvent: {
      date: "||2000-05-19||",
      proximity: "nextWeek",
      time: "||22:00||",
      weekday: Weekdays.Friday,
    },
  });
  expect(
    render(
      getCurrentStatus(
        intl,
        localeWeekdays,
        Dates.MAY_14,
        closingNextWeekCalendar
      )
    ).textContent
  ).toBe("Open (Sample exception) until ||Friday|| at ||22:00||");
});

test("Opening exception closing tomorrow returns appropriate status", () => {
  // closing tomorrow
  const closingTomorrowCalendar: Calendar = {
    ...calendarTemplate,
    exceptions: [
      {
        name: "Sample exception",
        startDate: "2000-05-01",
        endDate: "2000-05-31",
        openings: [
          {
            startDate: "2000-05-01",
            startTime: "00:00",
            endDate: "2000-05-15",
            endTime: "22:00",
          },
        ],
      },
    ],
  };
  expect(
    getCurrentStatusNonFormatted(intl, Dates.MAY_14, closingTomorrowCalendar)
  ).toStrictEqual({
    open: true,
    exceptional: true,
    exceptionName: "Sample exception",
    nextEvent: {
      date: "||2000-05-15||",
      proximity: "nextDay",
      time: "||22:00||",
      weekday: Weekdays.Monday,
    },
  });
  expect(
    render(
      getCurrentStatus(
        intl,
        localeWeekdays,
        Dates.MAY_14,
        closingTomorrowCalendar
      )
    ).textContent
  ).toBe("Open (Sample exception) until tomorrow at ||22:00||");
});

test("Opening exception closing the same day returns appropriate status", () => {
  // closing tonight
  const closingTonightCalendar: Calendar = {
    ...calendarTemplate,
    exceptions: [
      {
        name: "Sample exception",
        startDate: "2000-05-01",
        endDate: "2000-05-31",
        openings: [
          {
            startDate: "2000-05-01",
            startTime: "00:00",
            endDate: "2000-05-14",
            endTime: "22:00",
          },
        ],
      },
    ],
  };
  expect(
    getCurrentStatusNonFormatted(intl, Dates.MAY_14, closingTonightCalendar)
  ).toStrictEqual({
    open: true,
    exceptional: true,
    exceptionName: "Sample exception",
    nextEvent: {
      date: "||2000-05-14||",
      proximity: "sameDay",
      time: "||22:00||",
      weekday: Weekdays.Sunday,
    },
  });
  expect(
    render(
      getCurrentStatus(
        intl,
        localeWeekdays,
        Dates.MAY_14,
        closingTonightCalendar
      )
    ).textContent
  ).toBe("Open (Sample exception) until ||22:00||");
});

test("Open exceptions with no more openings return closed with no next", () => {
  const closedHereafter: Calendar = {
    ...calendarTemplate,
    exceptions: [
      {
        name: "Sample exception",
        startDate: "2000-05-01",
        endDate: "2000-12-31",
        openings: [
          {
            startDate: "2000-05-01",
            startTime: "00:00",
            endDate: "2000-05-14",
            endTime: "22:00",
          },
        ],
      },
    ],
  };
  expect(
    getCurrentStatusNonFormatted(intl, Dates.JUN_1, closedHereafter)
  ).toStrictEqual({
    open: false,
    exceptional: true,
    exceptionName: "Sample exception",
  });
  expect(
    render(getCurrentStatus(intl, localeWeekdays, Dates.JUN_1, closedHereafter))
      .textContent
  ).toBe("Closed (Sample exception)");
});

test("Closed exception opening more than week from now returns appropriate status", () => {
  // closing a long time away
  const openingLongAwayCalendar: Calendar = {
    ...calendarTemplate,
    exceptions: [
      {
        name: "Sample exception",
        startDate: "2000-05-01",
        endDate: "2000-05-31",
        openings: [
          {
            startDate: "2000-05-14",
            startTime: "02:00",
            endDate: "2000-05-31",
            endTime: "22:00",
          },
        ],
      },
    ],
  };
  expect(
    getCurrentStatusNonFormatted(intl, Dates.MAY_1, openingLongAwayCalendar)
  ).toStrictEqual({
    open: false,
    exceptional: true,
    exceptionName: "Sample exception",
    nextEvent: {
      date: "||2000-05-14||",
      proximity: "sameElse",
      time: "||02:00||",
      weekday: Weekdays.Sunday,
    },
  });
  expect(
    render(
      getCurrentStatus(
        intl,
        localeWeekdays,
        Dates.MAY_1,
        openingLongAwayCalendar
      )
    ).textContent
  ).toBe("Closed (Sample exception) until ||2000-05-14|| at ||02:00||");
});

test("Closed exception opening next week returns appropriate status", () => {
  // closing within the next week
  const openingNextWeekCalendar: Calendar = {
    ...calendarTemplate,
    exceptions: [
      {
        name: "Sample exception",
        startDate: "2000-05-01",
        endDate: "2000-05-31",
        openings: [
          {
            startDate: "2000-05-05",
            startTime: "02:00",
            endDate: "2000-05-19",
            endTime: "22:00",
          },
        ],
      },
    ],
  };
  expect(
    getCurrentStatusNonFormatted(intl, Dates.MAY_1, openingNextWeekCalendar)
  ).toStrictEqual({
    open: false,
    exceptional: true,
    exceptionName: "Sample exception",
    nextEvent: {
      date: "||2000-05-05||",
      proximity: "nextWeek",
      time: "||02:00||",
      weekday: Weekdays.Friday,
    },
  });
  expect(
    render(
      getCurrentStatus(
        intl,
        localeWeekdays,
        Dates.MAY_1,
        openingNextWeekCalendar
      )
    ).textContent
  ).toBe("Closed (Sample exception) until ||Friday|| at ||02:00||");
});

test("Closed exception opening tomorrow returns appropriate status", () => {
  // closing tomorrow
  const openingTomorrowCalendar: Calendar = {
    ...calendarTemplate,
    exceptions: [
      {
        name: "Sample exception",
        startDate: "2000-05-01",
        endDate: "2000-05-31",
        openings: [
          {
            startDate: "2000-05-02",
            startTime: "02:00",
            endDate: "2000-05-15",
            endTime: "22:00",
          },
        ],
      },
    ],
  };
  expect(
    getCurrentStatusNonFormatted(intl, Dates.MAY_1, openingTomorrowCalendar)
  ).toStrictEqual({
    open: false,
    exceptional: true,
    exceptionName: "Sample exception",
    nextEvent: {
      date: "||2000-05-02||",
      proximity: "nextDay",
      time: "||02:00||",
      weekday: Weekdays.Tuesday,
    },
  });
  expect(
    render(
      getCurrentStatus(
        intl,
        localeWeekdays,
        Dates.MAY_1,
        openingTomorrowCalendar
      )
    ).textContent
  ).toBe("Closed (Sample exception) until tomorrow at ||02:00||");
});

test("Closed exception opening the same day returns appropriate status", () => {
  // closing tonight
  const openingTonightCalendar: Calendar = {
    ...calendarTemplate,
    exceptions: [
      {
        name: "Sample exception",
        startDate: "2000-05-01",
        endDate: "2000-05-31",
        openings: [
          {
            startDate: "2000-05-01",
            startTime: "02:00",
            endDate: "2000-05-14",
            endTime: "22:00",
          },
        ],
      },
    ],
  };
  expect(
    getCurrentStatusNonFormatted(intl, Dates.MAY_1, openingTonightCalendar)
  ).toStrictEqual({
    open: false,
    exceptional: true,
    exceptionName: "Sample exception",
    nextEvent: {
      date: "||2000-05-01||",
      proximity: "sameDay",
      time: "||02:00||",
      weekday: Weekdays.Monday,
    },
  });
  expect(
    render(
      getCurrentStatus(
        intl,
        localeWeekdays,
        Dates.MAY_1,
        openingTonightCalendar
      )
    ).textContent
  ).toBe("Closed (Sample exception) until ||02:00||");
});
