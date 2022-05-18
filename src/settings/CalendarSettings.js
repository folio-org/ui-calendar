import { Settings } from "@folio/stripes/smart-components";
import { createContext, useState } from "react";
import { FormattedMessage } from "react-intl";
import AllCalendarView from "./AllCalendarView";
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
        // TODO: this does not do anything as the size is cached and not updated from here
        navPaneWidth={smaller ? "15%" : "30%"} // 30% is FOLIO default but too big for three panes
        pages={[
          {
            route: "active",
            label: "Current assignments",
            component: CurrentAssignmentView,
          },
          {
            route: "all",
            label: "All calendars",
            component: AllCalendarView,
          },
        ]}
        paneTitle={<FormattedMessage id="ui-calendar.settings.calendar" />}
      />
    </SettingPaneSizeContext.Provider>
  );
}
