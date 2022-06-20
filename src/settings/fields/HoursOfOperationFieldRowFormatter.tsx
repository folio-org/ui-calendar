import { MultiColumnListRowFormatterProps } from "@folio/stripes-components/types/lib/MultiColumnList/MultiColumnList";
import React from "react";
import { MCLContentsType } from "./HoursOfOperationFieldTypes";

export default function HoursOfOperationFieldRowFormatter(
  props: MultiColumnListRowFormatterProps<MCLContentsType>
) {
  const { rowClass, rowData, cells, rowProps } = props;

  return (
    <div key={`row-${rowData.i}`} className={rowClass} {...rowProps}>
      {cells}
    </div>
  );
}
