import React from 'react';
import PropTypes from 'prop-types';
import Pane from '@folio/stripes-components/lib/Pane';
import Paneset from '@folio/stripes-components/lib/Paneset';
import BigCalendar from '@folio/react-big-calendar';
import moment, { now } from 'moment';
import '!style-loader!css-loader!./css/react-big-calendar.css';
import '!style-loader!css-loader!./css/folio-calendar.css';
import ErrorBoundary from './ErrorBoundary';

class UiCalendar extends React.Component {

  static propTypes = {
    resources: PropTypes.shape({
      calendarEvent: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }),
  };

  static manifest = Object.freeze({
    calendarEvent: {
      type: 'okapi',
      path: 'calendar/events',
      records: 'events',
    },
  });

  render() {
    const allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);
    BigCalendar.momentLocalizer(moment);

    const calResources = this.props.resources;
    const calendarEvents = ((calResources.calendarEvent || {}).records || [])
      .map((event) => {
        const mappedEvent = event;
        mappedEvent.startDate = new Date(event.startDate);
        mappedEvent.endDate = new Date(event.endDate);
        return mappedEvent;
      });

    return (
      <Paneset>
        <Pane id="pane-calendar" defaultWidth="fill" height="100%" fluidContentWidth paneTitle={this.props.stripes.intl.formatMessage({id: "ui-calendar.main.institutionalCalendar"})}>
          <ErrorBoundary>
            <BigCalendar
              {...this.props}
              events={calendarEvents}
              startAccessor="startDate"
              endAccessor="endDate"
              titleAccessor="eventType"
              views={allViews}
              resources={[null]}
            />
          </ErrorBoundary>
        </Pane>
      </Paneset>
    );
  }
}

export default UiCalendar;
