import type { Context } from 'react';
import type { LinkProps } from 'react-router-dom';

export interface NavListSectionContextContents {
  activeLink: LinkProps['to'] | string;
  striped: boolean;
}

declare const toExport: Context<NavListSectionContextContents>;
export default toExport;
