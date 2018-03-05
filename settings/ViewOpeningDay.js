import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate } from 'react-intl';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import { stripesShape } from '@folio/stripes-core/src/Stripes';

function padNumber(param) {
  return (param > 9) ? param : `0${param}`;
}

function calculateTime(startHour, startMinute, endHour, endMinute, open, allDay) {
  if (!open) {
    return 'Closed';
  } else if (open && allDay) {
    return '00:00-24:00';
  } else {
    return `${padNumber(startHour)}:${padNumber(startMinute)}-${padNumber(endHour)}:${padNumber(endMinute)}`;
  }
}

function ViewOpeningDay(props) {
  const openingDays = props.initialValues;

  return (
    <div>
      <section>
        <Row>
          <Col xs={12}><h2 style={{ marginTop: '0' }}>{props.stripes.intl.formatMessage({ id: 'ui-calendar.settings.openingPeriod' })}</h2></Col>
        </Row>
        <Row>
          <Col xs={4}><h4>{props.stripes.intl.formatMessage({ id: 'ui-calendar.settings.openingPeriodStart' })}</h4></Col>
          <Col xs={4}><h4>{props.stripes.intl.formatMessage({ id: 'ui-calendar.settings.openingPeriodEnd' })}</h4></Col>
        </Row>
        <Row>
          <Col xs={4}><FormattedDate value={openingDays.startDate} /></Col>
          <Col xs={4}><FormattedDate value={openingDays.endDate} /></Col>
        </Row>
        <Row>
          <Col xs={4}><h4>{props.stripes.intl.formatMessage({ id: 'ui-calendar.settings.day' })}</h4></Col>
          <Col xs={8}><h4>{props.stripes.intl.formatMessage({ id: 'ui-calendar.settings.openingTime' })}</h4></Col>
        </Row>
        {openingDays.openingDays.map((openingDay, index) =>
          (<Row key={`day-${index}`}>
            <Col xs={4}>{openingDay.day}</Col>
            <Row key={`opening-times-${index}`}>
              {openingDay.openingHour.map((openingHour, hourIndex) => (
                <Col xs={12} key={`day-${index}-hour-${hourIndex}`}>
                  {calculateTime(openingHour.startHour, openingHour.startMinute, openingHour.endHour, openingHour.endMinute, openingDay.open, openingDay.allDay)}
                </Col>
              ))}
            </Row>
          </Row>),
        )}
      </section>
    </div>
  );
}

ViewOpeningDay.propTypes = {
  initialValues: PropTypes.object,
  stripes: stripesShape.isRequired,
};

export default ViewOpeningDay;
