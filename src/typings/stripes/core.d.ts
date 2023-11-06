import type ky from 'ky';
import type { Context, FunctionComponent, ReactNode } from 'react';
import React from 'react';

export type CalloutContextType = {
  sendCallout: (args: {
    type?: 'success' | 'error' | 'warning' | 'info';
    timeout?: number;
    message: ReactNode;
  }) => void;
};
export const CalloutContext: Context<CalloutContextType>;

export interface StripesType {
  hasPerm: (perm: string) => boolean;
  config?: {
    platformName?: string;
  };
}

export function useStripes(): StripesType;

export const IfPermission: FunctionComponent<{
  perm: string;
  children: ReactNode | ((props: { hasPermission: boolean }) => ReactNode);
}>;

export const TitleManager: React.Component<{
  children?: ReactNode;
  prefix?: string;
  page?: string;
  record?: string;
  stripes?: StripesType;
}>;

export function useOkapiKy(): typeof ky;

export as namespace STCOR;
