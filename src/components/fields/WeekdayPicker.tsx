import { Select, SelectOptionType } from '@folio/stripes/components';
import React, { useMemo } from 'react';
import { Field } from 'react-final-form';
import { useIntl } from 'react-intl';
import { Weekday } from '../../types/types';
import { useLocaleWeekdays } from '../../utils/WeekdayUtils';
import css from './WeekdayPicker.css';

export default function WeekdayPicker({
  ariaLabel,
  name,
}: {
  ariaLabel: string;
  name: string;
}) {
  const intl = useIntl();
  const localeWeekdays = useLocaleWeekdays(intl);

  const options = useMemo(() => {
    const opts: SelectOptionType<Weekday | undefined>[] = [
      {
        value: undefined,
        label: '',
      },
    ];
    localeWeekdays.forEach((weekday) => {
      return opts.push({
        value: weekday.weekday,
        label: weekday.long,
      });
    });
    return opts;
  }, [localeWeekdays]);

  return (
    <div className={css.wrapper}>
      <Field
        name={name}
        render={(fieldProps) => (
          <Select<Weekday | undefined>
            {...fieldProps}
            aria-label={ariaLabel}
            required
            fullWidth
            marginBottom0
            dataOptions={options}
          />
        )}
      />
    </div>
  );
}
