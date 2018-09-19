import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Button from '@folio/stripes-components/lib/Button/Button';
import React from 'react';
import { Headline } from '@folio/stripes-components';
import CalendarUtils from '../../CalendarUtils';

class BigCalendarHeader extends React.Component {
  render() {
    return (
      <div className="big-calendar-header">
        <Row>
          <Col xs={6}>
            <Headline>
              {CalendarUtils.translate('ui-calendar.regularLibraryHoursCalendar')}
            </Headline>
          </Col>
          <Col xs={6} className="new-period-buttons">

            <Button disabled>
              {CalendarUtils.translate('ui-calendar.selectTemplate')}
            </Button>
            <Button disabled>
              {CalendarUtils.translate('ui-calendar.copy')}
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default BigCalendarHeader;
