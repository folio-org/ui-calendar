import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedDate } from 'react-intl';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';

function padNumber(param) {
  return (param > 9) ? param : `0${param}`;
}

function calculateTime(hour, minute, open, allDay, twelveHour, start) {
  if (!open) {
    return 'Closed';
  } else if (open && allDay) {
    return start ? '00:00' : '24:00';
  } else {
    return `${padNumber(hour)}:${padNumber(minute)}`;
  }
}

function ViewOpeningDay(props) {
  const openingDays = props.initialValues;

  return (
    <div>
      <section>
        <Row>
          <Col xs={12}><h2 style={{ marginTop: '0' }}>Opening period</h2></Col>
        </Row>
        <Row>
          <Col xs={4}><h4>Opening period start date</h4></Col>
          <Col xs={4}><h4>Opening period end date</h4></Col>
        </Row>
        <Row>
          <Col xs={4}><FormattedDate value={openingDays.startDate} /></Col>
          <Col xs={4}><FormattedDate value={openingDays.endDate} /></Col>
        </Row>
        <Row>
          <Col xs={4}><h4>Day</h4></Col>
          <Col xs={4}><h4>Opening time</h4></Col>
          <Col xs={4}><h4>Closing time</h4></Col>
        </Row>
        {openingDays.openingDays.map((openingDay, index) =>
          (<Row key={index}>
            <Col xs={4}>{openingDay.day}</Col>
            <Col xs={4}>{calculateTime(openingDay.startHour, openingDay.startMinute, openingDay.open, openingDay.allDay, openingDay.twelveHour, true)}</Col>
            <Col xs={4}>{calculateTime(openingDay.endHour, openingDay.endMinute, openingDay.open, openingDay.allDay, openingDay.twelveHour, false)}</Col>
          </Row>),
        )}
      </section>
    </div>
  );
}

ViewOpeningDay.propTypes = {
  initialValues: PropTypes.object,
};

export default ViewOpeningDay;
