import { Settings } from "@folio/stripes/smart-components";
import { createContext, useState } from "react";
import { FormattedMessage } from "react-intl";
import CurrentAssignmentView from "./CurrentAssignmentView";

export const SettingPaneSizeContext = createContext({
  smaller: false,
  setSmaller: () => {
    /* provided by SettingPaneSizeContext.Provider */
  },
});
SettingPaneSizeContext.displayName = "CalendarSettingsPaneSizeContext";

export default function CalendarSettings(props) {
  const [smaller, setSmaller] = useState(false);
  return (
    <SettingPaneSizeContext.Provider
      value={{
        smaller,
        setSmaller,
      }}
    >
      <Settings
        {...props}
        navPaneWidth={smaller ? "15%" : "30%"} // 30% is FOLIO default but too big for three panes
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
    </SettingPaneSizeContext.Provider>
  );
}
