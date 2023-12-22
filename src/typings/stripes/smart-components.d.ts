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

export as namespace STSMACOM;
