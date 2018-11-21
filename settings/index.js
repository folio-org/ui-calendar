import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';

import LibraryHours from './LibraryHours';

const pages = [
  {
    route: 'library-hours',
    labelKey: 'ui-calendar.settings.library_hours',
    component: LibraryHours,
  }
];


function getPages(pageDefinitions) {
  const routes = [];
  pageDefinitions.forEach((page) => {
    routes.push({
      route: page.route,
      label: <FormattedMessage id={page.labelKey} />,
      component: page.component,
    });
  });
  return routes;
}

export default props => <Settings
  {...props}
  pages={getPages(pages)}
  paneTitle={<FormattedMessage id="ui-calendar.settings.calendar" />}
/>;
