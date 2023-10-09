import { Select } from '@folio/stripes/components';
import React from 'react';
import { Field } from 'react-final-form';
import { useIntl } from 'react-intl';
import RowType from './RowType';

export default function OpenClosedSelect({ name }: { name: string }) {
  const intl = useIntl();

  return (
    <Field
      name={name}
      render={(fieldProps) => (
        <Select<RowType>
          {...fieldProps}
          aria-label={intl.formatMessage({
            id: 'ui-calendar.calendarForm.openings.column.status',
          })}
          required
          fullWidth
          marginBottom0
          dataOptions={[
            {
              value: RowType.Open,
              label: intl.formatMessage({
                id: 'ui-calendar.calendarForm.openClosedSelect.open',
              }),
            },
            {
              value: RowType.Closed,
              label: intl.formatMessage({
                id: 'ui-calendar.calendarForm.openClosedSelect.closed',
              }),
            },
          ]}
        />
      )}
    />
  );
}
