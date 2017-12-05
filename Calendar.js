/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import Pane from '@folio/stripes-components/lib/Pane';
import Paneset from '@folio/stripes-components/lib/Paneset';

import BigCalendar from '@folio/react-big-calendar';
import moment from 'moment';
import '!style-loader!css-loader!./css/react-big-calendar.css';
import '!style-loader!css-loader!./css/folio-calendar.css';

class Calendar extends React.Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    resources: PropTypes.shape({
      calendarEvent: PropTypes.object,
    }).isRequired,
    mutator: PropTypes.shape({
      calendarEvent: PropTypes.shape,
    }).isRequired,
  };

  static manifest = Object.freeze({
    calendarEvent: {
      type: 'okapi',
      records: 'events',
      path: 'calendar/events',
    },
  });

  render() {
     let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])
     BigCalendar.momentLocalizer(moment);

     const { resources } = this.props;
     const calendarEvents = (resources.calendarEvent || {}).records || [];

     return (
      <Paneset>
        <Pane id="pane-calendar" defaultWidth="fill" height="100%" fluidContentWidth paneTitle='Institutional calendar'>
          <BigCalendar
            {...this.props}
            events={calendarEvents}
            startAccessor="startDate"
            endAccessor="endDate"
            titleAccessor="eventType"
            views={allViews}
          />
        </Pane>
      </Paneset>
    );
  }
}

export default Calendar;
