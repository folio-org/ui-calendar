/* eslint-disable linebreak-style,react/jsx-no-comment-textnodes */
import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Datepicker from '@folio/stripes-components/lib/Datepicker';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import Button from '@folio/stripes-components/lib/Button';
import OpeningHourComponent from './OpeningHourComponent';
import FormattedMessage from 'react-intl'

const OpeningDayComponent = ({ fields, intl }) =>
  (<div>
    {(fields || []).map((openingDay, index) => (
      <div key={index}>
        <Row>
          <Col xs={12} sm={1}>            
            <Field
              label=""
              name={`${openingDay}.day`}
              component={TextField}
              disabled="true"              
            />
          </Col>
          <Col xs={12} sm={1}>
            <Field
              label={intl.formatMessage({id: "ui-calendar.settings.opening"})}
              name={`${openingDay}.open`}
              type="checkbox"
              id={`open-${index}`}
              component={Checkbox}
            />
          </Col>
          <Col xs={12} sm={1}>
            <Field
              label={intl.formatMessage({id: "ui-calendar.settings.allDay"})}
              name={`${openingDay}.allDay`}
              type="checkbox"
              id={`allDay-${index}`}
              component={Checkbox}
            />
          </Col>
          <Col xs={12} sm={9}>
            <FieldArray name={`${openingDay}.openingHour`} component={OpeningHourComponent} intl={intl}/>
          </Col>
        </Row>
        <hr />
      </div>
    ))}
  </div>
  );

export default OpeningDayComponent;
