import { MultiColumnListRowFormatterProps } from '@folio/stripes/components';
import React from 'react';

export default function MCLRowFormatter<MCLContentsType>({
  rowClass,
  cells,
  rowProps,
}: Pick<
  MultiColumnListRowFormatterProps<MCLContentsType>,
  'rowClass' | 'cells' | 'rowProps'
>) {
  return (
    <div className={rowClass} {...rowProps}>
      {cells}
    </div>
  );
}
