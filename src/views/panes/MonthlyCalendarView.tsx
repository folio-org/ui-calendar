import { Pane } from '@folio/stripes/components';
import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useState
} from 'react';
import { useIntl } from 'react-intl';
import Calendar from '../../components/Calendar';
import { ServicePoint } from '../../types/types';
import { getDateArray } from '../../utils/CalendarUtils';
import { dateUTCToYYYYMMDD } from '../../utils/DateUtils';
import { useLocaleWeekdays } from '../../utils/WeekdayUtils';

interface MonthlyCalendarViewProps {
  onClose: () => void;
  servicePoint?: ServicePoint;
  events: Record<string, ReactNode>;
  requestEvents: (
    startDate: Date,
    endDate: Date,
    servicePointId: string
  ) => Promise<void>;
}

export const MonthlyCalendarView: FunctionComponent<
  MonthlyCalendarViewProps
> = ({
  onClose,
  servicePoint,
  events,
  requestEvents
}: MonthlyCalendarViewProps) => {
  const [monthBasis, setMonthBasis] = useState(
    new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1))
  ); // start at current date
  const intl = useIntl();
  const localeWeekdays = useLocaleWeekdays(intl);

  useEffect(() => {
    (() => {
      if (servicePoint === undefined) {
        return;
      }
      const dateArray = getDateArray(intl.locale, monthBasis);
      if (events === undefined) {
        requestEvents(
          dateArray[0],
          dateArray[dateArray.length - 1],
          servicePoint?.id
        );
        return;
      }

      const missingDates = dateArray.map(
        (date) => !(dateUTCToYYYYMMDD(date) in events)
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
  }, [monthBasis, events, localeWeekdays, intl, servicePoint, requestEvents]);

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
      lastMenu={<div style={{ width: '24px' }} />} // properly center heading
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
