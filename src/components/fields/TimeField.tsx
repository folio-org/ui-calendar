import { Timepicker } from '@folio/stripes/components';
import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import css from './hiddenErrorField.css';

function noOp() {
  /* no-op */
}

export interface TimeFieldProps {
  display: boolean;
  value: string | undefined;
  inputRef: (el: HTMLInputElement) => void;
  error: ReactNode;
  onBlur: () => void;
  onChange: (newValue: string | undefined) => void;
  className?: string;
}

export default function TimeField({
  value,
  display,
  inputRef,
  error,
  onBlur,
  className,
  ...props
}: TimeFieldProps) {
  const [internalRef, setInternalRef] = useState<HTMLInputElement | null>(null);

  if (!display) return null;

  return (
    <div
      className={classNames(css.hiddenErrorFieldWrapper, className)}
      title={error?.toString()}
    >
      <Timepicker
        required
        input={{
          value: value === undefined ? '' : value,
          name: '',
          onBlur: noOp,
          onFocus: noOp,
          onChange: (newTimeWithWeirdSpace: string) => {
            const newTime = newTimeWithWeirdSpace.replaceAll('\u202f', ' ');
            const input = internalRef;
            if (input !== null) {
              const selection = input.selectionStart;
              input.value = newTime;
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
        meta={{
          touched: true,
          error,
        }}
        timeZone="UTC"
      />
    </div>
  );
}
