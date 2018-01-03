import React, { PropTypes } from 'react';
import { Field, FieldArray } from 'redux-form';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Datepicker from '@folio/stripes-components/lib/Datepicker';
import TextField from '@folio/stripes-components/lib/TextField';

function OpeningDayComponent(values) {
  // console.log('param: ', openingDays.fields);
  // console.log('fields: ', fields);
  return (<div>
    {(values.fields || []).map((openingDay, index) => (
      <div key={index}>
        <Row>
          <Col xs={12} sm={3}>
            <Field
              label="Day"
              name={`${openingDay}.day`}
              component={TextField}
              disabled="true"
            />
          </Col>
          <Col xs={12} sm={3}>
            <Field
              label="Start hour"
              name={`${openingDay}.startHour`}
              component={TextField}
              disabled={`${openingDay}.open` === false}
            />
          </Col>
          <Col xs={12} sm={3}>
            <Field
              label="Start minute"
              name={`${openingDay}.startMinute`}
              component={TextField}
            />
          </Col>
          <Col xs={12} sm={3}>
            <Field
              label="End hour"
              name={`${openingDay}.endHour`}
              component={TextField}
            />
          </Col>
          <Col xs={12} sm={3}>
            <Field
              label="End minute"
              name={`${openingDay}.endMinute`}
              component={TextField}
            />
          </Col>
          <Col xs={12} sm={3}>
            <Field
              label="All day"
              name={`${openingDay}.allDay`}
              type="checkbox"
              id={`allDay-${index}`}
              component={Checkbox}
            />
          </Col>
          <Col xs={12} sm={3}>
            <Field
              label="Open"
              name={`${openingDay}.open`}
              type="checkbox"
              id={`open-${index}`}
              component={Checkbox}
            />
          </Col>
          <Col xs={12} sm={3}>
            <Field
              label="12 hour clock"
              name={`${openingDay}.twelveHour`}
              type="checkbox"
              id={`twelveHour-${index}`}
              component={Checkbox}
            />
          </Col>
        </Row>
        <hr />
      </div>
    ))}
  </div>
  );
}

export default OpeningDayComponent;
