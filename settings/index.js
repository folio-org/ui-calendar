import React from 'react';
import Settings from '@folio/stripes-components/lib/Settings';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import CalendarUtils from '../CalendarUtils';

import LibraryHours from './LibraryHours';

const pages = [
    {
        route: 'library-hours',
        labelKey: 'ui-calendar.settings.library_hours',
        component: LibraryHours,
    }
];


function getPages(pageDefinitions, props) {
    const routes = [];
    pageDefinitions.forEach((page) => {
        routes.push({
            route: page.route,
            label: props.stripes.intl.formatMessage({id: page.labelKey}),
            component: page.component,
        });
    });
    return routes;
}

export default props => <Settings {...props} pages={getPages(pages, props)}
                                  paneTitle={CalendarUtils.translateToString('ui-calendar.settings.calendar',props.stripes.intl) }/>;
