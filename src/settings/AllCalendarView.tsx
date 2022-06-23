import {
  Button,
  Icon,
  LoadingPane,
  MenuSection,
  Pane,
} from "@folio/stripes-components";
import {
  ConnectedComponent,
  ConnectedComponentProps,
} from "@folio/stripes-connect";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Route, useHistory, useRouteMatch } from "react-router-dom";
import { Calendar } from "../types/types";
import { getLocalizedDate } from "./CalendarUtils";
import CreateCalendarLayer from "./CreateCalendarLayer";
import DataRepository from "./DataRepository";
import InfoPane from "./InfoPane";
import { MANIFEST, Resources } from "./SharedData";
import SortableMultiColumnList from "./SortableMultiColumnList";

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

  const rows = dataRepository.getCalendars().map((calendar) => {
    const servicePointNames = dataRepository.getServicePointNames(
      calendar.assignments
    );
    return {
      name: calendar.name,
      startDate: getLocalizedDate(calendar.startDate),
      endDate: getLocalizedDate(calendar.endDate),
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
                onClick={() => {
                  onToggle();
                  setShowCreateLayer(true);
                }}
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
        <SortableMultiColumnList<
          {
            name: string;
            startDate: string;
            endDate: string;
            assignments: ReactNode;
            calendar: Calendar;
          },
          "calendar"
        >
          sortedColumn="name"
          sortDirection="ascending"
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
            dataRepository
              .getCalendars()
              .filter((c) => c.id === currentRouteId)[0]
          }
          dataRepository={dataRepository}
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
