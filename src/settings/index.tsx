import { SettingsProps } from "@folio/stripes-smart-components";
import React from "react";
import CalendarSettings from "./CalendarSettings";

export default (props: Partial<SettingsProps>) => {
  return <CalendarSettings {...props} />;
};
