import React from 'react';
import Settings from '@folio/stripes-components/lib/Settings';

import OpeningPeriods from './OpeningPeriods';

const pages = [
  {
    route: 'opening-periods',
    label: 'Opening periods',
    component: OpeningPeriods,
  },
];

export default props => <Settings {...props} pages={pages} paneTitle="Calendar" />;
