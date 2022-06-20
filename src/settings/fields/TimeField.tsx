import { Timepicker } from "@folio/stripes-components";
import dayjs from "dayjs";
import React from "react";
import { FieldRenderProps } from "react-final-form";
import css from "./HoursOfOperationField.css";
import { HoursOfOperationRowState } from "./HoursOfOperationFieldTypes";
import RowType from "./RowType";

function noOp() {
  /* no-op */
}

export interface TimeFieldProps<RowState extends HoursOfOperationRowState>
  extends FieldRenderProps<RowState[]> {
  i: number;
  row: RowState;
  rowKey: "startTime" | "endTime";
  rowStateUpdater: (
    rowIndex: number,
    newState: Partial<HoursOfOperationRowState>
  ) => void;
  timeFieldRefs: {
    startTime: Record<number, HTMLInputElement>;
    endTime: Record<number, HTMLInputElement>;
  };
  localeTimeFormat: string;
}

export default function TimeField<RowState extends HoursOfOperationRowState>({
  i,
  row,
  rowKey,
  rowStateUpdater,
  timeFieldRefs,
  localeTimeFormat,
  ...props
}: TimeFieldProps<RowState>) {
  if (row.type === RowType.Closed) return null;

  const error =
    props.meta.touched &&
    (props.error?.empty?.[rowKey]?.[i] ||
      props.error?.invalidTimes?.[rowKey]?.[i]);

  return (
    <div className={css.timeFieldWrapper} title={error?.toString()}>
      <Timepicker
        required
        input={{
          value: row[rowKey] === undefined ? "" : (row[rowKey] as string),
          name: "",
          onBlur: noOp,
          onFocus: noOp,
          onChange: (newTime: string) => {
            const input = timeFieldRefs[rowKey][i];
            const selection = input.selectionStart;
            input.value = dayjs(newTime, "HH:mm").format(localeTimeFormat);
            input.setSelectionRange(selection, selection);
            rowStateUpdater(i, {
              [rowKey]: newTime.length ? newTime.substring(0, 5) : undefined,
            });
          },
        }}
        // always fires, compared to input.onChange
        onChange={() => props.input.onBlur()}
        inputRef={(el) => {
          timeFieldRefs[rowKey][i] = el;
        }}
        marginBottom0
        usePortal
        meta={{
          touched: true,
          error,
        }}
      />
    </div>
  );
}
