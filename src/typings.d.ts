/* eslint-disable import/no-duplicates */

// allow TypeScript to permit importing CSS files
declare module '*.css' {
  const styles: { [className: string]: string };
  export = styles;
}

declare module '@folio/stripes/core' {
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
}

declare module '@folio/stripes/smart-components' {
  import { PaneProps } from '@folio/stripes/components';
  import { StripesType } from '@folio/stripes/core';
  import { Location } from 'history';
  import { Component, ComponentType, ReactNode, RefObject } from 'react';

  export interface SettingsProps {
    additionalRoutes?: ReactNode[];
    navPaneWidth?: PaneProps['defaultWidth'];
    pages: {
      route: string;
      label: ReactNode;
      component: ComponentType<Record<string, never>>;
      perm?: string;
    }[];
    paneTitle?: ReactNode;
    paneTitleRef?: RefObject<HTMLDivElement>;
    location: Location;
    showSettings?: boolean;
    stripes: StripesType;
    forceRender: number;
  }

  export class Settings extends Component<SettingsProps> {}
}
