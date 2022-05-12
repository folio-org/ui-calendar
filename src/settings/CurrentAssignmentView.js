import {
  Button,
  MultiColumnList,
  Pane,
  PaneMenu,
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

export default function CurrentAssignmentView() {
  const [infoPaneStatus, setInfoPaneStatus] = useState({
    displayed: false,
    info: EMPTY_ROW_INFO,
  });
  const [showCreateLayer, setShowCreateLayer] = useState(false);
  const showCreateLayerButtonRef = useRef(null);

  const rows = MockConstants.SERVICE_POINT_LIST.map((servicePoint) => {
    const calendars = MockConstants.CALENDARS.filter(
      (calendar) =>
        MockConstants.MOCKED_DATE_OBJ.isBetween(
          calendar.startDate,
          calendar.endDate,
          "day",
          "[]"
        ) && calendar.servicePoints.includes(servicePoint.label)
    );
    if (calendars.length === 0) {
      return {
        servicePoint: servicePoint.label.concat(
          servicePoint.inactive ? " (inactive)" : ""
        ),
        calendarName: (
          <div style={{ fontStyle: "italic", color: "grey" }}>None</div>
        ),
        startDate: "",
        endDate: "",
        currentStatus: "Closed",
        calendar: null,
      };
    }
    return {
      servicePoint: servicePoint.label.concat(
        servicePoint.inactive ? " (inactive)" : ""
      ),
      calendarName: calendars[0].name,
      startDate: calendars[0].startDate,
      endDate: calendars[0].endDate,
      currentStatus: CalendarUtils.getStatus(
        MockConstants.MOCKED_DATE_TIME_OBJ,
        calendars[0]
      ),
      calendar: calendars[0],
    };
  });

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
                contentData={rows}
                rowMetadata={["calendar"]}
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
