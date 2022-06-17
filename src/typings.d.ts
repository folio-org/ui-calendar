// allow TypeScript to permit importing CSS files
declare module "*.css" {
  const styles: { [className: string]: string };
  export = styles;
}

declare module "@folio/stripes-smart-components" {
  import { PaneProps } from "@folio/stripes-components/types/lib/Pane/Pane";
  import { Location } from "history";
  import { Component, ElementType, ReactNode, RefObject } from "react";

  export interface SettingsProps {
    additionalRoutes?: ReactNode[];
    navPaneWidth?: PaneProps["defaultWidth"];
    pages: {
      route: string;
      label: ReactNode;
      component: ElementType;
      perm?: string[];
    }[];
    paneTitle?: ReactNode;
    paneTitleRef?: RefObject<HTMLDivElement>;

    location?: Location;
    showSettings?: boolean;
  }

  export class Settings extends Component<SettingsProps> {}
}
