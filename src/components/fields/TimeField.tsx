import { Timepicker } from '@folio/stripes/components';
import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import dayjs from '../../utils/dayjs';
import css from './hiddenErrorField.css';

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
  className?: string;
}

export default function TimeField({
  value,
  display,
  inputRef,
  localeTimeFormat,
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
          onChange: (newTime: string) => {
            const input = internalRef;
            if (input !== null) {
              const selection = input.selectionStart;
              input.value = dayjs(newTime, 'HH:mm').format(localeTimeFormat);
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
