import { FormattedDate, FormattedTime } from 'react-intl';
import React from 'react';
import PropTypes from 'prop-types';
import Pane from '@folio/stripes-components/lib/Pane';
import Paneset from '@folio/stripes-components/lib/Paneset';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import BigCalendar from '@folio/react-big-calendar';
import moment from 'moment';
import '!style-loader!css-loader!./css/react-big-calendar.css'; // eslint-disable-line
import '!style-loader!css-loader!./css/folio-calendar.css'; // eslint-disable-line
import ErrorBoundary from './ErrorBoundary';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

class UiCalendar extends React.Component {

  static propTypes = {
    resources: PropTypes.shape({
      calendarEvent: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }),
    mutator: PropTypes.shape({
      calendarEvent: PropTypes.shape({
        GET: PropTypes.func,
        reset: PropTypes.func,
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
      accumulate: 'true',
      fetch: true,
    },
  });

  constructor(props) {
    super(props);
    this.navigate = this.navigate.bind(this);
    this.updateEvents = this.updateEvents.bind(this);
    this.changeView = this.changeView.bind(this);
    this.selectEvent = this.selectEvent.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      showPane: false,
      selectedEvent: undefined,
    }
  }

  navigate(date, view, action) {
    if (view === BigCalendar.Views.WEEK) {
      this.updateEvents(date, 7);
    } else if(view === BigCalendar.Views.MONTH) {
      this.updateEvents(date, 42);
    }
  }

  changeView(view) {
    this.props.mutator.calendarEvent.reset();
    this.props.mutator.calendarEvent.GET();
  }

  updateEvents(date, days) {
    this.props.mutator.calendarEvent.reset();
    const params = {
      from: moment(date).subtract(days, 'days').format("YYYY-MM-DD"),
      to: moment(date).add(days, 'days').format("YYYY-MM-DD"),
    };
    this.props.mutator.calendarEvent.GET({ params });
  }

  selectEvent(calendarEvent, event) {
    console.log('event: ', calendarEvent);
    this.setState({selectedEvent: calendarEvent});
    this.setState({showPane: true});
  }

  handleClose() {
    this.setState({showPane: false});
  }

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

        const eventTitleTranslationKey = `ui-calendar.settings.event_type.${event.eventType.toLowerCase()}`;
        const eventTitleTranslation = this.props.stripes.intl.formatMessage({ id: eventTitleTranslationKey });

        if (eventTitleTranslationKey !== eventTitleTranslation) {
          mappedEvent.eventType = eventTitleTranslation;
        }
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

      showMore: total => (<SafeHTMLMessage id="ui-calendar.showMore" values={{ total: total }} />),
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
              onNavigate={this.navigate}
              onView={this.changeView}
              onSelectEvent={this.selectEvent}
            />
          </ErrorBoundary>
        </Pane>
        {this.state.showPane &&
          <Pane
            padContent={false}
            id="pane-calendar"
            defaultWidth="fill"
            height="100%"
            defaultWidth="30%"
            fluidContentWidth
            paneTitle={this.props.stripes.intl.formatMessage({ id: 'ui-calendar.main.eventDetails' })}
            dismissible
            onClose={this.handleClose}
          >
            <div>
              <section>
                <Row>
                  <Col xs={12}>
                    <h2 style={{ marginTop: '0' }}>{this.state.selectedEvent.eventType}</h2>
                  </Col>
                </Row>
                <Row>
                  <Col xs={4}><FormattedDate value={this.state.selectedEvent.startDate} /> <FormattedTime value={this.state.selectedEvent.startDate} /></Col>
                  <Col xs={4}><FormattedDate value={this.state.selectedEvent.endDate} /> <FormattedTime value={this.state.selectedEvent.endDate} /></Col>
                </Row>
              </section>
            </div>
          </Pane>
        }
      </Paneset>
    );
  }
}

export default UiCalendar;
