import { Button, LoadingPane, Pane, PaneMenu } from "@folio/stripes-components";
import {
  ConnectedComponent,
  ConnectedComponentProps,
} from "@folio/stripes-connect";
import React, { useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  Route,
  RouteComponentProps,
  Switch,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import SortableMultiColumnList from "../components/SortableMultiColumnList";
import * as MockConstants from "../data/MockConstants";
import { MANIFEST, Resources } from "../data/SharedData";
import useDataRepository from "../data/useDataRepository";
import { getLocalizedDate } from "../utils/DateUtils";
import getStatus from "../utils/getCurrentStatus";
import CreateEditCalendarLayer from "./CreateEditCalendarLayer";
import InfoPane from "./panes/InfoPane";

export type CurrentAssignmentViewProps = ConnectedComponentProps<Resources>;

export const CurrentAssignmentView: ConnectedComponent<
  CurrentAssignmentViewProps,
  Resources
> = (props: CurrentAssignmentViewProps) => {
  const intl = useIntl();
  const dataRepository = useDataRepository(props.resources, props.mutator);

  const showCreateLayerButtonRef = useRef<HTMLButtonElement>(null);
  const history = useHistory();
  const currentRouteId = useRouteMatch<{ servicePointId: string }>(
    "/settings/calendar/active/:servicePointId"
  )?.params?.servicePointId;

  if (!dataRepository.isLoaded()) {
    return (
      <LoadingPane
        paneTitle={
          <FormattedMessage id="ui-calendar.currentAssignmentView.title" />
        }
      />
    );
  }

  const rows = dataRepository.getServicePoints().map((servicePoint) => {
    const calendars = dataRepository
      .getCalendars()
      .filter(
        (calendar) =>
          MockConstants.MOCKED_DATE_OBJ.isBetween(
            calendar.startDate,
            calendar.endDate,
            "day",
            "[]"
          ) && calendar.assignments.includes(servicePoint.id)
      );
    if (calendars.length === 0) {
      return {
        servicePoint: servicePoint.name.concat(
          servicePoint.inactive ? " (inactive)" : ""
        ),
        calendarName: (
          <div style={{ fontStyle: "italic", color: "grey" }}>
            <FormattedMessage id="ui-calendar.currentAssignmentView.noCalendar" />
          </div>
        ),
        startDate: "",
        endDate: "",
        currentStatus: (
          <FormattedMessage id="ui-calendar.currentStatus.closed" />
        ),
        calendar: null,
      };
    }
    return {
      servicePointId: servicePoint.id,
      servicePoint: servicePoint.name.concat(
        servicePoint.inactive ? " (inactive)" : ""
      ),
      calendarName: calendars[0].name,
      startDate: getLocalizedDate(intl, calendars[0].startDate),
      endDate: getLocalizedDate(intl, calendars[0].endDate),
      currentStatus: getStatus(
        intl,
        MockConstants.MOCKED_DATE_TIME_OBJ,
        calendars[0]
      ),
      calendar: calendars[0],
    };
  });

  return (
    <>
      <Pane
        paneTitle={
          <FormattedMessage id="ui-calendar.currentAssignmentView.title" />
        }
        defaultWidth={currentRouteId === undefined ? "fill" : "20%"}
        lastMenu={
          <PaneMenu>
            <Button
              buttonStyle="primary"
              marginBottom0
              ref={showCreateLayerButtonRef}
              to="/settings/calendar/active/create"
            >
              <FormattedMessage id="ui-calendar.currentAssignmentView.actions.new" />
            </Button>
          </PaneMenu>
        }
      >
        <SortableMultiColumnList
          sortedColumn="servicePoint"
          sortDirection="ascending"
          dateColumns={["startDate", "endDate"]}
          columnMapping={{
            servicePoint: (
              <FormattedMessage id="ui-calendar.currentAssignmentView.column.servicePoint" />
            ),
            calendarName: (
              <FormattedMessage id="ui-calendar.currentAssignmentView.column.name" />
            ),
            startDate: (
              <FormattedMessage id="ui-calendar.currentAssignmentView.column.startDate" />
            ),
            endDate: (
              <FormattedMessage id="ui-calendar.currentAssignmentView.column.endDate" />
            ),
            currentStatus: (
              <FormattedMessage id="ui-calendar.currentAssignmentView.column.currentStatus" />
            ),
          }}
          contentData={rows}
          rowMetadata={["servicePointId", "calendar"]}
          isSelected={({ item }) => {
            return (
              currentRouteId !== undefined &&
              item.servicePointId === currentRouteId
            );
          }}
          onRowClick={(_e, info) => {
            if (
              info.startDate === "" ||
              info.servicePointId === currentRouteId
            ) {
              // no cal assigned or being toggled off
              history.push("/settings/calendar/active/");
            } else {
              // new cal
              history.push(`/settings/calendar/active/${info.servicePointId}`);
            }
          }}
        />
      </Pane>

      <Switch>
        <Route
          path="/settings/calendar/active/create"
          render={({ location }: RouteComponentProps<{ source?: string }>) => (
            <CreateEditCalendarLayer
              dataRepository={dataRepository}
              initialValue={dataRepository.getCalendar(
                new URLSearchParams(location.search).get("source")
              )}
              onClose={(id = "") => {
                history.push(`/settings/calendar/active/${id}`);
                showCreateLayerButtonRef.current?.focus();
              }}
            />
          )}
        />
        <Route
          path="/settings/calendar/active/edit/:id"
          render={({ match }: RouteComponentProps<{ id: string }>) => (
            <CreateEditCalendarLayer
              dataRepository={dataRepository}
              initialValue={dataRepository.getCalendar(match.params.id)}
              isEdit
              onClose={() => {
                history.push(`/settings/calendar/active/${match.params.id}`);
                showCreateLayerButtonRef.current?.focus();
              }}
            />
          )}
        />
        <Route path="/settings/calendar/active/:id">
          <InfoPane
            editBasePath="/settings/calendar/active/edit"
            creationBasePath="/settings/calendar/active/create"
            onClose={() => {
              history.push("/settings/calendar/active/");
            }}
            calendar={
              rows.filter((row) => row.servicePointId === currentRouteId)[0]
                ?.calendar
            }
            dataRepository={dataRepository}
          />
        </Route>
      </Switch>
    </>
  );
};

CurrentAssignmentView.manifest = MANIFEST;

export default CurrentAssignmentView;
