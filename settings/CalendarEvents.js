import React, { PropTypes } from 'react';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Pane from '@folio/stripes-components/lib/Pane';

class CalendarEvents extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    mutator: PropTypes.shape({
      calendarEventId: PropTypes.shape({
        replace: PropTypes.func,
      }),
      calendarEvent: PropTypes.shape({
        POST: PropTypes.func,
        PUT: PropTypes.func,
      }),
    }).isRequired,
  };

  static manifest = Object.freeze({
    calendarEventId: {},
    calendarEvent: {
      type: 'okapi',
      records: 'events',
      path: 'calendar/events',
    },
  });

  render() {
    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle="Manage events">
        <Row>
          <Col xs={12}>
            Teszt events
          </Col>
        </Row>
      </Pane>
    );
  }

}

export default CalendarEvents;
