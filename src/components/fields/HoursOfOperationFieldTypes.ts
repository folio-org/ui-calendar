import { ReactNode } from 'react';
import { Weekday } from '../../types/types';
import type { RequireExactlyOne } from '../../types/utils';
import RowType from './RowType';

export interface MCLContentsType extends Record<string, unknown> {
  rowState: HoursOfOperationRowState;
  status: ReactNode;
  startDay: ReactNode;
  startTime: ReactNode;
  endDay: ReactNode;
  endTime: ReactNode;
  actions: ReactNode;
  isConflicted: boolean;
}

export interface HoursOfOperationRowState {
  i: number;
  type: RowType;
  startDay: Weekday | undefined;
  startTime: string | undefined;
  endDay: Weekday | undefined;
  endTime: string | undefined;
}

export type HoursOfOperationErrors = RequireExactlyOne<{
  empty?: {
    [field in keyof Omit<HoursOfOperationRowState, 'i' | 'type'>]: Record<
      number,
      ReactNode
    >;
  };
  invalidTimes?: {
    [field in 'startTime' | 'endTime']: Record<number, ReactNode>;
  };
  conflicts?: Set<number>;
}>;
