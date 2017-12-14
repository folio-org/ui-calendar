import React, { PropTypes } from 'react';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Pane from '@folio/stripes-components/lib/Pane';
import AddOpeningDayForm from './AddOpeningDayForm';

class CalendarSettings extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
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
      path: 'calendar/eventdescriptions',
      POST: {
        path: 'calendar/eventdescriptions',
      },
    },
  });

  constructor(props) {
    super(props);
    this.saveRecord = this.saveRecord.bind(this);
    this.initialValues = { daysIncluded: {} };
  }

  saveRecord(record) {
    this.props.mutator.calendarEvent.POST(record);
  }

  render() {
    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle={this.props.label}>
        <Row>
          <Col xs={12}>
            <AddOpeningDayForm
              initialValues={this.initialValues}
              onSubmit={(record) => { this.saveRecord(record); }}
            />
          </Col>
        </Row>
      </Pane>
    );
  }

}

export default CalendarSettings;
