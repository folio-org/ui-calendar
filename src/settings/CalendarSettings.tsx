import { ErrorBoundary } from "@folio/stripes-components";
import { ConnectedComponent } from "@folio/stripes-connect";
import { Settings } from "@folio/stripes-smart-components";
import React from "react";
import { FormattedMessage } from "react-intl";
import AllCalendarView from "./AllCalendarView";
import CurrentAssignmentView from "./CurrentAssignmentView";
import MANIFEST, { CalendarProps, Resources } from "./manifest";
import MonthlyCalendarPickerView from "./MonthlyCalendarPickerView";

export { CalendarProps as CalendarSettingsProps } from "./manifest";

export const CalendarSettings: ConnectedComponent<CalendarProps, Resources> = (
  props: CalendarProps
) => {
  console.log(props.resources, props.mutator);
  return (
    <ErrorBoundary>
      <Settings
        {...props}
        // TODO: this does not do anything as the size is cached and not updated from here
        navPaneWidth="30%" // 30% is FOLIO default but too big for three panes
        pages={[
          {
            route: "all/",
            label: "All calendars",
            component: AllCalendarView,
          },
          {
            route: "active/",
            label: "Current assignments",
            component: CurrentAssignmentView,
          },
          {
            route: "monthly/",
            label: "Monthly view",
            component: MonthlyCalendarPickerView,
          },
        ]}
        paneTitle={<FormattedMessage id="ui-calendar.settings.calendar" />}
      />
    </ErrorBoundary>
  );
};

CalendarSettings.manifest = MANIFEST;

export default CalendarSettings;
