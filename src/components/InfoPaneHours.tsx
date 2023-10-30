import { MultiColumnList } from '@folio/stripes/components';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Calendar } from '../types/types';
import {
  containsFullOvernightSpans,
  containsNextDayOvernight,
  generateDisplayRows,
  get247Rows,
  splitOpeningsIntoDays,
} from '../utils/InfoPaneUtils';
import { isOpen247 } from '../utils/CalendarUtils';
import { useLocaleWeekdays } from '../utils/WeekdayUtils';
import css from '../views/panes/InfoPane.css';

export default function InfoPaneHours({
  calendar,
}: {
  readonly calendar: Calendar;
}) {
  const intl = useIntl();
  const localeWeekdays = useLocaleWeekdays(intl);

  const hours = useMemo(
    () => splitOpeningsIntoDays(calendar.normalHours),
    [calendar],
  );

  const dataRows = useMemo(() => {
    if (isOpen247(calendar.normalHours)) {
      return get247Rows(intl, localeWeekdays);
    } else {
      return generateDisplayRows(intl, localeWeekdays, hours);
    }
  }, [hours, calendar, intl, localeWeekdays]);

  return (
    <>
      <MultiColumnList
        interactive={false}
        getCellClass={(defaultClass, _rowData, column) => {
          return classNames(defaultClass, {
            [css.hoursCell]: column !== 'day',
            [css.dayCell]: column === 'day',
          });
        }}
        columnMapping={{
          day: (
            <FormattedMessage id="ui-calendar.infoPane.accordion.hours.day" />
          ),
          startTime: (
            <FormattedMessage id="ui-calendar.infoPane.accordion.hours.open" />
          ),
          endTime: (
            <FormattedMessage id="ui-calendar.infoPane.accordion.hours.close" />
          ),
        }}
        columnWidths={{
          day: 200,
          startTime: { min: 100, max: 100 },
          endTime: { min: 100, max: 100 },
        }}
        contentData={dataRows}
      />
      <p
        className={
          !isOpen247(calendar.normalHours) && containsNextDayOvernight(hours)
            ? ''
            : css.hidden
        }
      >
        <FormattedMessage id="ui-calendar.infoPane.nextDayHelpText" />
      </p>
      <p
        className={
          !isOpen247(calendar.normalHours) && containsFullOvernightSpans(hours)
            ? ''
            : css.hidden
        }
      >
        <FormattedMessage id="ui-calendar.infoPane.overnightHelpText" />
      </p>
      <p className={isOpen247(calendar.normalHours) ? '' : css.hidden}>
        <FormattedMessage id="ui-calendar.infoPane.247HelpText" />
      </p>
    </>
  );
}
