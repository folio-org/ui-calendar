import { Timepicker } from '@folio/stripes/components';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import dayjs from '../../utils/dayjs';
import css from './hiddenErrorField.css';

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
  onChange
}: TimeFieldProps) {
  if (!display) return null;

  let valueWithSuffix = value;
  if (valueWithSuffix !== undefined && !valueWithSuffix.endsWith('Z')) {
    valueWithSuffix += 'Z';
  }

  return (
    <div
      className={classNames(css.hiddenErrorFieldWrapper, className)}
      title={error?.toString()}
    >
      <Timepicker
        required
        value={valueWithSuffix}
        onChange={(_e, newTime) => {
          onChange(newTime?.substring(0, 5));
          onBlur();
        }}
        inputRef={inputRef}
        marginBottom0
        usePortal
        meta={{
          touched: true,
          error
        }}
        parser={(time, _timezone, timeFormat) => {
          if (!time) return '';

          if (time.endsWith('Z')) {
            return dayjs.utc(time, 'HH:mm').format(timeFormat);
          }

          if (dayjs.utc(time, timeFormat).isValid()) {
            return dayjs.utc(time, timeFormat).format(timeFormat);
          }

          return time;
        }}
        timeZone="UTC"
      />
    </div>
  );
}
