import React from 'react';
import Settings from '@folio/stripes-components/lib/Settings';

import CalendarSettings from './CalendarSettings';
import CalendarEvents from './CalendarEvents';

const pages = [
  {
    route: 'events',
    label: 'Events',
    component: CalendarEvents,
  },
];

export default props => <Settings {...props} pages={pages} paneTitle="Calendar" />;
