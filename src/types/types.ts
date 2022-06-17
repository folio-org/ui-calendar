export type Weekday =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

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
  id: string;
  name: string;
  servicePoints: string[];
  startDate: string;
  endDate: string;
  openings: CalendarOpening[];
  exceptions: CalendarException[];
}
