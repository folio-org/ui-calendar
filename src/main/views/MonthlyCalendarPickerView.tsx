import {
  Icon,
  Loading,
  LoadingPane,
  NavList,
  NavListItem,
  NavListSection,
  Pane,
} from "@folio/stripes-components";
import {
  ConnectedComponent,
  ConnectedComponentProps,
} from "@folio/stripes-connect";
import classNames from "classnames";
import type { Dayjs } from "dayjs";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import { Route, useHistory, useRouteMatch } from "react-router-dom";
import css from "../components/Calendar.css";
import { MANIFEST, Resources } from "../data/SharedData";
import useDataRepository from "../data/useDataRepository";
import { DailyOpeningInfo } from "../types/types";
import { getDateRange, getLocalizedTime } from "../utils/DateUtils";
import MonthlyCalendarView from "./panes/MonthlyCalendarView";

function dailyOpeningToCalendarDisplay(
  intl: IntlShape,
  openingInfo: DailyOpeningInfo
): ReactNode {
  let exception: ReactNode = null;
  let status: ReactNode = (
    <p className={css.closed} key={-1}>
      <FormattedMessage id="ui-calendar.monthlyCalendarView.day.closed" />
    </p>
  );
  if (openingInfo.open) {
    if (openingInfo.allDay) {
      status = (
        <p>
          <FormattedMessage id="ui-calendar.monthlyCalendarView.day.allDay" />
        </p>
      );
    } else {
      openingInfo.openings.sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );
      status = openingInfo.openings.map((opening, i) => (
        <p key={i}>
          <FormattedMessage
            id="ui-calendar.monthlyCalendarView.day.timeRange"
            values={{
              startTime: getLocalizedTime(intl, opening.startTime),
              endTime: getLocalizedTime(intl, opening.endTime),
            }}
          />
        </p>
      ));
    }
  }
  if (openingInfo.exceptional) {
    if (openingInfo.open) {
      exception = (
        <span
          className={classNames(css.icon)}
          title={openingInfo.exceptionName}
        >
          <Icon icon="exclamation-circle" status="warn" />
        </span>
      );
    } else {
      exception = (
        <span
          className={classNames(css.icon)}
          title={openingInfo.exceptionName}
        >
          <Icon icon="exclamation-circle" status="error" />
        </span>
      );
    }
  }
  return (
    <>
      {status}
      {exception}
    </>
  );
}

export type MonthlyCalendarPickerViewProps = ConnectedComponentProps<Resources>;

const MonthlyCalendarPickerView: ConnectedComponent<
  MonthlyCalendarPickerViewProps,
  Resources
> = (props: MonthlyCalendarPickerViewProps) => {
  const intl = useIntl();
  const dataRepository = useDataRepository(props.resources, props.mutator);
  const [events, setEvents] = useState<
    Record<string, Record<string, ReactNode>>
  >({});
  const history = useHistory();

  const currentRouteId = useRouteMatch<{
    servicePointId: string;
  }>("/settings/calendar/monthly/:servicePointId")?.params?.servicePointId;

  useEffect(() => {
    if (currentRouteId !== undefined && !(currentRouteId in events)) {
      const newEvents = { ...events, [currentRouteId]: {} };
      setEvents(newEvents);
    }
    // we do not care about events changing, we only want to ensure that the SP has an entry
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRouteId]);

  const requestEvents = useCallback(
    async (startDate: Dayjs, endDate: Dayjs, servicePointId: string) => {
      if (servicePointId === currentRouteId) {
        const loadingEvents = { ...events };
        if (!(servicePointId in loadingEvents)) {
          loadingEvents[servicePointId] = {};
        }
        getDateRange(startDate, endDate).forEach((date) => {
          loadingEvents[servicePointId][date.format("YYYY-MM-DD")] = (
            <Loading />
          );
        });
        // prevents further calls of this function while these events are being loaded
        setEvents(loadingEvents);

        const dateRange = await dataRepository.getDateRange(startDate, endDate);

        if (dateRange === null) return;

        const newEvents = { ...loadingEvents };
        dateRange.forEach((openingInfo) => {
          newEvents[servicePointId][openingInfo.date] =
            dailyOpeningToCalendarDisplay(intl, openingInfo);
        });
        setEvents(newEvents);
      }
    },
    [dataRepository, currentRouteId, events, intl]
  );

  if (!dataRepository.isLoaded()) {
    return (
      <LoadingPane
        paneTitle={
          <FormattedMessage id="ui-calendar.monthlyCalendarView.title" />
        }
      />
    );
  }

  const listItems = dataRepository.getServicePoints().map((sp, i) => {
    return (
      <NavListItem key={i} to={sp.id}>
        {sp.name.concat(sp.inactive ? " (inactive)" : "")}
      </NavListItem>
    );
  });

  return (
    <>
      <Pane
        defaultWidth={currentRouteId === undefined ? "fill" : "20%"}
        paneTitle={
          <FormattedMessage id="ui-calendar.monthlyCalendarView.title" />
        }
      >
        <NavList>
          <NavListSection activeLink={currentRouteId}>
            {listItems}
          </NavListSection>
        </NavList>
      </Pane>
      <Route path="/settings/calendar/monthly/:servicePointId">
        <MonthlyCalendarView
          onClose={() => {
            history.push("/settings/calendar/monthly/");
          }}
          servicePoint={dataRepository.getServicePointsFromId(currentRouteId)}
          events={events[currentRouteId ?? ""]}
          requestEvents={requestEvents}
        />
      </Route>
    </>
  );
};

MonthlyCalendarPickerView.manifest = MANIFEST;

export default MonthlyCalendarPickerView;
