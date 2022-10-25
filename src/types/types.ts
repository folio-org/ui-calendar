export type Weekday =
  | 'SUNDAY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY';

export interface ServicePoint {
  id: string;
  name: string;
  inactive: boolean;
}

export interface CalendarOpening {
  startDay: Weekday;
  startTime: string;
  endDay: Weekday;
  endTime: string;
}

export interface CalendarExceptionOpening {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export interface CalendarException {
  name: string;
  startDate: string;
  endDate: string;
  openings: CalendarExceptionOpening[];
}

export interface Calendar {
  id: string | null;
  name: string;
  assignments: string[];
  startDate: string;
  endDate: string;
  normalHours: CalendarOpening[];
  exceptions: CalendarException[];
}

// in here as it is used in more places than just data transit
export interface CalendarDTO extends Calendar {
  id: string;
  metadata?: {
    createdDate?: string;
    createdByUserId?: string;
    updatedDate?: string;
    updatedByUserId?: string;
  };
}

export interface User {
  id: string;
  username: string;
  personal: {
    lastName: string;
    firstName?: string;
    middleName?: string;
    preferredFirstName?: string;
  };
}

export enum ErrorCode {
  INTERNAL_SERVER_ERROR = 'internalServerError',
  INVALID_REQUEST = 'invalidRequest',
  INVALID_PARAMETER = 'invalidParameter',
  CALENDAR_NO_NAME = 'calendarNoName',
  CALENDAR_INVALID_DATE_RANGE = 'calendarInvalidDateRange',
  CALENDAR_INVALID_EXCEPTION_NAME = 'calendarInvalidExceptionName',
  CALENDAR_INVALID_EXCEPTION_OPENINGS = 'calendarInvalidExceptionOpenings',
  CALENDAR_INVALID_EXCEPTION_OPENING_BOUNDARY = 'calendarInvalidExceptionOpeningBoundary',
  CALENDAR_DATE_OVERLAP = 'calendarDateOverlap',
  CALENDAR_NOT_FOUND = 'calendarNotFound',
  CALENDAR_INVALID_NORMAL_OPENINGS = 'calendarInvalidNormalOpenings',
  CALENDAR_INVALID_EXCEPTIONS = 'calendarInvalidExceptions',
  CALENDAR_INVALID_EXCEPTION_DATE_ORDER = 'calendarInvalidExceptionDateOrder',
  CALENDAR_INVALID_EXCEPTION_DATE_BOUNDARY = 'calendarInvalidExceptionDateBoundary'
}

interface ErrorWithNoData {
  code:
    | ErrorCode.INTERNAL_SERVER_ERROR
    | ErrorCode.INVALID_REQUEST
    | ErrorCode.INVALID_PARAMETER
    | ErrorCode.CALENDAR_NO_NAME
    | ErrorCode.CALENDAR_INVALID_DATE_RANGE
    | ErrorCode.CALENDAR_INVALID_EXCEPTION_NAME
    | ErrorCode.CALENDAR_INVALID_EXCEPTION_OPENINGS
    | ErrorCode.CALENDAR_INVALID_EXCEPTION_OPENING_BOUNDARY;
  data?: unknown;
}

interface ErrorCalendarOverlap {
  code: ErrorCode.CALENDAR_DATE_OVERLAP;
  data: {
    conflictingServicePointIds: string[];
  };
}

interface ErrorCalendarNotFound {
  code: ErrorCode.CALENDAR_NOT_FOUND;
  data: {
    notFound: string[];
  };
}
interface ErrorCalendarInvalidNormalOpenings {
  code: ErrorCode.CALENDAR_INVALID_NORMAL_OPENINGS;
  data: {
    conflicts: CalendarOpening[];
  };
}

interface ErrorCalendarInvalidExceptions {
  code: ErrorCode.CALENDAR_INVALID_EXCEPTIONS;
  data: {
    conflicts: CalendarException[];
  };
}

interface ErrorCalendarInvalidSingleException {
  code:
    | ErrorCode.CALENDAR_INVALID_EXCEPTION_DATE_ORDER
    | ErrorCode.CALENDAR_INVALID_EXCEPTION_DATE_BOUNDARY;
  data: {
    range: CalendarException;
  };
}
export type Error = {
  message: string;
  _parameters?: Record<string, unknown>;
  _trace?: string[];
} & (
  | ErrorWithNoData
  | ErrorCalendarOverlap
  | ErrorCalendarNotFound
  | ErrorCalendarInvalidNormalOpenings
  | ErrorCalendarInvalidExceptions
  | ErrorCalendarInvalidSingleException
);

export interface ErrorResponse {
  timestamp: string;
  status: number;
  errors: Error[];
}

export interface DailyOpeningInfo {
  date: string;
  allDay: boolean;
  open: boolean;
  exceptional: boolean;
  exceptionName?: string;
  openings: { startTime: string; endTime: string }[];
}
