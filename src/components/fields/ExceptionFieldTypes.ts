import { ReactNode } from 'react';
import RowType from './RowType';

export interface MCLContentsType extends Record<string, unknown> {
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
  name: string;
  type: RowType;
  rows: {
    startDate: string | undefined;
    startTime: string | undefined;
    endDate: string | undefined;
    endTime: string | undefined;
  }[];
}

export type ExceptionFieldErrors = Record<
  number,
  {
    conflict?: true;
    rows?: { conflict?: true; startDate?: ReactNode; endDate?: ReactNode }[];
  }
>;
