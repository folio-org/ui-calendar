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
import React, { ReactNode, useRef } from "react";
import {
  Route,
  RouteComponentProps,
  Switch,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import SortableMultiColumnList from "../components/SortableMultiColumnList";
import { getLocalizedDate } from "../data/CalendarUtils";
import { MANIFEST, Resources } from "../data/SharedData";
import useDataRepository from "../data/useDataRepository";
import InfoPane from "../panes/InfoPane";
import { Calendar } from "../types/types";
import CreateEditCalendarLayer from "./CreateEditCalendarLayer";

export type AllCalendarViewProps = ConnectedComponentProps<Resources>;

const AllCalendarView: ConnectedComponent<AllCalendarViewProps, Resources> = (
  props: AllCalendarViewProps
) => {
  const dataRepository = useDataRepository(props.resources, props.mutator);

  const showCreateLayerButtonRef = useRef<HTMLButtonElement>(null);
  const history = useHistory();
  const currentRouteId = useRouteMatch<{ calendarId: string }>(
    "/settings/calendar/all/:calendarId"
  )?.params?.calendarId;

  if (!dataRepository.isLoaded()) {
    return <LoadingPane paneTitle="All calendars" />;
  }

  const rows = dataRepository.getCalendars().map((calendar) => {
    const servicePointNames = dataRepository.getServicePointNamesFromIds(
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
        <Route
          path="/settings/calendar/all/create"
          render={({ location }: RouteComponentProps<{ source?: string }>) => (
            <CreateEditCalendarLayer
              dataRepository={dataRepository}
              initialValue={dataRepository.getCalendar(
                new URLSearchParams(location.search).get("source")
              )}
              onClose={(id = "") => {
                history.push(`/settings/calendar/all/${id}`);
                showCreateLayerButtonRef.current?.focus();
              }}
            />
          )}
        />
        <Route
          path="/settings/calendar/all/edit/:id"
          render={({ match }: RouteComponentProps<{ id: string }>) => (
            <CreateEditCalendarLayer
              dataRepository={dataRepository}
              initialValue={dataRepository.getCalendar(match.params.id)}
              isEdit
              onClose={() => {
                history.push(`/settings/calendar/all/${match.params.id}`);
                showCreateLayerButtonRef.current?.focus();
              }}
            />
          )}
        />
        <Route path="/settings/calendar/all/:id">
          <InfoPane
            editBasePath="/settings/calendar/all/edit"
            creationBasePath="/settings/calendar/all/create"
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
