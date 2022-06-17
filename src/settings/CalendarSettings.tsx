import { ErrorBoundary } from "@folio/stripes-components";
import { Settings, SettingsProps } from "@folio/stripes-smart-components";
import React from "react";
import { FormattedMessage } from "react-intl";
import AllCalendarView from "./AllCalendarView";
import CurrentAssignmentView from "./CurrentAssignmentView";
import MonthlyCalendarPickerView from "./MonthlyCalendarPickerView";

export const CalendarSettings = (props: Partial<SettingsProps>) => {
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

export default CalendarSettings;
