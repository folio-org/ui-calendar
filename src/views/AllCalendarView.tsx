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
import { IfPermission } from "@folio/stripes-core";
import React, { ReactNode, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  Route,
  RouteComponentProps,
  Switch,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import IfPermissionOr from "../components/IfPermissionOr";
import SortableMultiColumnList from "../components/SortableMultiColumnList";
import { MANIFEST, Resources } from "../data/SharedData";
import useDataRepository from "../data/useDataRepository";
import PurgeModal from "../forms/PurgeModal";
import permissions from "../types/permissions";
import { Calendar } from "../types/types";
import { getLocalizedDate } from "../utils/DateUtils";
import { formatList } from "../utils/I18nUtils";
import CreateEditCalendarLayer from "./CreateEditCalendarLayer";
import InfoPane from "./panes/InfoPane";

export type AllCalendarViewProps = ConnectedComponentProps<Resources>;

const AllCalendarView: ConnectedComponent<AllCalendarViewProps, Resources> = (
  props: AllCalendarViewProps
) => {
  const intl = useIntl();
  const dataRepository = useDataRepository(props.resources, props.mutator);
  const [showPurgeModal, setShowPurgeModal] = useState<boolean>(false);

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
      startDate: getLocalizedDate(intl, calendar.startDate),
      endDate: getLocalizedDate(intl, calendar.endDate),
      assignments: servicePointNames.length ? (
        formatList(intl, servicePointNames)
      ) : (
        <div style={{ fontStyle: "italic", color: "grey" }}>
          <FormattedMessage id="ui-calendar.allCalendarView.noAssignments" />
        </div>
      ),
      calendar,
    };
  });

  return (
    <>
      <Pane
        defaultWidth={currentRouteId === undefined ? "fill" : "20%"}
        paneTitle={<FormattedMessage id="ui-calendar.allCalendarView.title" />}
        actionMenu={({ onToggle }) => (
          <IfPermissionOr perms={[permissions.CREATE, permissions.DELETE]}>
            <MenuSection
              label={
                <FormattedMessage id="ui-calendar.allCalendarView.actions.label" />
              }
            >
              <IfPermission perm={permissions.CREATE}>
                <Button
                  buttonStyle="dropdownItem"
                  ref={showCreateLayerButtonRef}
                  onClick={onToggle}
                  to="/settings/calendar/all/create"
                >
                  <Icon size="small" icon="plus-sign">
                    <FormattedMessage id="ui-calendar.allCalendarView.actions.new" />
                  </Icon>
                </Button>
              </IfPermission>
              <IfPermission perm={permissions.DELETE}>
                <Button
                  buttonStyle="dropdownItem"
                  onClick={() => {
                    onToggle();
                    setShowPurgeModal(true);
                  }}
                >
                  <Icon size="small" icon="trash">
                    <FormattedMessage id="ui-calendar.allCalendarView.actions.purge" />
                  </Icon>
                </Button>
              </IfPermission>
            </MenuSection>
          </IfPermissionOr>
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
          dateColumns={["startDate", "endDate"]}
          columnMapping={{
            name: (
              <FormattedMessage id="ui-calendar.allCalendarView.column.name" />
            ),
            startDate: (
              <FormattedMessage id="ui-calendar.allCalendarView.column.startDate" />
            ),
            endDate: (
              <FormattedMessage id="ui-calendar.allCalendarView.column.endDate" />
            ),
            assignments: (
              <FormattedMessage id="ui-calendar.allCalendarView.column.assignments" />
            ),
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
        <IfPermission perm={permissions.CREATE}>
          <Route
            path="/settings/calendar/all/create"
            render={({
              location,
            }: RouteComponentProps<{ source?: string }>) => (
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
        </IfPermission>
        <IfPermission perm={permissions.UPDATE}>
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
        </IfPermission>
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

      <PurgeModal
        dataRepository={dataRepository}
        open={showPurgeModal}
        onClose={() => setShowPurgeModal(false)}
      />
    </>
  );
};

AllCalendarView.manifest = MANIFEST;

export default AllCalendarView;
