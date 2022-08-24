/* eslint-disable import/no-duplicates */

// allow TypeScript to permit importing CSS files
declare module '*.css' {
  const styles: { [className: string]: string };
  export = styles;
}

declare module '@folio/stripes/core' {
  import type { StripesType } from '@folio/stripes/smart-components';
  import type { Context, FunctionComponent, ReactNode } from 'react';
  import type ky from 'ky';

  export type CalloutContextType = {
    sendCallout: (args: {
      type?: 'success' | 'error' | 'warning' | 'info';
      timeout?: number;
      message: ReactNode;
    }) => void;
  };
  export const CalloutContext: Context<CalloutContextType>;

  export function useStripes(): StripesType;

  export const IfPermission: FunctionComponent<{
    perm: string;
    children: ReactNode | ((props: { hasPermission: boolean }) => ReactNode);
  }>;

  export function useOkapiKy(): typeof ky;
}

declare module '@folio/stripes/components' {
  export * from '@folio/stripes-components';
}

declare module '@folio/stripes/smart-components' {
  import { PaneProps } from '@folio/stripes-components/types/lib/Pane/Pane';
  import { Location } from 'history';
  import { Component, ComponentType, ReactNode, RefObject } from 'react';

  export interface StripesType {
    hasPerm: (perm: string) => boolean;
  }

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

declare module '@folio/stripes-components/lib/Datepicker/staticFirstWeekDay' {
  const staticData: Record<
    'sat' | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri',
    string[]
  >;

  export default staticData;
}
