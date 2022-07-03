import { Select } from "@folio/stripes-components";
import React from "react";
import { FormattedMessage } from "react-intl";
import RowType from "./RowType";

export interface OpenClosedSelectProps {
  value: RowType;
  onBlur: () => void;
  onChange: (newData: { type: RowType }) => void;
}

export default function OpenClosedSelect({
  value,
  onBlur,
  onChange,
}: OpenClosedSelectProps) {
  return (
    <Select<RowType>
      required
      fullWidth
      marginBottom0
      dataOptions={[
        {
          value: RowType.Open,
          label: (
            <FormattedMessage id="ui-calendar.calendarForm.openClosedSelect.open" />
          ),
        },
        {
          value: RowType.Closed,
          label: (
            <FormattedMessage id="ui-calendar.calendarForm.openClosedSelect.closed" />
          ),
        },
      ]}
      value={value}
      onInput={(e) => {
        const newType = (e.target as HTMLSelectElement).value as RowType;
        const newProps: { type: RowType } = {
          type: newType,
        };
        onChange(newProps);
        onBlur();
      }}
    />
  );
}
