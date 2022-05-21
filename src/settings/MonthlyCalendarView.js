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
import dayjsOrig from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import React from "react";
import { getWeekdayRange, isOpen247, WEEKDAY_STRINGS } from "./CalendarUtils";

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
  const calendar = props.calendar;

  if (calendar === undefined || calendar === null) {
    return null;
  }

  const hours = splitOpeningsIntoDays(calendar.openings);

  Object.keys(hours).forEach((day) => {
    hours[day].sort(openingSorter);
  });

  let dataRows;
  if (isOpen247(calendar.openings)) {
    dataRows = get247Rows();
  } else {
    dataRows = generateDisplayRows(hours);
  }

  const exceptions = {
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
      centerContent={true}
      onClose={props.onClose}
      dismissible
      actionMenu={({ onToggle }) => (
        <>
          <MenuSection label="Actions">
            <Button buttonStyle="dropdownItem" onClick={onToggle}>
              <Icon size="small" icon="edit">
                Edit
              </Icon>
            </Button>
            <Button buttonStyle="dropdownItem" onClick={onToggle}>
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
            items={calendar.servicePoints}
            listStyle="bullets"
            isEmptyMessage={
              <div className="closed">
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
              defaultClass + (column !== "day" ? " hours-cell" : " day-cell")
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
              !isOpen247(calendar.openings) && containsNextDayOvernight(hours)
                ? ""
                : "hidden"
            }
          >
            *&nbsp;indicates next day
          </p>
          <p
            className={
              !isOpen247(calendar.openings) && containsFullOvernightSpans(hours)
                ? ""
                : "hidden"
            }
          >
            &ndash;&nbsp;indicates that the service point was already open or
            does not close
          </p>
          <p className={isOpen247(calendar.openings) ? "" : "hidden"}>
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
              defaultClass +
              (column !== "name" ? " hours-cell exception-cell" : " day-cell")
            }
            contentData={generateExceptionalOpeningRows(exceptions.openings)}
            isEmptyMessage={
              <div className="closed">
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
              startDate: exception.startDate,
              endDate: exception.endDate,
            }))}
            isEmptyMessage={
              <div className="closed">
                This calendar has no exceptional closures.
              </div>
            }
          />
        </Accordion>
      </AccordionSet>
    </Pane>
  );
}
