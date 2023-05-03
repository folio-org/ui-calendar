import { ReactNode } from 'react';
import { Weekday } from '../../types/types';
import RowType from './RowType';

export interface MCLContentsType extends Record<string, unknown> {
  status: ReactNode;
  startDay: ReactNode;
  startTime: ReactNode;
  endDay: ReactNode;
  endTime: ReactNode;
  actions: ReactNode;
  isConflicted: boolean;
}

export interface HoursOfOperationRowState {
  type: RowType;
  startDay: Weekday | undefined;
  startTime: string | undefined;
  endDay: Weekday | undefined;
  endTime: string | undefined;
}

export type HoursOfOperationErrors = Record<number, { conflict?: true }>;
