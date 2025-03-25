import { Timepicker } from '@folio/stripes/components';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import css from './hiddenErrorField.css';

export interface TimeFieldProps {
  display: boolean;
  value: [string, string | null] | undefined;
  inputRef: (el: HTMLInputElement) => void;
  error: ReactNode;
  onBlur: () => void;
  onChange: (newValue: [string, string | null] | undefined) => void;
  className?: string;
}

export default function TimeField({
  value,
  display,
  inputRef,
  error,
  onBlur,
  className,
  onChange,
}: TimeFieldProps) {
  if (!display) return null;

  return (
    <div className={classNames(css.hiddenErrorFieldWrapper, className)}>
      <Timepicker
        required
        timeZone="UTC"
        value={value?.[0]}
        onChange={(_, newValue, inputValue) => {
          onChange([newValue, inputValue]);
          onBlur(); // re-perform validation
        }}
        onInput={onBlur}
        onBlur={onBlur}
        inputRef={inputRef}
        useInput
        error={error}
      />
    </div>
  );
}
