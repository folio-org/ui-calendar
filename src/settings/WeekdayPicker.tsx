import { Select } from "@folio/stripes-components";
import { OptionType } from "@folio/stripes-components/types/lib/Select/Select";
import React, { FunctionComponent, useMemo } from "react";
import { Weekday } from "../types/types";
import { getLocaleWeekdays } from "./CalendarUtils";

export interface WeekdayPickerProps {
  value: Weekday | undefined;
  onChange: (newValue: Weekday) => void;
}

export const WeekdayPicker: FunctionComponent<WeekdayPickerProps> = (
  props: WeekdayPickerProps
) => {
  const options = useMemo(() => {
    const opts: OptionType<Weekday | undefined>[] = [
      {
        value: undefined,
        label: "",
      },
    ];
    getLocaleWeekdays().forEach((weekday) =>
      opts.push({
        value: weekday.weekday,
        label: weekday.long,
      })
    );
    return opts;
  }, []);

  return (
    <Select<Weekday | undefined>
      fullWidth
      marginBottom0
      dataOptions={options}
      value={props.value}
      onChange={(e) => {
        if (props.onChange) {
          props.onChange((e.target as HTMLSelectElement).value as Weekday);
        }
      }}
    />
  );
};

export default WeekdayPicker;
