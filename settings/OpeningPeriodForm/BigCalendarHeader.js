import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Button,
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
      <Col xs={6} className="new-period-buttons">

        <Button
          data-test-select-template
          disabled
        >
          <FormattedMessage id="ui-calendar.selectTemplate" />
        </Button>
        <Button
          data-test-copy
          disabled
        >
          <FormattedMessage id="ui-calendar.copy" />
        </Button>
      </Col>
    </Row>
  </div>
);

export default BigCalendarHeader;
