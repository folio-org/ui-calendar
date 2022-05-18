import {
  Button,
  Icon,
  MenuSection,
  MultiColumnList,
  Pane,
} from "@folio/stripes-components";
import React, { useRef, useState } from "react";
import ErrorBoundary from "../ErrorBoundary";
import { SettingPaneSizeContext } from "./CalendarSettings";
import * as CalendarUtils from "./CalendarUtils";
import CreateCalendarLayer from "./CreateCalendarLayer";
import InfoPane from "./InfoPane";
import * as MockConstants from "./MockConstants";

/** Information used for an empty row, to prevent it displaying or highlighting */
const EMPTY_ROW_INFO = {
  servicePoint: null,
  calendarName: null,
  startDate: null,
  endDate: null,
  currentStatus: null,
};

export default function AllCalendarView() {
  const [infoPaneStatus, setInfoPaneStatus] = useState({
    displayed: false,
    info: EMPTY_ROW_INFO,
  });
  const [showCreateLayer, setShowCreateLayer] = useState(false);
  const showCreateLayerButtonRef = useRef(null);

  const rows = MockConstants.CALENDARS.map((calendar) => {
    return {
      name: calendar.name,
      startDate: calendar.startDate,
      endDate: calendar.endDate,
      assignments: calendar.servicePoints.length ? (
        calendar.servicePoints.join(", ")
      ) : (
        <div style={{ fontStyle: "italic", color: "grey" }}>None</div>
      ),
      calendar,
    };
  });

  return (
    <ErrorBoundary>
      <SettingPaneSizeContext.Consumer>
        {({ setSmaller: setSmallerNavPane }) => (
          <>
            <Pane
              defaultWidth={infoPaneStatus.displayed ? "20%" : "fill"}
              paneTitle="All calendars"
              actionMenu={({ onToggle }) => (
                <>
                  <MenuSection label="Actions">
                    <Button buttonStyle="dropdownItem" onClick={onToggle}>
                      <Icon size="small" icon="plus-sign">
                        New
                      </Icon>
                    </Button>
                    <Button buttonStyle="dropdownItem" onClick={onToggle}>
                      <Icon size="small" icon="trash">
                        Purge old calendars
                      </Icon>
                    </Button>
                  </MenuSection>
                </>
              )}
            >
              <MultiColumnList
                sortedColumn="servicePoint"
                sortDirection="ascending"
                onHeaderClick={() => ({})}
                columnMapping={{
                  name: "Calendar name",
                  startDate: "Start date",
                  endDate: "End date",
                  assignments: "Assignments",
                }}
                contentData={rows}
                rowMetadata={["calendar"]}
                isSelected={({ item }) => {
                  return (
                    infoPaneStatus.displayed &&
                    item.name === infoPaneStatus.info.name
                  );
                }}
                onRowClick={(_e, info) => {
                  if (info.name === infoPaneStatus.info.name) {
                    // toggle
                    setSmallerNavPane(!infoPaneStatus.displayed);
                    setInfoPaneStatus({
                      displayed: !infoPaneStatus.displayed,
                      info,
                    });
                  } else {
                    // new cal
                    setSmallerNavPane(true);
                    setInfoPaneStatus({
                      displayed: true,
                      info,
                    });
                  }
                }}
              />
            </Pane>

            <InfoPane
              isDisplayed={infoPaneStatus.displayed}
              info={infoPaneStatus.info}
              onClose={() => {
                setSmallerNavPane(false);
                setInfoPaneStatus({ displayed: false, info: EMPTY_ROW_INFO });
              }}
            />

            <CreateCalendarLayer
              isOpen={showCreateLayer}
              onClose={() => {
                setShowCreateLayer(false);
                showCreateLayerButtonRef.current?.focus();
              }}
            />
          </>
        )}
      </SettingPaneSizeContext.Consumer>
    </ErrorBoundary>
  );
}
