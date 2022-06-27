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
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { Calendar } from "../types/types";
import { getLocalizedDate } from "../data/CalendarUtils";
import CreateCalendarLayer from "./CreateCalendarLayer";
import DataRepository from "../data/DataRepository";
import InfoPane from "../panes/InfoPane";
import { MANIFEST, Resources } from "../data/SharedData";
import SortableMultiColumnList from "../components/SortableMultiColumnList";

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
                onClick={onToggle}
                to="/settings/calendar/all/create"
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
          sortedColumn="startDate"
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

      <Switch>
        <Route path="/settings/calendar/all/create">
          <CreateCalendarLayer
            dataRepository={dataRepository}
            onClose={() => {
              history.push("/settings/calendar/all/");
              showCreateLayerButtonRef.current?.focus();
            }}
          />
        </Route>
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
      </Switch>
    </>
  );
};

AllCalendarView.manifest = MANIFEST;

export default AllCalendarView;
