import React from 'react';
import PropTypes from 'prop-types';
import Pane from '@folio/stripes-components/lib/Pane';
import Paneset from '@folio/stripes-components/lib/Paneset';
import BigCalendar from '@folio/react-big-calendar';
import moment from 'moment';
import '!style-loader!css-loader!./css/react-big-calendar.css'; // eslint-disable-line
import '!style-loader!css-loader!./css/folio-calendar.css'; // eslint-disable-line
import ErrorBoundary from './ErrorBoundary';
import SafeHTMLMessage from '../react-intl-safe-html';

class UiCalendar extends React.Component {

  static propTypes = {
    resources: PropTypes.shape({
      calendarEvent: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }),
    stripes: PropTypes.shape({      
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
      date: (<SafeHTMLMessage id="ui-calendar.date" />),
      time: (<SafeHTMLMessage id="ui-calendar.time" />),
      event: (<SafeHTMLMessage id="ui-calendar.event" />),
      allDay: (<SafeHTMLMessage id="ui-calendar.allDay" />),
      week: (<SafeHTMLMessage id="ui-calendar.week" />),
      work_week: (<SafeHTMLMessage id="ui-calendar.work_week" />),
      day: (<SafeHTMLMessage id="ui-calendar.day" />),
      month: (<SafeHTMLMessage id="ui-calendar.month" />),
      previous: (<SafeHTMLMessage id="ui-calendar.previous" />),
      next: (<SafeHTMLMessage id="ui-calendar.next" />),
      yesterday: (<SafeHTMLMessage id="ui-calendar.yesterday" />),
      tomorrow: (<SafeHTMLMessage id="ui-calendar.tomorrow" />),
      today: (<SafeHTMLMessage id="ui-calendar.today" />),
      agenda: (<SafeHTMLMessage id="ui-calendar.agenda" />),

      showMore: total => (<SafeHTMLMessage id="ui-calendar.showMore" />, { total: total }),
    };

    const paneTitle = (
      <SafeHTMLMessage id="ui-calendar.main.institutionalCalendar" />
    )

    return (
      <Paneset>
        <Pane
          padContent={false}
          id="pane-calendar"
          defaultWidth="fill"
          height="100%"
          fluidContentWidth
          paneTitle={paneTitle}
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
