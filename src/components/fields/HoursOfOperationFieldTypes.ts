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
  startDay?: Weekday;
  startTime?: [string, string | null];
  endDay?: Weekday;
  endTime?: [string, string | null];
}

export type HoursOfOperationErrors = RequireExactlyOne<{
  empty?: {
    [field in keyof Omit<Required<HoursOfOperationRowState>, 'i' | 'type'>]: Record<number, ReactNode>;
  };
  invalidTimes?: {
    [field in 'startTime' | 'endTime']: Record<number, ReactNode>;
  };
  conflicts?: Set<number>;
}>;
