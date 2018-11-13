import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Headline, Row, Col } from '@folio/stripes/components';

class BigCalendarHeader extends React.Component {
  render() {
    return (
      <div className="big-calendar-header">
        <Row>
          <Col xs={6}>
            <Headline>
              <FormattedMessage id="ui-calendar.regularLibraryHoursCalendar" />
            </Headline>
          </Col>
          <Col xs={6} className="new-period-buttons">

            <Button disabled>
              <FormattedMessage id="ui-calendar.selectTemplate" />
            </Button>
            <Button disabled>
              <FormattedMessage id="ui-calendar.copy" />
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default BigCalendarHeader;
