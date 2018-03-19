import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import dateFormat from 'dateformat';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import { stripesShape } from '@folio/stripes-core/src/Stripes';

function calculateTime(startTime, endTime, open, allDay) {
  if (!open) {
    return <FormattedMessage id={'ui-calendar.settings.closed'} />;
  } else if (open && allDay) {
    return <FormattedMessage id={'ui-calendar.settings.allDay'} />;
  } else {
    const currentDate = new Date();
    const start = moment(`${dateFormat(currentDate, 'yyyy-mm-dd')}T${startTime}`);
    const end = moment(`${dateFormat(currentDate, 'yyyy-mm-dd')}T${endTime}`);
    return <div><FormattedTime value={start} />-<FormattedTime value={end} /></div>;
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
            <Col xs={4}><FormattedMessage id={`ui-calendar.${openingDay.day}`} /></Col>
            <Row key={`opening-times-${index}`}>
              {openingDay.openingHour.map((openingHour, hourIndex) => (
                <Col xs={12} key={`day-${index}-hour-${hourIndex}`}>
                  {calculateTime(openingHour.startTime, openingHour.endTime, openingDay.open, openingDay.allDay)}
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
