import { Button, LoadingPane, Pane, PaneMenu } from '@folio/stripes/components';
import { IfPermission, TitleManager, useStripes } from '@folio/stripes/core';
import React, { FunctionComponent, ReactNode, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Route,
  RouteComponentProps,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import SortableMultiColumnList from '../components/SortableMultiColumnList';
import useDataRepository from '../data/useDataRepository';
import permissions from '../types/permissions';
import { Calendar } from '../types/types';
import {
  dateFromYYYYMMDD,
  getLocalizedDate,
  isBetweenDatesByDay,
} from '../utils/DateUtils';
import getStatus from '../utils/getCurrentStatus';
import { useLocaleWeekdays } from '../utils/WeekdayUtils';
import CreateEditCalendarLayer from './CreateEditCalendarLayer';
import InfoPane from './panes/InfoPane';

export const CurrentAssignmentView: FunctionComponent<
  Record<string, never>
> = () => {
  const intl = useIntl();
  const localeWeekdays = useLocaleWeekdays(intl);
  const dataRepository = useDataRepository();
  const stripes = useStripes();

  const showCreateLayerButtonRef = useRef<HTMLButtonElement>(null);
  const history = useHistory();
  const currentRouteId =
    useRouteMatch<{ servicePointId: string }>(
      '/settings/calendar/active/:servicePointId',
    )?.params?.servicePointId ?? '';

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
    const calendars = dataRepository.getCalendars().filter((calendar) => {
      return (
        isBetweenDatesByDay(
          new Date(),
          dateFromYYYYMMDD(calendar.startDate),
          dateFromYYYYMMDD(calendar.endDate),
        ) && calendar.assignments.includes(servicePoint.id)
      );
    });
    if (calendars.length === 0) {
      return {
        servicePoint: servicePoint.name.concat(
          servicePoint.inactive ? ' (inactive)' : '',
        ),
        servicePointId: servicePoint.id,
        calendarName: (
          <div style={{ fontStyle: 'italic', color: 'grey' }}>
            <FormattedMessage id="ui-calendar.currentAssignmentView.noCalendar" />
          </div>
        ),
        startDate: '',
        startDateObj: undefined,
        endDate: '',
        endDateObj: undefined,
        currentStatus: intl.formatMessage({
          id: 'ui-calendar.currentStatus.closed.noNext',
        }),
        calendar: null,
      };
    }
    return {
      servicePointId: servicePoint.id,
      servicePoint: servicePoint.name.concat(
        servicePoint.inactive ? ' (inactive)' : '',
      ),
      calendarName: calendars[0].name,
      startDate: getLocalizedDate(intl, calendars[0].startDate),
      startDateObj: dateFromYYYYMMDD(calendars[0].startDate),
      endDate: getLocalizedDate(intl, calendars[0].endDate),
      endDateObj: dateFromYYYYMMDD(calendars[0].endDate),
      currentStatus: getStatus(intl, localeWeekdays, new Date(), calendars[0]),
      calendar: calendars[0],
    };
  });

  const calendarName =
    dataRepository
      .getCalendars()
      .filter((c) => c.assignments.includes(currentRouteId))[0]?.name ?? '';

  const pageTitle =
    intl.formatMessage({ id: 'ui-calendar.meta.titleSettings' }) +
    ' - ' +
    intl.formatMessage({
      id: 'ui-calendar.currentAssignmentView.title',
    }) +
    (calendarName ? ` - ${calendarName}` : '');

  return (
    <TitleManager page={pageTitle} stripes={stripes}>
      <Pane
        paneTitle={
          <FormattedMessage id="ui-calendar.currentAssignmentView.title" />
        }
        defaultWidth={currentRouteId === undefined ? 'fill' : '20%'}
        lastMenu={
          <IfPermission perm={permissions.CREATE}>
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
          </IfPermission>
        }
      >
        <SortableMultiColumnList<
          {
            servicePoint: ReactNode;
            servicePointId: string;
            calendarName: ReactNode;
            startDate: ReactNode;
            startDateObj?: Date;
            endDate: ReactNode;
            endDateObj?: Date;
            currentStatus: string;
            calendar: Calendar | null;
          },
          'servicePointId' | 'calendar' | 'startDateObj' | 'endDateObj'
        >
          sortedColumn="servicePoint"
          sortDirection="ascending"
          dateColumns={['startDate', 'endDate']}
          dateColumnMap={{ startDate: 'startDateObj', endDate: 'endDateObj' }}
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
            currentStatus: intl.formatMessage({
              id: 'ui-calendar.currentAssignmentView.column.currentStatus',
            }),
          }}
          contentData={rows}
          rowMetadata={[
            'servicePointId',
            'calendar',
            'startDateObj',
            'endDateObj',
          ]}
          isSelected={({ item }) => {
            return (
              currentRouteId !== undefined &&
              item.servicePointId === currentRouteId
            );
          }}
          onRowClick={(_e, info) => {
            if (
              info.startDate === '' ||
              info.servicePointId === currentRouteId
            ) {
              // no cal assigned or being toggled off
              history.push('/settings/calendar/active/');
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
            <IfPermission perm={permissions.CREATE}>
              <CreateEditCalendarLayer
                dataRepository={dataRepository}
                initialValue={dataRepository.getCalendar(
                  new URLSearchParams(location.search).get('source'),
                )}
                onClose={(id = '') => {
                  history.push(`/settings/calendar/active/${id}`);
                  showCreateLayerButtonRef.current?.focus();
                }}
              />
            </IfPermission>
          )}
        />
        <Route
          path="/settings/calendar/active/edit/:id"
          render={({ match }: RouteComponentProps<{ id: string }>) => (
            <IfPermission perm={permissions.UPDATE}>
              <CreateEditCalendarLayer
                dataRepository={dataRepository}
                initialValue={dataRepository.getCalendar(match.params.id)}
                isEdit
                onClose={() => {
                  history.push(`/settings/calendar/active/${match.params.id}`);
                  showCreateLayerButtonRef.current?.focus();
                }}
              />
            </IfPermission>
          )}
        />
        <Route path="/settings/calendar/active/:id">
          <InfoPane
            editBasePath="/settings/calendar/active/edit"
            creationBasePath="/settings/calendar/active/create"
            onClose={() => {
              history.push('/settings/calendar/active/');
            }}
            calendar={
              rows.filter((row) => row.servicePointId === currentRouteId)[0]
                ?.calendar
            }
            dataRepository={dataRepository}
          />
        </Route>
      </Switch>
    </TitleManager>
  );
};

export default CurrentAssignmentView;
