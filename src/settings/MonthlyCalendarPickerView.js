import { Pane } from "@folio/stripes-components";
import {
  NavList,
  NavListItem,
  NavListSection,
} from "@folio/stripes/components";
import React from "react";
import { Route, useRouteMatch } from "react-router-dom";
import ErrorBoundary from "../ErrorBoundary";
import { SERVICE_POINT_LIST } from "./MockConstants";
import MonthlyCalendarView from "./MonthlyCalendarView";

export default function MonthlyCalendarPickerView() {
  const currentRouteId = useRouteMatch(
    "/settings/calendar/monthly/:servicePointId"
  )?.params?.servicePointId;

  const listItems = SERVICE_POINT_LIST.map((sp, i) => {
    return (
      <NavListItem key={i} to={sp.id}>
        {sp.label.concat(sp.inactive ? " (inactive)" : "")}
      </NavListItem>
    );
  });

  return (
    <>
      <Pane
        defaultWidth={currentRouteId === undefined ? "fill" : "20%"}
        paneTitle="Service points"
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
            history.push(`/settings/calendar/monthly/`);
          }}
          servicePointId={currentRouteId}
        />
      </Route>
    </>
  );
}
