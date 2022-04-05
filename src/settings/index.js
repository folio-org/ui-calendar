import React from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { Settings } from "@folio/stripes/smart-components";

import CurrentAssignmentView from "./CurrentAssignmentView";

export default (props) => {
  return (
    <Settings
      {...props}
      pages={[
        {
          route: "active",
          label: "Current Assignments",
          component: CurrentAssignmentView,
        },
        {
          route: "calendars",
          label: "All Calendars",
          component: CurrentAssignmentView,
        },
      ]}
      paneTitle={<FormattedMessage id="ui-calendar.settings.calendar" />}
    />
  );
};
