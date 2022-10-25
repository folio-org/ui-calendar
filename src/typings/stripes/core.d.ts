import type ky from 'ky';
import type { Context, FunctionComponent, ReactNode } from 'react';

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
}

export function useStripes(): StripesType;

export const IfPermission: FunctionComponent<{
  perm: string;
  children: ReactNode | ((props: { hasPermission: boolean }) => ReactNode);
}>;

export function useOkapiKy(): typeof ky;

export as namespace STCOR;
