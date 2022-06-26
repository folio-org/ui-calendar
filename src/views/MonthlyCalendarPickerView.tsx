import {
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
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import localizedFormat from "dayjs/plugin/localizedFormat";
import weekday from "dayjs/plugin/weekday";
import React, { useEffect, useState } from "react";
import { Route, useHistory, useRouteMatch } from "react-router-dom";
import DataRepository from "../data/DataRepository";
import { SERVICE_POINT_LIST } from "../data/MockConstants";
import MonthlyCalendarView from "../panes/MonthlyCalendarView";
import { MANIFEST, Resources } from "../data/SharedData";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(weekday);
dayjs.extend(isSameOrBefore);

export type MonthlyCalendarPickerViewProps = ConnectedComponentProps<Resources>;

const MonthlyCalendarPickerView: ConnectedComponent<
  MonthlyCalendarPickerViewProps,
  Resources
> = (props: MonthlyCalendarPickerViewProps) => {
  const [dataRepository, setDataRepository] = useState(
    new DataRepository(props.resources, props.mutator)
  );
  useEffect(
    () => setDataRepository(new DataRepository(props.resources, props.mutator)),
    [props.resources, props.mutator]
  );

  const [monthBasis, setMonthBasis] = useState(dayjs().startOf("month")); // start at current date
  const currentRouteId = useRouteMatch<{
    servicePointId: string;
  }>("/settings/calendar/monthly/:servicePointId")?.params?.servicePointId;
  const history = useHistory();

  if (!dataRepository.isLoaded()) {
    return <LoadingPane paneTitle="Service points" />;
  }

  const listItems = SERVICE_POINT_LIST.map((sp, i) => {
    return (
      <NavListItem key={i} to={sp.id} onClick={() => setMonthBasis(dayjs())}>
        {sp.name.concat(sp.inactive ? " (inactive)" : "")}
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
              history.push("/settings/calendar/monthly/");
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

MonthlyCalendarPickerView.manifest = MANIFEST;

export default MonthlyCalendarPickerView;
