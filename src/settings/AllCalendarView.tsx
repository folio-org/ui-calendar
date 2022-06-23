import {
  Button,
  Icon,
  LoadingPane,
  MenuSection,
  MultiColumnList,
  Pane,
} from "@folio/stripes-components";
import {
  ConnectedComponent,
  ConnectedComponentProps,
} from "@folio/stripes-connect";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Route, useHistory, useRouteMatch } from "react-router-dom";
import { Calendar } from "../types/types";
import { servicePointIdsToNames } from "./CalendarUtils";
import CreateCalendarLayer from "./CreateCalendarLayer";
import DataRepository from "./DataRepository";
import InfoPane from "./InfoPane";
import * as MockConstants from "./MockConstants";
import { MANIFEST, Resources } from "./SharedData";

export type AllCalendarViewProps = ConnectedComponentProps<Resources>;

const AllCalendarView: ConnectedComponent<AllCalendarViewProps, Resources> = (
  props: AllCalendarViewProps
) => {
  const [dataRepository, setDataRepository] = useState(
    new DataRepository(props.resources, props.mutator)
  );
  useEffect(
    () => setDataRepository(new DataRepository(props.resources, props.mutator)),
    [props.resources, props.mutator]
  );

  const [showCreateLayer, setShowCreateLayer] = useState(false);
  const showCreateLayerButtonRef = useRef<HTMLButtonElement>(null);
  const history = useHistory();
  const currentRouteId = useRouteMatch<{ calendarId: string }>(
    "/settings/calendar/all/:calendarId"
  )?.params?.calendarId;

  if (!dataRepository.isLoaded()) {
    return <LoadingPane paneTitle="All calendars" />;
  }

  const rows = MockConstants.CALENDARS.map((calendar) => {
    const servicePointNames = servicePointIdsToNames(
      dataRepository.getServicePoints(),
      calendar.assignments
    );
    return {
      name: calendar.name,
      startDate: calendar.startDate,
      endDate: calendar.endDate,
      assignments: servicePointNames.length ? (
        servicePointNames.join(", ")
      ) : (
        <div style={{ fontStyle: "italic", color: "grey" }}>None</div>
      ),
      calendar,
    };
  });

  return (
    <>
      <Pane
        defaultWidth={currentRouteId === undefined ? "fill" : "20%"}
        paneTitle="All calendars"
        actionMenu={({ onToggle }) => (
          <>
            <MenuSection label="Actions">
              <Button
                buttonStyle="dropdownItem"
                ref={showCreateLayerButtonRef}
                onClick={onToggle}
              >
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
        <MultiColumnList<
          {
            name: string;
            startDate: string;
            endDate: string;
            assignments: ReactNode;
            calendar: Calendar;
          },
          "calendar"
        >
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
            return item.calendar.id === currentRouteId;
          }}
          onRowClick={(_e, info) => {
            if (info.calendar.id === currentRouteId) {
              // already displaying, being hidden
              history.push("/settings/calendar/all/");
            } else {
              history.push(`/settings/calendar/all/${info.calendar.id}`);
            }
          }}
        />
      </Pane>

      <Route path="/settings/calendar/all/:id">
        <InfoPane
          onClose={() => {
            history.push("/settings/calendar/all/");
          }}
          calendar={
            MockConstants.CALENDARS.filter((c) => c.id === currentRouteId)[0]
          }
        />
      </Route>

      <CreateCalendarLayer
        dataRepository={dataRepository}
        isOpen={showCreateLayer}
        onClose={() => {
          setShowCreateLayer(false);
          showCreateLayerButtonRef.current?.focus();
        }}
      />
    </>
  );
};

AllCalendarView.manifest = MANIFEST;

export default AllCalendarView;
