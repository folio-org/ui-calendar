import { MultiColumnListRowFormatterProps } from '@folio/stripes-components/types/lib/MultiColumnList/MultiColumnList';
import React from 'react';

export default function MCLRowFormatter<
  MCLContentsType extends { rowState: { i: number } }
>(props: MultiColumnListRowFormatterProps<MCLContentsType>) {
  const { rowClass, rowData, cells, rowProps } = props;

  return (
    <div key={`row-${rowData.rowState.i}`} className={rowClass} {...rowProps}>
      {cells}
    </div>
  );
}
