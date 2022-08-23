import { Select } from '@folio/stripes/components';
import React from 'react';
import { useIntl } from 'react-intl';
import RowType from './RowType';

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
  const intl = useIntl();

  return (
    <Select<RowType>
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
