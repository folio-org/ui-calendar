import { Headline, IconButton, Loading } from '@folio/stripes/components';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { FormattedDate, useIntl } from 'react-intl';
import { CSSPropertiesWithVars } from '../types/css';
import { getDateArray } from '../utils/CalendarUtils';
import { dateToYYYYMMDD, isSameMonth } from '../utils/DateUtils';
import { LocaleWeekdayInfo, useLocaleWeekdays } from '../utils/WeekdayUtils';
import css from './Calendar.css';

interface Props {
  monthBasis: Date;
  setMonthBasis: React.Dispatch<Date>;
  events: Record<string, ReactNode>;
}

export function getWeekdayLabels(
  localeWeekdays: LocaleWeekdayInfo[]
): ReactNode[] {
  return localeWeekdays.map((w, i) => (
    <div key={i} className={css.weekdayLabel}>
      <span>{w.short}</span>
    </div>
  ));
}

export default function Calendar(props: Props) {
  const { monthBasis, setMonthBasis, events } = props;
  const intl = useIntl();
  const localeWeekdays = useLocaleWeekdays(intl);

  const displayDates = getDateArray(intl.locale, monthBasis).map(
    (date: Date) => {
      const dateString = dateToYYYYMMDD(date);
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
          key={dateToYYYYMMDD(date)}
        >
          <span key="label" className={css.dayLabel}>
            <FormattedDate value={date} day="numeric" />
          </span>
          {contents}
        </div>
      );
    }
  );

  return (
    <div
      className={css.calendar}
      style={
        {
          '--num-main-cal-rows': displayDates.length / 7
        } as CSSPropertiesWithVars
      }
    >
      <div key="header" className={css.headerRow}>
        <IconButton
          icon="arrow-left"
          onClick={() => setMonthBasis(
            new Date(new Date(monthBasis).setMonth(monthBasis.getMonth() - 1))
          )
          }
        />
        <Headline size="xx-large" margin="none">
          <FormattedDate value={monthBasis} month="long" year="numeric" />
        </Headline>
        <IconButton
          icon="arrow-right"
          onClick={() => setMonthBasis(
            new Date(new Date(monthBasis).setMonth(monthBasis.getMonth() + 1))
          )
          }
        />
      </div>
      {getWeekdayLabels(localeWeekdays)}
      {displayDates}
    </div>
  );
}
