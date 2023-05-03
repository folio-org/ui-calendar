import { MultiColumnListRowFormatterProps } from '@folio/stripes/components';
import React from 'react';

export default function MCLRowFormatter<MCLContentsType>(
  props: MultiColumnListRowFormatterProps<MCLContentsType>
) {
  const { rowClass, cells, rowProps } = props;

  return (
    <div className={rowClass} {...rowProps}>
      {cells}
    </div>
  );
}
