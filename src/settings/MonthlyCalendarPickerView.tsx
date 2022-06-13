import {
  Pane,
  NavList,
  NavListItem,
  NavListSection,
} from "@folio/stripes-components";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import localizedFormat from "dayjs/plugin/localizedFormat";
import weekday from "dayjs/plugin/weekday";
import React, { FunctionComponent, useState } from "react";
import { Route, useHistory, useRouteMatch } from "react-router-dom";
import { SERVICE_POINT_LIST } from "./MockConstants";
import MonthlyCalendarView from "./MonthlyCalendarView";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(weekday);
dayjs.extend(isSameOrBefore);

export const MonthlyCalendarPickerView: FunctionComponent<{}> = () => {
  const [monthBasis, setMonthBasis] = useState(dayjs().startOf("month")); // start at current date
  const currentRouteId = useRouteMatch<{
    servicePointId: string;
  }>("/settings/calendar/monthly/:servicePointId")?.params?.servicePointId;
  const history = useHistory();

  const listItems = SERVICE_POINT_LIST.map((sp, i) => {
    return (
      <NavListItem key={i} to={sp.id} onClick={() => setMonthBasis(dayjs())}>
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
        {currentRouteId && (
          <MonthlyCalendarView
            onClose={() => {
              history.push(`/settings/calendar/monthly/`);
            }}
            servicePointId={currentRouteId}
            monthBasis={monthBasis}
            setMonthBasis={setMonthBasis}
          />
        )}
      </Route>
    </>
  );
};
