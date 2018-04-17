import React from 'react';
import Settings from '@folio/stripes-components/lib/Settings';
import SafeHTMLMessage from '../../react-intl-safe-html';

import OpeningPeriods from './OpeningPeriods';

const pages = [
  {
    route: 'opening-periods',
    labelKey: 'ui-calendar.settings.openingPeriods',
    component: OpeningPeriods,
  },
];

const label = (
  <SafeHTMLMessage
    id={pages[0].labelKey}
  />
);

const paneTitle = (
  <SafeHTMLMessage
    id='ui-calendar.settings.calendar'
  />
);

function getPages(pageDefinitions, props) {
  const routes = [];
  pageDefinitions.forEach((page) => {
    routes.push({
      route: page.route,
      label: (<SafeHTMLMessage id={pages[0].labelKey} />),
      component: page.component,
    });
  });
  return routes;
}

export default props => <Settings {...props} pages={getPages(pages, props)} paneTitle={(<SafeHTMLMessage id='ui-calendar.settings.calendar' />)} />;
