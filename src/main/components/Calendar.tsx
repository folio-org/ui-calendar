import { Headline, IconButton, Loading } from '@folio/stripes-components';
import classNames from 'classnames';
import type { Dayjs } from 'dayjs';
import memoizee from 'memoizee';
import React, { FunctionComponent, ReactNode } from 'react';
import { FormattedDate, useIntl } from 'react-intl';
import { CSSPropertiesWithVars } from '../types/css';
import {
  getFirstDayOfWeek,
  LocaleWeekdayInfo,
  useLocaleWeekdays,
  WEEKDAYS,
} from '../utils/WeekdayUtils';
import css from './Calendar.css';

function isSameMonthOrBefore(a: Dayjs, b: Dayjs): boolean {
  return a.isSameOrBefore(b, 'month');
}

function isSameMonth(a: Dayjs, b: Dayjs): boolean {
  return a.isSame(b, 'month');
}

export const getDateArray = memoizee(
  (
    locale: string,
    monthBasis: Dayjs,
    localeWeekdays: LocaleWeekdayInfo[]
  ): Dayjs[] => {
    // start
    let date = monthBasis.startOf('month');
    // if the month starts at the beginning of the week, add a full row above of the previous month
    if (date.weekday() === getFirstDayOfWeek(locale)) {
      date = date.subtract(1, 'week');
    }

    const firstWeekday = WEEKDAYS[localeWeekdays[0].weekday];

    // ensure startDate starts at the beginning of a week
    date = date.subtract((date.day() - firstWeekday + 7) % 7, 'days');

    // at this point, date must be in a month before `month`.

    // generate this month to the next
    const displayDates = [];
    let week = [];
    do {
      week.push(date);
      date = date.add(1, 'day');
      if (week.length === 7) {
        displayDates.push(...week);
        week = [];
      }
    } while (isSameMonthOrBefore(date, monthBasis));

    while (week.length < 7) {
      week.push(date);
      date = date.add(1, 'day');
    }
    displayDates.push(...week);

    return displayDates;
  }
);

const getWeekdayLabels = memoizee(
  (localeWeekdays: LocaleWeekdayInfo[]): ReactNode[] => {
    return localeWeekdays.map((w, i) => (
      <div key={i} className={css.weekdayLabel}>
        <span>{w.short}</span>
      </div>
    ));
  }
);

interface Props {
  monthBasis: Dayjs;
  setMonthBasis: React.Dispatch<Dayjs>;
  events: Record<string, ReactNode>;
}

const Calendar: FunctionComponent<Props> = (props: Props) => {
  const { monthBasis, setMonthBasis, events } = props;
  const intl = useIntl();
  const localeWeekdays = useLocaleWeekdays(intl);

  const displayDates = getDateArray(
    intl.locale,
    monthBasis,
    localeWeekdays
  ).map((date: Dayjs) => {
    const dateString = date.format('YYYY-MM-DD');
    let contents: ReactNode = <Loading />;
    if (dateString in events) {
      contents = events[dateString];
    }

    return (
      <div
        className={classNames(
          isSameMonth(date, monthBasis) ? '' : css.adjacentMonth,
          css.calendarDay
        )}
      >
        <span key={dateString} className={css.dayLabel}>
          <FormattedDate value={date.toDate()} day="numeric" />
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
          '--num-main-cal-rows': displayDates.length / 7,
        } as CSSPropertiesWithVars
      }
    >
      <div key="header" className={css.headerRow}>
        <IconButton
          icon="arrow-left"
          onClick={() => setMonthBasis(monthBasis.subtract(1, 'month'))}
        />
        <Headline size="xx-large" margin="none">
          <FormattedDate
            value={monthBasis.toDate()}
            month="long"
            year="numeric"
          />
        </Headline>
        <IconButton
          icon="arrow-right"
          onClick={() => setMonthBasis(monthBasis.add(1, 'month'))}
        />
      </div>
      {getWeekdayLabels(localeWeekdays)}
      {displayDates}
    </div>
  );
};

export default Calendar;
