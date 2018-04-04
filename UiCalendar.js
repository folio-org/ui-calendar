import React from 'react';
import PropTypes from 'prop-types';
import Pane from '@folio/stripes-components/lib/Pane';
import Paneset from '@folio/stripes-components/lib/Paneset';
import BigCalendar from '@folio/react-big-calendar';
import moment from 'moment';
import '!style-loader!css-loader!./css/react-big-calendar.css'; // eslint-disable-line
import '!style-loader!css-loader!./css/folio-calendar.css'; // eslint-disable-line
import ErrorBoundary from './ErrorBoundary';

class UiCalendar extends React.Component {

  static propTypes = {
    resources: PropTypes.shape({
      calendarEvent: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }),
    stripes: PropTypes.shape({
      intl: PropTypes.shape({
        formatMessage: PropTypes.func,
      }),
      locale: PropTypes.string,
    }).isRequired,
  };

  static manifest = Object.freeze({
    calendarEvent: {
      type: 'okapi',
      path: 'calendar/events',
      records: 'events',
    },
  });

  render() {
    const views = [
      BigCalendar.Views.MONTH,
      BigCalendar.Views.WEEK,
    ];

    BigCalendar.momentLocalizer(moment);

    const calResources = this.props.resources;
    const calendarEvents = ((calResources.calendarEvent || {}).records || [])
      .map((event) => {
        const mappedEvent = event;
        mappedEvent.startDate = new Date(event.startDate);
        mappedEvent.endDate = new Date(event.endDate);
        return mappedEvent;
      });

    const messages = {
      date: this.props.stripes.intl.formatMessage({ id: 'ui-calendar.date' }),
      time: this.props.stripes.intl.formatMessage({ id: 'ui-calendar.time' }),
      event: this.props.stripes.intl.formatMessage({ id: 'ui-calendar.event' }),
      allDay: this.props.stripes.intl.formatMessage({ id: 'ui-calendar.allDay' }),
      week: this.props.stripes.intl.formatMessage({ id: 'ui-calendar.week' }),
      work_week: this.props.stripes.intl.formatMessage({ id: 'ui-calendar.work_week' }),
      day: this.props.stripes.intl.formatMessage({ id: 'ui-calendar.day' }),
      month: this.props.stripes.intl.formatMessage({ id: 'ui-calendar.month' }),
      previous: this.props.stripes.intl.formatMessage({ id: 'ui-calendar.previous' }),
      next: this.props.stripes.intl.formatMessage({ id: 'ui-calendar.next' }),
      yesterday: this.props.stripes.intl.formatMessage({ id: 'ui-calendar.yesterday' }),
      tomorrow: this.props.stripes.intl.formatMessage({ id: 'ui-calendar.tomorrow' }),
      today: this.props.stripes.intl.formatMessage({ id: 'ui-calendar.today' }),
      agenda: this.props.stripes.intl.formatMessage({ id: 'ui-calendar.agenda' }),

      showMore: total => this.props.stripes.intl.formatMessage({ id: 'ui-calendar.showMore' }, { total: total }),
    };

    return (
      <Paneset>
        <Pane
          padContent={false}
          id="pane-calendar"
          defaultWidth="fill"
          height="100%"
          fluidContentWidth
          paneTitle={this.props.stripes.intl.formatMessage({ id: 'ui-calendar.main.institutionalCalendar' })}
        >
          <ErrorBoundary>
            <BigCalendar
              {...this.props}
              events={calendarEvents}
              startAccessor="startDate"
              endAccessor="endDate"
              titleAccessor="eventType"
              views={views}
              resources={[null]}
              culture={this.props.stripes.locale}
              messages={messages}
            />
          </ErrorBoundary>
        </Pane>
      </Paneset>
    );
  }
}

export default UiCalendar;
