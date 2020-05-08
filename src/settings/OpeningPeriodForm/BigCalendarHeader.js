import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Headline,
  Row,
  Col,
} from '@folio/stripes/components';

const BigCalendarHeader = () => (
  <div
    data-test-big-calendar-header
    className="big-calendar-header"
  >
    <Row>
      <Col
        data-test-big-calendar-header-hedline
        xs={6}
      >
        <Headline>
          <FormattedMessage id="ui-calendar.regularLibraryHoursCalendar" />
        </Headline>
      </Col>
    </Row>
  </div>
);

export default BigCalendarHeader;
