import {
  ConnectedComponent,
  ConnectedComponentProps,
} from "@folio/stripes-connect";
import { SettingsProps } from "@folio/stripes-smart-components";
import { matchPath } from "react-router-dom";
import { Calendar, DailyOpeningInfo } from "../types/types";

export interface ServicePointDTO {
  id: string;
  name: string;
  code: string;
  discoveryDisplayName: string;
  staffSlips: unknown[];
  metadata: unknown;
}

export interface CalendarProps
  extends SettingsProps,
    ConnectedComponentProps<Resources> {}

export interface Resources {
  okapi: {
    servicePoints: ServicePointDTO;
    calendars: Calendar;
    dates: DailyOpeningInfo;
  };
}

export const MAX_LIMIT = 2147483647;

export const MANIFEST: ConnectedComponent<
  ConnectedComponentProps<Resources>,
  Resources
>["manifest"] = {
  servicePoints: {
    type: "okapi",
    path: "service-points",
    records: "servicepoints",
    perRequest: MAX_LIMIT,
    params: {
      query: "cql.allRecords=1",
    },
    limitParam: "limit",
    offsetParam: "offset",
    recordsRequired: MAX_LIMIT,
  },
  calendars: {
    type: "okapi",
    path: "opening-hours/calendars",
    records: "calendars",
    perRequest: MAX_LIMIT,
    limitParam: "limit",
    offsetParam: "offset",
    recordsRequired: MAX_LIMIT,
    throwErrors: false,
  },
  dates: {
    type: "okapi",
    path: (_queryParams, _pathParams, _resources, _logger, props) => {
      const currentRouteId = matchPath<{
        servicePointId: string;
      }>(props.location?.pathname, {
        path: "/settings/calendar/monthly/:servicePointId",
      })?.params?.servicePointId;

      if (currentRouteId !== undefined) {
        return `opening-hours/dates/${currentRouteId}/all-openings`;
      }

      return null;
    },
    params: { includeClosed: "true" },
    records: "dates",
    perRequest: MAX_LIMIT,
    limitParam: "limit",
    offsetParam: "offset",
    recordsRequired: MAX_LIMIT,
    throwErrors: false,
    accumulate: true,
    fetch: false,
  },
};
