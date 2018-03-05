import React from 'react';
import Settings from '@folio/stripes-components/lib/Settings';

import OpeningPeriods from './OpeningPeriods';

const pages = [
  {
    route: 'opening-periods',
    labelKey: 'ui-calendar.settings.openingPeriods',
    component: OpeningPeriods,
  },
];

function getPages(pageDefinitions, props) {
  const routes = [];
  pageDefinitions.forEach((page) => {
    routes.push({
      route: page.route,
      label: props.stripes.intl.formatMessage({ id: page.labelKey }),
      component: page.component,
    });
  });
  return routes;
}

export default props => <Settings {...props} pages={getPages(pages, props)} paneTitle={props.stripes.intl.formatMessage({ id: 'ui-calendar.settings.calendar' })} />;
