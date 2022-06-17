import {
  ConnectedComponent,
  ConnectedComponentProps,
} from "@folio/stripes-connect";
import { SettingsProps } from "@folio/stripes-smart-components";
import { Calendar } from "../types/types";

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
  okapi: { servicePoints: ServicePointDTO; calendars: Calendar };
}

const MAX_LIMIT = 2147483647;

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
    path: "service-points",
    records: "servicepoints",
    params: {
      query: "cql.allRecords=1",
    },
    perRequest: MAX_LIMIT,
    limitParam: "limit",
    offsetParam: "offset",
    recordsRequired: MAX_LIMIT,
  },
};
