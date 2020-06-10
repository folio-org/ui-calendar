import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';

import LibraryHours from './LibraryHours';

const pages = [
  {
    route: 'library-hours',
    labelKey: 'ui-calendar.settings.library_hours',
    component: LibraryHours,
  }
];


function getPages(pageDefinitions, intl) {
  const routes = [];
  pageDefinitions.forEach((page) => {
    routes.push({
      route: page.route,
      label: intl.formatMessage({ id: page.labelKey }),
      component: page.component,
    });
  });
  return routes;
}

export default props => {
  const intl = useIntl();

  return (
    <Settings
      {...props}
      pages={getPages(pages, intl)}
      paneTitle={<FormattedMessage id="ui-calendar.settings.calendar" />}
    />
  );
};
