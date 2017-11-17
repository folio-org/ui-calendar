/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import Pane from '@folio/stripes-components/lib/Pane';
import Paneset from '@folio/stripes-components/lib/Paneset';

import BigCalendar from '@folio/react-big-calendar';
import moment from 'moment';
import '!style-loader!css-loader!./css/react-big-calendar.css';
import '!style-loader!css-loader!./css/folio-calendar.css';
import calendarEvents from './events';

class Calendar extends React.Component {

  render() {
     let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])
     BigCalendar.momentLocalizer(moment);

     return (
      <Paneset>
        <Pane id="pane-calendar" defaultWidth="fill" height="100%" fluidContentWidth paneTitle='Institutional calendar'>
          <BigCalendar
            {...this.props}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            defaultDate={new Date(2017, 3, 1)}
            views={allViews}
          />
        </Pane>
      </Paneset>
    );
  }
}

export default Calendar;
