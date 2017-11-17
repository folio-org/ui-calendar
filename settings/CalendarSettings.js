import React, { PropTypes } from 'react';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Pane from '@folio/stripes-components/lib/Pane';
import AddOpeningDayForm from './AddOpeningDayForm';

class CalendarSettings extends React.Component {
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
      POST: {
        path: 'calendar/event',
      },
      PUT: {
        path: 'calendar/event/${calendarEventId}',
      },
    },
  });

  constructor(props) {
    super(props);
    this.onChangeEvent = this.onChangeEvent.bind(this);
  }

  onChangeEvent(e) {
    const record = this.props.data.calendarEvent[0];
    if (record) {
      // preference has been set previously, can proceed with update here
      this.props.mutator.calendarEventId.replace(record.id);
      record.value = e.target.value;
      this.props.mutator.calendarEvent.PUT(record);
    } else {
      // no preference exists, so create a new one
      this.props.mutator.calendarEvent.POST(
        {
          module: 'SCAN',
          configName: 'pref_patron_identifier',
          value: e.target.value,
        },
      );
    }
  }

  render() {
    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle="Manage events">
        <Row>
          <Col xs={12}>
            <AddOpeningDayForm />
          </Col>
        </Row>
      </Pane>
    );
  }

}

export default CalendarSettings;
