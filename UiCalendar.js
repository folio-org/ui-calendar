/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import Pane from '@folio/stripes-components/lib/Pane';
import Paneset from '@folio/stripes-components/lib/Paneset';

import BigCalendar from '@folio/react-big-calendar';
import moment, { now } from 'moment';
import '!style-loader!css-loader!./css/react-big-calendar.css';
import '!style-loader!css-loader!./css/folio-calendar.css';
import calendarEvents from './events.js';
import ErrorBoundary from './ErrorBoundary.js';
import Agenda from '../react-big-calendar/src/Agenda.js';

class UiCalendar extends React.Component {

  /*static propTypes = {
    
  };

  static manifest = Object.freeze({
    
  });*/

  render() {
     let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);
     BigCalendar.momentLocalizer(moment);

     /*const { resources } = this.props;
     const calendarEvents = ((resources.calendarEvent || {}).records || [])
      .map((event) => {
        event.startDate = new Date(event.startDate);
        event.endDate = new Date(event.endDate);
        return event;
      });*/

     return (
      <Paneset>
        <Pane id="pane-calendar" defaultWidth="fill" height="100%" fluidContentWidth paneTitle='Institutional calendar'>
          <ErrorBoundary>
            <BigCalendar
              {...this.props}
              events={calendarEvents}
              startAccessor="startDate"
              endAccessor="endDate"
              titleAccessor="eventType"
              views={allViews}
            />
          </ErrorBoundary>
        </Pane>
      </Paneset>
    );
  }
}

/*
          <Agenda
            {...this.props}
            titleAccessor="eventType"
            tooltipAccessor="eventType"
            startAccessor="startDate"
            endAccessor="endDate"
            components={{
              event: '',
              date: now(),
              time: ''
            }}
            allDayAccessor="allDay"
            events={calendarEvents}
          ></Agenda>
*/

export default UiCalendar;
