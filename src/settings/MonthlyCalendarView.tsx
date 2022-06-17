import { Icon, Pane } from "@folio/stripes-components";
import classNames from "classnames";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import Calendar from "./Calendar";
import css from "./Calendar.css";
import { SERVICE_POINT_LIST } from "./MockConstants";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

interface MonthlyCalendarViewProps {
  onClose: () => void;
  servicePointId: string;
  monthBasis: Dayjs;
  setMonthBasis: React.Dispatch<Dayjs>;
}

export const MonthlyCalendarView: FunctionComponent<
  MonthlyCalendarViewProps
> = (props: MonthlyCalendarViewProps) => {
  const [events, setEvents] = useState<
    Record<string, Record<string, ReactNode>>
  >(
    {
      "43194c57-5af8-5626-b4e5-e2ba9fa2d9a4": {
        "2022-04-24": <p className={css.closed}>Closed</p>,
        "2022-04-25": <p>9:00&nbsp;AM &ndash; 1:00&nbsp;AM&nbsp;*</p>,
        "2022-04-26": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,
        "2022-04-27": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,
        "2022-04-28": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,
        "2022-04-29": (
          <>
            <p>9:00&nbsp;AM &ndash; 12:00&nbsp;PM</p>
            <p>1:30&nbsp;PM &ndash; 8:00&nbsp;PM</p>
          </>
        ),
        "2022-04-30": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,

        "2022-05-01": <p className={css.closed}>Closed</p>,
        "2022-05-02": <p>9:00&nbsp;AM &ndash; 1:00&nbsp;AM&nbsp;*</p>,
        "2022-05-03": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,
        "2022-05-04": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,
        "2022-05-05": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,
        "2022-05-06": (
          <>
            <p>9:00&nbsp;AM &ndash; 12:00&nbsp;PM</p>
            <p>1:30&nbsp;PM &ndash; 8:00&nbsp;PM</p>
          </>
        ),
        "2022-05-07": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,

        "2022-05-08": <p className={css.closed}>Closed</p>,
        "2022-05-09": <p>9:00&nbsp;AM &ndash; 1:00&nbsp;AM&nbsp;*</p>,
        "2022-05-10": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,
        "2022-05-11": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,
        "2022-05-12": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,
        "2022-05-13": (
          <>
            <p>7:00&nbsp;AM &ndash; 11:59&nbsp;PM</p>
            <span className={classNames(css.icon)}>
              <Icon icon="exclamation-circle" status="warn" />
            </span>
          </>
        ),
        "2022-05-14": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,
        "2022-05-15": <p className={css.closed}>Closed</p>,
        "2022-05-16": <p>9:00&nbsp;AM &ndash; 1:00&nbsp;AM&nbsp;*</p>,
        "2022-05-17": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,
        "2022-05-18": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,
        "2022-05-19": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,
        "2022-05-20": (
          <>
            <p>9:00&nbsp;AM &ndash; 12:00&nbsp;PM</p>
            <p>1:30&nbsp;PM &ndash; 8:00&nbsp;PM</p>
          </>
        ),
        "2022-05-21": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,
        "2022-05-22": <p className={css.closed}>Closed</p>,
        "2022-05-23": <p>9:00&nbsp;AM &ndash; 1:00&nbsp;AM&nbsp;*</p>,
        "2022-05-24": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,
        "2022-05-25": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,
        "2022-05-26": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,
        "2022-05-27": (
          <>
            <p>9:00&nbsp;AM &ndash; 12:00&nbsp;PM</p>
            <p>1:30&nbsp;PM &ndash; 8:00&nbsp;PM</p>
          </>
        ),
        "2022-05-28": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,
        "2022-05-29": <p className={css.closed}>Closed</p>,
        "2022-05-30": <p>9:00&nbsp;AM &ndash; 1:00&nbsp;AM&nbsp;*</p>,
        "2022-05-31": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,
        "2022-06-01": (
          <>
            <p className={css.closed}>Closed</p>
            <span className={classNames(css.icon)}>
              <Icon icon="exclamation-circle" status="error" />
            </span>
          </>
        ),
        "2022-06-02": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,
        "2022-06-03": (
          <>
            <p>9:00&nbsp;AM &ndash; 12:00&nbsp;PM</p>
            <p>1:30&nbsp;PM &ndash; 8:00&nbsp;PM</p>
          </>
        ),
        "2022-06-04": <p>9:00&nbsp;AM &ndash; 11:00&nbsp;PM</p>,
      },
      "60869fc6-10ee-53a4-9861-118b61bf4544": {},
      "3b071ddf-14ad-58a1-9fb5-b3737da888de": {},
      "c085c999-3600-5e06-a758-d052565f89fd": {},
      "7a5e720f-2dc2-523a-b77e-3c996578e241": {},
      "db775bbc-6a0b-537b-877a-34b2fd68d6d7": {},
    }
    // Object.assign(...SERVICE_POINT_LIST.map((sp) => ({ [sp.id]: {} })))
  );
  const servicePoint = SERVICE_POINT_LIST.filter(
    (sp) => sp.id === props.servicePointId
  )[0];

  useEffect(() => {
    (async () => {
      // TODO: do some fetching
      setEvents(events);
    })();
  }, [props.monthBasis, props.servicePointId, events]);

  if (servicePoint === undefined || servicePoint === null) {
    return null;
  }

  return (
    <Pane
      paneTitle={servicePoint.label}
      defaultWidth="fill"
      centerContent
      onClose={props.onClose}
      dismissible
      lastMenu={<div style={{ width: "24px" }} />} // properly center heading
    >
      <Calendar
        events={events[props.servicePointId]}
        monthBasis={props.monthBasis}
        setMonthBasis={props.setMonthBasis}
      />
    </Pane>
  );
};

export default MonthlyCalendarView;
