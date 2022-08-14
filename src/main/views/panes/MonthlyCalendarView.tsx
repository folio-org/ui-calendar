import { Pane } from "@folio/stripes-components";
import type { Dayjs } from "dayjs";
import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useIntl } from "react-intl";
import Calendar, { getDateArray } from "../../components/Calendar";
import { ServicePoint } from "../../types/types";
import dayjs from "../../utils/dayjs";
import { useLocaleWeekdays } from "../../utils/WeekdayUtils";

interface MonthlyCalendarViewProps {
  onClose: () => void;
  servicePoint?: ServicePoint;
  events: Record<string, ReactNode>;
  requestEvents: (
    startDate: Dayjs,
    endDate: Dayjs,
    servicePointId: string
  ) => Promise<void>;
}

export const MonthlyCalendarView: FunctionComponent<
  MonthlyCalendarViewProps
> = ({
  onClose,
  servicePoint,
  events,
  requestEvents,
}: MonthlyCalendarViewProps) => {
  const [monthBasis, setMonthBasis] = useState(dayjs().startOf("month")); // start at current date
  const localeWeekdays = useLocaleWeekdays(useIntl());

  useEffect(() => {
    (async () => {
      if (servicePoint === undefined) {
        return;
      }
      const dateArray = getDateArray(monthBasis, localeWeekdays);
      if (events === undefined) {
        requestEvents(
          dateArray[0],
          dateArray[dateArray.length - 1],
          servicePoint?.id
        );
        return;
      }

      const missingDates = dateArray.map(
        (date) => !(date.format("YYYY-MM-DD") in events)
      );
      const rangeStartIndex = missingDates.indexOf(true);
      // none missing
      if (rangeStartIndex === -1) return;

      requestEvents(
        dateArray[rangeStartIndex],
        dateArray[missingDates.lastIndexOf(true)],
        servicePoint?.id
      );
    })();
  }, [monthBasis, servicePoint, events, requestEvents, localeWeekdays]);

  if (servicePoint === undefined) {
    return null;
  }

  return (
    <Pane
      paneTitle={servicePoint.name}
      defaultWidth="fill"
      centerContent
      onClose={onClose}
      dismissible
      lastMenu={<div style={{ width: "24px" }} />} // properly center heading
    >
      <Calendar
        events={events ?? {}}
        monthBasis={monthBasis}
        setMonthBasis={setMonthBasis}
      />
    </Pane>
  );
};

export default MonthlyCalendarView;
