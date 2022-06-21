import { ReactNode } from "react";
import RowType from "./RowType";

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
