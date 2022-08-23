import { RequireExactlyOne } from '@folio/stripes-components/types/utils';
import { ReactNode } from 'react';
import RowType from './RowType';

export interface MCLContentsType {
  rowState: ExceptionRowState;
  name: ReactNode;
  status: ReactNode;
  startDate: ReactNode;
  startTime: ReactNode;
  endDate: ReactNode;
  endTime: ReactNode;
  actions: ReactNode;
  isConflicted: boolean;
}

export interface ExceptionRowState {
  i: number;
  name: string;
  type: RowType;
  lastRowI: number;
  rows: {
    i: number;
    startDate: string | undefined;
    startTime: string | undefined;
    endDate: string | undefined;
    endTime: string | undefined;
  }[];
}

export type ExceptionFieldErrors = RequireExactlyOne<{
  empty?: {
    name: Record<number, ReactNode>;
  } & {
    [field in keyof Omit<ExceptionRowState['rows'][0], 'i'>]: Record<
      number,
      Record<number, ReactNode>
    >;
  };
  invalid?: {
    [field in keyof Omit<ExceptionRowState['rows'][0], 'i'>]: Record<
      number,
      Record<number, ReactNode>
    >;
  };
  interConflicts?: Set<number>;
  intraConflicts?: Record<number, Set<number>>;
}>;
