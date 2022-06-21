import { Timepicker } from "@folio/stripes-components";
import dayjs from "dayjs";
import React, { ReactNode, useState } from "react";
import css from "./TimeField.css";

function noOp() {
  /* no-op */
}

export interface TimeFieldProps {
  display: boolean;
  value: string | undefined;
  inputRef: (el: HTMLInputElement) => void;
  localeTimeFormat: string;
  error: ReactNode;
  onBlur: () => void;
  onChange: (newValue: string | undefined) => void;
}

export default function TimeField({
  value,
  display,
  inputRef,
  localeTimeFormat,
  error,
  onBlur,
  ...props
}: TimeFieldProps) {
  const [internalRef, setInternalRef] = useState<HTMLInputElement | null>(null);

  if (!display) return null;

  return (
    <div className={css.timeFieldWrapper} title={error?.toString()}>
      <Timepicker
        required
        input={{
          value: value === undefined ? "" : (value as string),
          name: "",
          onBlur: noOp,
          onFocus: noOp,
          onChange: (newTime: string) => {
            const input = internalRef;
            if (input !== null) {
              const selection = input.selectionStart;
              input.value = dayjs(newTime, "HH:mm").format(localeTimeFormat);
              input.setSelectionRange(selection, selection);
            }
            props.onChange(
              newTime.length ? newTime.substring(0, 5) : undefined
            );
          },
        }}
        // always fires, compared to input.onChange
        onChange={() => onBlur()}
        inputRef={(r) => {
          setInternalRef(r);
          inputRef(r);
        }}
        marginBottom0
        usePortal
        placement="auto"
        meta={{
          touched: true,
          error,
        }}
      />
    </div>
  );
}
