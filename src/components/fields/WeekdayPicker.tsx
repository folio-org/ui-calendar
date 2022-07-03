import { Select } from "@folio/stripes-components";
import { OptionType } from "@folio/stripes-components/types/lib/Select/Select";
import React, { FunctionComponent, ReactNode, useMemo } from "react";
import { useIntl } from "react-intl";
import { getLocaleWeekdays } from "../../utils/WeekdayUtils";
import { Weekday } from "../../types/types";
import css from "./WeekdayPicker.css";

export interface WeekdayPickerProps {
  value: Weekday | undefined;
  onChange?: (newValue: Weekday | undefined) => void;
  error?: ReactNode;
}

export const WeekdayPicker: FunctionComponent<WeekdayPickerProps> = (
  props: WeekdayPickerProps
) => {
  const intl = useIntl();

  const options = useMemo(() => {
    const opts: OptionType<Weekday | undefined>[] = [
      {
        value: undefined,
        label: "",
      },
    ];
    getLocaleWeekdays(intl).forEach((weekday) =>
      opts.push({
        value: weekday.weekday,
        label: weekday.long,
      })
    );
    return opts;
  }, [intl]);

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
            props.onChange(value === "" ? undefined : (value as Weekday));
          }
        }}
        error={props.error}
      />
    </div>
  );
};

export default WeekdayPicker;
