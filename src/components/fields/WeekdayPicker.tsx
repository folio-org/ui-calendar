import { Select, SelectOptionType } from '@folio/stripes/components';
import React, { FunctionComponent, ReactNode, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Weekday } from '../../types/types';
import { useLocaleWeekdays } from '../../utils/WeekdayUtils';
import css from './WeekdayPicker.css';

export interface WeekdayPickerProps {
  value: Weekday | undefined;
  onChange?: (newValue: Weekday | undefined) => void;
  error?: ReactNode;
}

export const WeekdayPicker: FunctionComponent<WeekdayPickerProps> = (
  props: WeekdayPickerProps
) => {
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
      <Select<Weekday | undefined>
        required
        fullWidth
        marginBottom0
        dataOptions={options}
        value={props.value}
        onChange={(e) => {
          if (props.onChange) {
            const value = (e.target as HTMLSelectElement).value;
            props.onChange(value === '' ? undefined : (value as Weekday));
          }
        }}
        error={props.error}
      />
    </div>
  );
};

export default WeekdayPicker;
