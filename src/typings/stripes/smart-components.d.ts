import type { PaneProps } from '@folio/stripes/components';
import type { StripesType } from '@folio/stripes/core';
import type { Location } from 'history';
import type { ComponentType, ReactNode, RefObject } from 'react';
import { Component } from 'react';

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

export as namespace STSMACOM;
