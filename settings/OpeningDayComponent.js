import React, { PropTypes } from 'react';
import { Field, FieldArray } from 'redux-form';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Datepicker from '@folio/stripes-components/lib/Datepicker';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';

function OpeningDayComponent(values) {
  // console.log('param: ', openingDays.fields);
  // console.log('fields: ', fields);

  /* const meridiemOptions = [
    { label: 'AM', value: 'am' },
    { label: 'PM', value: 'pm' },
  ];*/

  return (<div>
    {(values.fields || []).map((openingDay, index) => (
      <div key={index}>
        <Row>
          <Col xs={12} sm={2}>
            <Field
              label="Day"
              name={`${openingDay}.day`}
              component={TextField}
              disabled="true"
            />
          </Col>
          <Col xs={12} sm={1}>
            <Field
              label="Open"
              name={`${openingDay}.open`}
              type="checkbox"
              id={`open-${index}`}
              component={Checkbox}
            />
          </Col>
          <Col xs={12} sm={1}>
            <Field
              label="All day"
              name={`${openingDay}.allDay`}
              type="checkbox"
              id={`allDay-${index}`}
              component={Checkbox}
            />
          </Col>
          <Col xs={12} sm={2}>
            <Field
              label="Opening hour"
              name={`${openingDay}.startHour`}
              component={TextField}
              disabled={openingDay.open === false}
            />
          </Col>
          <Col xs={12} sm={2}>
            <Field
              label="Opening minute"
              name={`${openingDay}.startMinute`}
              component={TextField}
            />
          </Col>
          <Col xs={12} sm={2}>
            <Field
              label="Closing hour"
              name={`${openingDay}.endHour`}
              component={TextField}
            />
          </Col>
          <Col xs={12} sm={2}>
            <Field
              label="Closing minute"
              name={`${openingDay}.endMinute`}
              component={TextField}
            />
          </Col>
        </Row>
        <hr />
      </div>
    ))}
  </div>
  );
}

/*

          <Col xs={12} sm={1}>
            <Field
              label="Meridiem"
              name={`${openingDay}.endMeridiem`}
              component={Select}
              id={`end-meridiem-${index}`}
              dataOptions={[{ label: 'Select meridiem', value: '' }, ...meridiemOptions]}
            />
          </Col>

          <Col xs={12} sm={1}>
            <Field
              label="Meridiem"
              name={`${openingDay}.startMeridiem`}
              component={Select}
              id={`start-meridiem-${index}`}
              dataOptions={[{ label: 'Select meridiem', value: '' }, ...meridiemOptions]}
            />
          </Col>

*/

export default OpeningDayComponent;
