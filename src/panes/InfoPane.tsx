import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  Headline,
  Icon,
  List,
  MenuSection,
  MultiColumnList,
  Pane,
  Row,
} from "@folio/stripes-components";
import classNames from "classnames";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import React, { FunctionComponent, ReactNode } from "react";
import {
  Calendar,
  CalendarException,
  CalendarOpening,
  Weekday,
} from "../types/types";
import {
  getLocalizedDate,
  getLocalizedTime,
  getWeekdayRange,
  isOpen247,
  WEEKDAY_INDEX,
  WEEKDAY_STRINGS,
} from "../data/CalendarUtils";
import DataRepository from "../data/DataRepository";
import css from "./InfoPane.css";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

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

type OpenCloseTimeTuple = [string, string];
type HoursType = Record<Weekday, OpenCloseTimeTuple[]>;

function splitOpeningsIntoDays(openings: CalendarOpening[]): HoursType {
  // TODO: localize start of week
  const hours: HoursType = {
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  };

  openings.forEach((opening) => {
    const { startDay, startTime, endDay } = opening;
    let { endTime } = opening;
    const span = getWeekdayRange(startDay, endDay);

    // if the closing time should be considered overnight on the previous day,
    // rather than a full additional day of opening
    if (span.length > 1 && endTime <= OVERNIGHT_THRESHOLD) {
      span.pop();
      endTime += NEXT_DAY_OVERNIGHT; // append to denote next day
    }

    span.forEach((day, i) => {
      const bounds: OpenCloseTimeTuple = [
        NEXT_DAY_FULL_WRAPAROUND,
        NEXT_DAY_FULL_WRAPAROUND,
      ];
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
 * @param a A tuple of open/close times
 * @param b A tuple of open/close times
 * @return -1, 0, or 1 depending on comparison result
 */
function openingSorter(a: OpenCloseTimeTuple, b: OpenCloseTimeTuple) {
  // A wrapped from previous day or B wraps to next day
  if (a[0] === NEXT_DAY_FULL_WRAPAROUND || b[1] === NEXT_DAY_FULL_WRAPAROUND) {
    return -1;
  }
  // B wrapped from previous day or A wraps to next day
  if (b[0] === NEXT_DAY_FULL_WRAPAROUND || a[1] === NEXT_DAY_FULL_WRAPAROUND) {
    return 1;
  }
  return a[0].localeCompare(b[0]);
}

/**
 * Format a time into the user's locale
 * @param time HH:mm time
 */
function localizeTime(time: string) {
  return dayjs(time, "HH:mm").format("LT");
}
/**
 * Format a date (any format) into the user's locale
 * @param date
 */
function localizeDate(date: string) {
  return dayjs(date).format("LL");
}

function get247Rows() {
  return WEEKDAY_INDEX.map((day, i) => ({
    day: WEEKDAY_STRINGS[day],
    startTime: (
      <p key={i} title="The service point does not close">
        &ndash;
      </p>
    ),
    endTime: (
      <p key={i} title="The service point does not close">
        &ndash;
      </p>
    ),
  }));
}

function generateDisplayRows(hours: HoursType) {
  return WEEKDAY_INDEX.map((day) => {
    const tuples = hours[day];
    const times: {
      startTime: ReactNode[];
      endTime: ReactNode[];
    } = {
      startTime: [],
      endTime: [],
    };

    if (tuples.length === 0) {
      times.startTime.push(<p className={css.closed}>Closed</p>);
    }

    tuples.forEach(([open, close], i) => {
      if (open === NEXT_DAY_FULL_WRAPAROUND) {
        times.startTime.push(
          <p
            key={i}
            title="The service point does not close on the previous night"
          >
            &ndash;
          </p>
        );
      } else {
        times.startTime.push(<p key={i}>{localizeTime(open)}</p>);
      }
      if (close === NEXT_DAY_FULL_WRAPAROUND) {
        times.endTime.push(
          <p key={i} title="The service point does not close on this night">
            &ndash;
          </p>
        );
      } else if (close.endsWith(NEXT_DAY_OVERNIGHT)) {
        times.endTime.push(
          <p key={i} title="Closes on the next day">
            {localizeTime(close.replace(NEXT_DAY_OVERNIGHT, ""))}&nbsp;*
          </p>
        );
      } else {
        times.endTime.push(<p key={i}>{localizeTime(close)}</p>);
      }
    });

    return {
      day: WEEKDAY_STRINGS[day],
      startTime: <>{times.startTime}</>,
      endTime: <>{times.endTime}</>,
    };
  });
}

function generateExceptionalOpeningRows(exceptions: CalendarException[]) {
  return exceptions.map((exception) => {
    const times: {
      start: ReactNode[];
      end: ReactNode[];
    } = {
      start: [],
      end: [],
    };

    exception.openings.forEach(
      ({ startDate, startTime, endDate, endTime }, i) => {
        const start = dayjs(`${startDate} ${startTime}`);
        const end = dayjs(`${endDate} ${endTime}`);
        times.start.push(
          <p key={i}>
            {getLocalizedDate(start)}
            <br />
            {getLocalizedTime(start)}
          </p>
        );
        times.end.push(
          <p key={i}>
            {getLocalizedDate(end)}
            <br />
            {getLocalizedTime(end)}
          </p>
        );
      }
    );

    return {
      name: exception.name,
      start: <>{times.start}</>,
      end: <>{times.end}</>,
    };
  });
}

/**
 * Used to detect when help text for * should be rendered.
 */
function containsNextDayOvernight(hours: HoursType) {
  for (const tuples of Object.values(hours)) {
    for (const tuple of tuples) {
      if (
        tuple[0].endsWith(NEXT_DAY_OVERNIGHT) ||
        tuple[1].endsWith(NEXT_DAY_OVERNIGHT)
      ) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Used to detect when help text for -- should be rendered.
 */
function containsFullOvernightSpans(hours: HoursType) {
  for (const tuples of Object.values(hours)) {
    for (const tuple of tuples) {
      if (
        tuple[0] === NEXT_DAY_FULL_WRAPAROUND ||
        tuple[1] === NEXT_DAY_FULL_WRAPAROUND
      ) {
        return true;
      }
    }
  }
  return false;
}

export interface InfoPaneProps {
  creationBasePath: string;
  editBasePath: string;
  calendar?: Calendar | null;
  onClose?: () => void;
  dataRepository: DataRepository;
}

export const InfoPane: FunctionComponent<InfoPaneProps> = (props) => {
  const calendar = props.calendar;

  if (calendar === undefined || calendar === null) {
    return null;
  }

  const hours = splitOpeningsIntoDays(calendar.normalHours);

  (Object.keys(hours) as Weekday[]).forEach((day) => {
    hours[day].sort(openingSorter);
  });

  let dataRows;
  if (isOpen247(calendar.normalHours)) {
    dataRows = get247Rows();
  } else {
    dataRows = generateDisplayRows(hours);
  }

  const exceptions: {
    openings: CalendarException[];
    closures: CalendarException[];
  } = {
    openings: [],
    closures: [],
  };

  calendar.exceptions.forEach((exception) => {
    if (exception.openings.length === 0) {
      exceptions.closures.push(exception);
    } else {
      exception.openings.sort((a, b) =>
        Math.sign(
          dayjs(`${a.startDate} ${a.endDate}`).diff(
            dayjs(`${b.startDate} ${b.endDate}`),
            "m"
          )
        )
      );
      exceptions.openings.push(exception);
    }
  });

  return (
    <Pane
      paneTitle={calendar.name}
      defaultWidth="fill"
      centerContent
      onClose={props.onClose}
      dismissible
      actionMenu={({ onToggle }) => (
        <>
          <MenuSection label="Actions">
            <Button
              buttonStyle="dropdownItem"
              onClick={onToggle}
              to={{
                pathname: `${props.editBasePath}/${calendar.id}`,
              }}
            >
              <Icon size="small" icon="edit">
                Edit
              </Icon>
            </Button>
            <Button
              buttonStyle="dropdownItem"
              onClick={onToggle}
              to={{
                pathname: props.creationBasePath,
                search: new URLSearchParams({
                  source: calendar.id as string,
                }).toString(),
              }}
            >
              <Icon size="small" icon="duplicate">
                Duplicate
              </Icon>
            </Button>
            <Button buttonStyle="dropdownItem" onClick={onToggle}>
              <Icon size="small" icon="trash">
                Delete
              </Icon>
            </Button>
          </MenuSection>
        </>
      )}
    >
      <Headline size="x-large" margin="xx-small">
        {calendar.name}
      </Headline>
      From {localizeDate(calendar.startDate)} to{" "}
      {localizeDate(calendar.endDate)}
      <AccordionSet>
        <Row end="xs">
          <Col xs>
            <ExpandAllButton />
          </Col>
        </Row>
        <Accordion label="Service point assignments">
          <List
            items={props.dataRepository.getServicePointNamesFromIds(
              calendar.assignments
            )}
            listStyle="bullets"
            isEmptyMessage={
              <div className={css.closed}>
                This calendar is not assigned to any service points.
              </div>
            }
          />
        </Accordion>
        <Accordion label="Hours of operation">
          <MultiColumnList
            interactive={false}
            onHeaderClick={() => ({})}
            getCellClass={(defaultClass, _rowData, column) =>
              classNames(defaultClass, {
                [css.hoursCell]: column !== "day",
                [css.dayCell]: column === "day",
              })
            }
            columnMapping={{
              day: "Day",
              startTime: "Open",
              endTime: "Close",
            }}
            columnWidths={{
              day: "40%",
              startTime: "30%",
              endTime: "30%",
            }}
            contentData={dataRows}
          />
          <p
            className={
              !isOpen247(calendar.normalHours) &&
              containsNextDayOvernight(hours)
                ? ""
                : css.hidden
            }
          >
            *&nbsp;indicates next day
          </p>
          <p
            className={
              !isOpen247(calendar.normalHours) &&
              containsFullOvernightSpans(hours)
                ? ""
                : css.hidden
            }
          >
            &ndash;&nbsp;indicates that the service point was already open or
            does not close
          </p>
          <p className={isOpen247(calendar.normalHours) ? "" : css.hidden}>
            This service point is open 24/7 and does not close
          </p>
        </Accordion>
        <Accordion label="Exceptions &mdash; openings">
          <MultiColumnList
            interactive={false}
            onHeaderClick={() => ({})}
            columnMapping={{
              name: "Name",
              start: "Start",
              end: "End",
            }}
            columnWidths={{
              name: "40%",
              start: "30%",
              end: "30%",
            }}
            getCellClass={(defaultClass, _rowData, column) =>
              classNames(defaultClass, {
                [css.hoursCell]: column !== "name",
                [css.exceptionCell]: column !== "name",
                [css.dayCell]: column === "name",
              })
            }
            contentData={generateExceptionalOpeningRows(exceptions.openings)}
            isEmptyMessage={
              <div className={css.closed}>
                This calendar has no exceptional openings.
              </div>
            }
          />
        </Accordion>
        <Accordion label="Exceptions &mdash; closures">
          <MultiColumnList
            interactive={false}
            onHeaderClick={() => ({})}
            columnMapping={{
              name: "Name",
              startDate: "Start",
              endDate: "End",
            }}
            columnWidths={{
              name: "40%",
              startDate: "30%",
              endDate: "30%",
            }}
            contentData={exceptions.closures.map((exception) => ({
              name: exception.name,
              startDate: getLocalizedDate(exception.startDate),
              endDate: getLocalizedDate(exception.endDate),
            }))}
            isEmptyMessage={
              <div className={css.closed}>
                This calendar has no exceptional closures.
              </div>
            }
          />
        </Accordion>
      </AccordionSet>
    </Pane>
  );
};

export default InfoPane;
