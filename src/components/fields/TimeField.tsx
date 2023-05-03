import { Timepicker } from '@folio/stripes/components';
import classNames from 'classnames';
import React from 'react';
import { Field } from 'react-final-form';
import css from './hiddenErrorField.css';

export interface TimeFieldProps {
  display: boolean;
  name: string;
  className?: string;
}

export default function TimeField({
  display,
  name,
  className,
}: TimeFieldProps) {
  if (!display) return null;

  return (
    <div className={classNames(css.hiddenErrorFieldWrapper, className)}>
      <Field
        name={name}
        component={Timepicker}
        required
        marginBottom0
        usePortal
        timeZone="UTC"
      />
    </div>
  );
}
