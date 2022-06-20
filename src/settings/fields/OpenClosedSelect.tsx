import { Select } from "@folio/stripes-components";
import React from "react";
import { HoursOfOperationRowState } from "./HoursOfOperationFieldTypes";
import RowType from "./RowType";

export interface OpenClosedSelectProps {
  value: RowType;
  onBlur: () => void;
  onChange: (newData: Partial<HoursOfOperationRowState>) => void;
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
          label: "Open",
        },
        {
          value: RowType.Closed,
          label: "Closed",
        },
      ]}
      value={value}
      onInput={(e) => {
        const newType = (e.target as HTMLSelectElement).value as RowType;
        const newProps: Partial<HoursOfOperationRowState> = {
          type: newType,
        };
        if (newType === RowType.Closed) {
          newProps.startTime = undefined;
          newProps.endTime = undefined;
        }
        onChange(newProps);
        onBlur();
      }}
    />
  );
}
