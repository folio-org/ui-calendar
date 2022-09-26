import {
  MultiColumnList,
  MultiColumnListProps
} from '@folio/stripes/components';
import React, { ReactElement, ReactNode, useMemo, useState } from 'react';
import { dateCompare } from '../utils/DateUtils';

export enum SortDirection {
  ASCENDING = 'ascending',
  DESCENDING = 'descending'
}

function flipSortDirection(direction: SortDirection): SortDirection {
  return direction === SortDirection.ASCENDING
    ? SortDirection.DESCENDING
    : SortDirection.ASCENDING;
}

export type SortInfo<SortableDataShape> = {
  key: keyof SortableDataShape;
  direction: SortDirection;
};

function getInitialSort<SortableDataShape>(
  sortedColumn: keyof SortableDataShape | undefined,
  sortDirection: 'ascending' | 'descending' | undefined
): SortInfo<SortableDataShape>[] {
  if (sortedColumn === undefined) return [];
  return [
    {
      key: sortedColumn,
      direction:
        sortDirection === 'descending'
          ? SortDirection.DESCENDING
          : SortDirection.ASCENDING
    }
  ];
}

export interface SortableMultiColumnListProps<
  DataShape extends Record<string, unknown>,
  OmittedColumns extends string = ''
> extends Omit<
    MultiColumnListProps<DataShape, OmittedColumns>,
    'onHeaderClick'
  > {
  dateColumns?: Exclude<keyof DataShape & string, OmittedColumns>[];
}

function sortBy<
  T extends { [k in K]: object | string | ReactNode },
  K extends string
>(
  data: T[],
  key: K,
  direction: SortDirection,
  dateColumns: K[] = [],
  dateColumnMap: Record<string, K> = {}
): void {
  data.sort((a, b) => {
    if (a?.[key] === undefined || a[key] === null) {
      return direction === SortDirection.ASCENDING ? -1 : 1;
    }
    if (b?.[key] === undefined || b[key] === null) {
      return direction === SortDirection.ASCENDING ? 1 : -1;
    }
    if (dateColumns?.includes(key)) {
      return (
        (direction === SortDirection.ASCENDING ? 1 : -1) *
        dateCompare(
          a[dateColumnMap[key]] as Date,
          b[dateColumnMap[key]] as Date
        )
      );
    }
    return (
      (direction === SortDirection.ASCENDING ? 1 : -1) *
      (a[key] as object | string | ReactElement)
        .toString()
        .localeCompare((b[key] as object | string | ReactElement).toString())
    );
  });
}

export default function SortableMultiColumnList<
  DataShape extends {
    [k in Exclude<keyof DataShape, OmittedColumns>]:
      | object
      | string
      | ReactNode;
  },
  OmittedColumns extends string = ''
>(props: SortableMultiColumnListProps<DataShape, OmittedColumns>) {
  const { sortedColumn, sortDirection, contentData, dateColumns, ...rest } =
    props;

  // first element is the primary sort, optional secondary
  const [sort, setSort] = useState<SortInfo<Omit<DataShape, OmittedColumns>>[]>(
    getInitialSort<Omit<DataShape, OmittedColumns>>(sortedColumn, sortDirection)
  );

  const data: MultiColumnListProps<DataShape, OmittedColumns>['contentData'] =
    useMemo(() => {
      const newData = [...contentData];
      sort
        .slice()
        .reverse()
        .forEach((sorting) => {
          return sortBy<
            DataShape,
            Exclude<keyof DataShape & string, OmittedColumns>
          >(
            newData,
            sorting.key as Exclude<keyof DataShape & string, OmittedColumns>,
            sorting.direction,
            dateColumns
          );
        });
      return newData;
    }, [contentData, sort, dateColumns]);

  const sortProps = useMemo<
    Pick<
      MultiColumnListProps<DataShape, OmittedColumns>,
      'sortedColumn' | 'sortDirection'
    >
  >(() => {
    if (sort.length === 0) return {};
    return {
      sortedColumn: sort[0].key,
      sortDirection: sort[0].direction
    };
  }, [sort]);

  return (
    <MultiColumnList
      {...(rest as MultiColumnListProps<DataShape, OmittedColumns>)}
      {...sortProps}
      onHeaderClick={(_e, { name }) => {
        if (sort.length >= 1 && sort[0].key === name) {
          // toggling the primary sort
          const newSort = [...sort];
          newSort[0].direction = flipSortDirection(sort[0].direction);
          setSort(newSort);
        } else if (sort.length <= 1) {
          // new sort, no secondary
          setSort([{ key: name, direction: SortDirection.ASCENDING }, ...sort]);
        } else {
          // old primary is the new secondary
          // if sort[1] was the clicked header, it is replaced, so no worry about the
          // two sorts being the same key
          setSort([{ key: name, direction: SortDirection.ASCENDING }, sort[0]]);
        }
      }}
      contentData={data}
    />
  );
}
