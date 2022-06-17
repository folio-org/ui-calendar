import {
  ConnectedComponent,
  ConnectedComponentProps,
} from "@folio/stripes-connect";
import { SettingsProps } from "@folio/stripes-smart-components";
import { Calendar, ServicePoint } from "../types/types";

export interface CalendarProps
  extends SettingsProps,
    ConnectedComponentProps<Resources> {}

export interface Resources {
  okapi: { servicePoints: ServicePoint; calendars: Calendar };
}

const MAX_LIMIT = 2147483647;

export const MANIFEST: ConnectedComponent<
  CalendarProps,
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
  },
};
export default MANIFEST;
