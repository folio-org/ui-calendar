import { Headline, IconButton, Loading } from "@folio/stripes-components";
import classNames from "classnames";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import localizedFormat from "dayjs/plugin/localizedFormat";
import weekday from "dayjs/plugin/weekday";
import memoizee from "memoizee";
import React, { FunctionComponent, ReactNode } from "react";
import { CSSPropertiesWithVars } from "../types/css";
import css from "./Calendar.css";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(weekday);
dayjs.extend(isSameOrBefore);

function isSameMonthOrBefore(a: Dayjs, b: Dayjs): boolean {
  return a.isSameOrBefore(b, "month");
}

function isSameMonth(a: Dayjs, b: Dayjs): boolean {
  return a.isSame(b, "month");
}

const getDateArray = memoizee((monthBasis: Dayjs): Dayjs[] => {
  // start
  let date = monthBasis.startOf("month");
  // if the month starts at the beginning of the week, add a full row above of the previous month
  if (date.weekday() === 0) {
    date = date.subtract(1, "week");
  }
  // ensure startDate starts at the beginning of a week
  date = date.subtract(date.weekday(), "days");

  // at this point, date must be in a month before `month`.

  // generate this month to the next
  const displayDates = [];
  let week = [];
  do {
    week.push(date);
    date = date.add(1, "day");
    if (week.length === 7) {
      displayDates.push(...week);
      week = [];
    }
  } while (isSameMonthOrBefore(date, monthBasis));

  while (week.length < 7) {
    week.push(date);
    date = date.add(1, "day");
  }
  displayDates.push(...week);

  return displayDates;
});

const getWeekdayLabels = memoizee((): ReactNode[] => {
  const results = [];

  let day = dayjs();
  for (let i = 0; i < 7; i++) {
    day = day.weekday(i);
    results.push(
      <div key={i} className={css.weekdayLabel}>
        <span>{day.format("ddd")}</span>
      </div>
    );
  }

  return results;
});

interface Props {
  monthBasis: Dayjs;
  setMonthBasis: React.Dispatch<Dayjs>;
  events: Record<string, ReactNode>;
}

const Calendar: FunctionComponent<Props> = (props: Props) => {
  const { monthBasis, setMonthBasis, events } = props;

  const displayDates = getDateArray(monthBasis).map((date: Dayjs) => {
    const dateString = date.format("YYYY-MM-DD");
    let contents: ReactNode = <Loading />;
    if (dateString in events) {
      contents = events[dateString];
    }

    return (
      <div
        className={classNames(
          isSameMonth(date, monthBasis) ? "" : css.adjacentMonth,
          css.calendarDay
        )}
      >
        <span key={dateString} className={css.dayLabel}>
          {date.format("D")}
        </span>
        {contents}
      </div>
    );
  });

  return (
    <div
      className={css.calendar}
      style={
        {
          "--num-main-cal-rows": displayDates.length / 7,
        } as CSSPropertiesWithVars
      }
    >
      <div key="header" className={css.headerRow}>
        <IconButton
          icon="arrow-left"
          badgeColor="red"
          badgeCount="foo"
          onClick={() => setMonthBasis(monthBasis.subtract(1, "month"))}
        />
        <Headline size="xx-large" margin="none">
          {monthBasis.format("MMMM YYYY")}
        </Headline>
        <IconButton
          icon="arrow-right"
          onClick={() => setMonthBasis(monthBasis.add(1, "month"))}
        />
      </div>
      {getWeekdayLabels()}
      {displayDates}
    </div>
  );
};

export default Calendar;
