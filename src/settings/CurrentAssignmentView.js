import {
  Button,
  MultiColumnList,
  Pane,
  PaneMenu,
} from "@folio/stripes-components";
import React, { useRef, useState } from "react";
import ErrorBoundary from "../ErrorBoundary";
import CreateCalendarLayer from "./CreateCalendarLayer";

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

export default function CurrentAssignmentView() {
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
              Create
            </Button>
          </PaneMenu>
        }
        defaultWidth="fill"
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
            objectify("Service point 2 (inactive)", null, "", "", "Closed"),
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
