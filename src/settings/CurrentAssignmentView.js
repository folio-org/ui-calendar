import {
  Button,
  Icon,
  MultiColumnList,
  Pane,
  PaneMenu,
} from "@folio/stripes-components";
import React, { useRef, useState } from "react";
import ErrorBoundary from "../ErrorBoundary";
import CreateCalendarLayer from "./CreateCalendarLayer";

function objify(servicePoint, calendarName, startDate, endDate, currentStatus) {
  return {
    servicePoint,
    calendarName:
      calendarName === null ? (
        <div style={{ fontStyle: "italic", color: "grey" }}>None</div>
      ) : (
        calendarName
      ),
    startDate,
    endDate,
    currentStatus,
  };
}

export default function CurrentAssignmentView(props) {
  const [showCreateLayer, setShowCreateLayer] = useState(false);
  const showCreateLayerButtonRef = useRef(null);

  return (
    <ErrorBoundary>
      <Pane
        lastMenu={
          <PaneMenu>
            <Button
              buttonStyle="primary"
              marginBottom0
              onClick={() => setShowCreateLayer(true)}
              buttonRef={showCreateLayerButtonRef}
            >
              <Icon size="small" icon="plus-sign">
                Create
              </Icon>
            </Button>
          </PaneMenu>
        }
        defaultWidth="fill"
        paneTitle="Current Calendar Assignments"
      >
        <MultiColumnList
          columnMapping={{
            servicePoint: "Service point",
            calendarName: "Calendar",
            startDate: "Start Date",
            endDate: "End Date",
            currentStatus: "Current status",
          }}
          contentData={[
            objify(
              "Service point 1",
              "Spring Hours",
              "March 2, 2022",
              "May 31, 2022",
              "Open until 7pm"
            ),
            objify("Service point 2", null, "", "", "Closed"),
          ]}
        />
      </Pane>

      <CreateCalendarLayer
        isOpen={showCreateLayer}
        onClose={() => {
          setShowCreateLayer(false);
          console.log(showCreateLayerButtonRef.current);
          showCreateLayerButtonRef.current?.focus();
        }}
      />
    </ErrorBoundary>
  );
}
