import { Icon, Pane } from "@folio/stripes-components";
import dayjsOrig from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";
import { getWeekdayRange } from "./CalendarUtils";
import { SERVICE_POINT_LIST } from "./MockConstants";
import css from "./Calendar.css";
import classNames from "classnames";

const dayjs = dayjsOrig.extend(customParseFormat).extend(localizedFormat);

/**
 * Used for comparison to ensure hours are properly sorted.
 * Used for when an opening spans multiple days; this will fully replace an opening or closing
 * for a given day
 */
const NEXT_DAY_FULL_WRAPAROUND = "-";

/**
 * Used for when an opening spans part of a night (as determined by {@code OVERNIGHT_THRESHOLD}),
 * such as if something is open until 1AM.  Instead of a full replacement, this is appended
 * to an end time (will be parsed out in rendering).
 */
const NEXT_DAY_OVERNIGHT = "*";

/**
 * The time at which a closure is considered the next day, rather than the current day
 * This will be compared lexicographically.
 *
 * For example, with threshold of "04:00", if an opening is Monday 13:00 - Tuesday 02:00
 * then it will show:
 *   Monday: 13:00 to 02:00* (with * denoting next day)
 *   Tuesday: closed
 *
 * If it was Monday 13:00 - Tuesday 06:00, then:
 *   Monday: 13:00 to -- (with -- denoting it does not close on Monday)
 *   Tuesday: -- to 06:00 (with -- denoting it was already open)
 *
 * The idea of this is to reduce confusion with instances where, for example, a library
 * is frequently open until 1am the next morning.
 */
const OVERNIGHT_THRESHOLD = "04:00";

function splitOpeningsIntoDays(openings) {
  // TODO: localize start of week
  const hours = {
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  };

  openings.forEach(({ startDay, startTime, endDay, endTime }) => {
    const span = getWeekdayRange(startDay, endDay);

    // if the closing time should be considered overnight on the previous day,
    // rather than a full additional day of opening
    if (span.length > 1 && endTime <= OVERNIGHT_THRESHOLD) {
      span.pop();
      endTime += NEXT_DAY_OVERNIGHT; // append to denote next day
    }

    span.forEach((day, i) => {
      const bounds = [NEXT_DAY_FULL_WRAPAROUND, NEXT_DAY_FULL_WRAPAROUND];
      if (i === 0) {
        bounds[0] = startTime;
      }
      if (i === span.length - 1) {
        bounds[1] = endTime;
      }

      hours[day].push(bounds);
    });
  });

  return hours;
}

/**
 * Used for sorting a series of opening tuples for a day.  These tuples may contain
 * {@code NEXT_DAY_FULL_WRAPAROUND} as appropriate
 * @param {[string, string]} a A tuple of open/close times
 * @param {[string, string]} b A tuple of open/close times
 * @returns -1, 0, or 1 depending on comparison result
 */
function openingSorter(a, b) {
  // A wrapped from previous day or B wraps to next day
  if (a[0] === NEXT_DAY_FULL_WRAPAROUND || b[1] === NEXT_DAY_FULL_WRAPAROUND)
    return -1;
  // B wrapped from previous day or A wraps to next day
  if (b[0] === NEXT_DAY_FULL_WRAPAROUND || a[1] === NEXT_DAY_FULL_WRAPAROUND)
    return 1;
  return a[0].localeCompare(b[0]);
}

/**
 * Format a time into the user's locale
 * @param {*} time HH:mm time
 */
function localizeTime(time) {
  return dayjs(time, "HH:mm").format("LT");
}
/**
 * Format a date (any format) into the user's locale
 * @param {*} date
 */
function localizeDate(date) {
  return dayjs(date).format("LL");
}

export default function MonthlyCalendarView(props) {
  const [events, setEvents] = useState(
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
            <span className={classNames(css.icon, css.opening)}>
              <Icon icon="exclamation-circle"></Icon>
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
            <span className={classNames(css.icon, css.closure)}>
              <Icon icon="exclamation-circle"></Icon>
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

  if (servicePoint === undefined || servicePoint === null) {
    return null;
  }

  useEffect(async () => {
    // TODO: do some fetching
    setEvents(events);
  }, [props.monthBasis, props.servicePointId]);

  return (
    <Pane
      paneTitle={servicePoint.label}
      defaultWidth="fill"
      centerContent={true}
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
}
