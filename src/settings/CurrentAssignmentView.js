import {
  Button,
  MultiColumnList,
  Pane,
  PaneMenu,
} from "@folio/stripes-components";
import React, { useRef, useState } from "react";
import ErrorBoundary from "../ErrorBoundary";
import CalendarSettings, { SettingPaneSizeContext } from "./CalendarSettings";
import CreateCalendarLayer from "./CreateCalendarLayer";
import InfoPane from "./InfoPane";

function objectify(
  servicePoint,
  calendarName,
  startDate,
  endDate,
  currentStatus
) {
  return {
    servicePoint,
    calendarName: calendarName ?? (
      <div style={{ fontStyle: "italic", color: "grey" }}>None</div>
    ),
    startDate,
    endDate,
    currentStatus,
  };
}

/** Information used for an empty row, to prevent it displaying or highlighting */
const EMPTY_ROW_INFO = {
  servicePoint: null,
  calendarName: null,
  startDate: null,
  endDate: null,
  currentStatus: null,
};

export default function CurrentAssignmentView() {
  const [infoPaneStatus, setInfoPaneStatus] = useState({
    displayed: false,
    info: EMPTY_ROW_INFO,
  });
  const [showCreateLayer, setShowCreateLayer] = useState(false);
  const showCreateLayerButtonRef = useRef(null);

  return (
    <ErrorBoundary>
      <SettingPaneSizeContext.Consumer>
        {({ setSmaller: setSmallerNavPane }) => (
          <>
            <Pane
              lastMenu={
                <PaneMenu>
                  <Button
                    buttonStyle="primary"
                    marginBottom0
                    onClick={() => setShowCreateLayer(true)}
                    buttonRef={showCreateLayerButtonRef}
                  >
                    New
                  </Button>
                </PaneMenu>
              }
              defaultWidth={infoPaneStatus.displayed ? "20%" : "fill"}
              paneTitle="Current calendar assignments"
            >
              <MultiColumnList
                sortedColumn="servicePoint"
                sortDirection="ascending"
                onHeaderClick={() => ({})}
                columnMapping={{
                  servicePoint: "Service point",
                  calendarName: "Calendar",
                  startDate: "Start date",
                  endDate: "End date",
                  currentStatus: "Current status",
                }}
                contentData={[
                  objectify(
                    "Service point 1",
                    "2022 Spring Hours",
                    "01/02/2022",
                    "05/31/2022",
                    "Open until 7pm"
                  ),
                  objectify(
                    "Service point 2 (inactive)",
                    null,
                    "",
                    "",
                    "Closed"
                  ),
                  objectify(
                    "Service point 3",
                    "2022 Spring Hours",
                    "01/02/2022",
                    "05/31/2022",
                    "Open until 7pm"
                  ),
                  objectify(
                    "Service point 4",
                    "Sample with Exceptions",
                    "03/02/2022",
                    "05/31/2022",
                    "Closed (Sample Exception Name)"
                  ),
                  objectify(
                    "Service point 5 (overnight)",
                    "24/5",
                    "01/02/2022",
                    "05/31/2022",
                    "Open until 9pm Friday"
                  ),
                ]}
                isSelected={({ item }) => {
                  return (
                    infoPaneStatus.displayed &&
                    item.servicePoint === infoPaneStatus.info.servicePoint
                  );
                }}
                onRowClick={(_e, info) => {
                  if (info.startDate === "") {
                    // no cal assigned
                    setSmallerNavPane(false);
                    setInfoPaneStatus({
                      displayed: false,
                      info: EMPTY_ROW_INFO,
                    });
                  } else if (
                    info.servicePoint === infoPaneStatus.info.servicePoint
                  ) {
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
