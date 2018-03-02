/* eslint-disable linebreak-style,react/jsx-no-comment-textnodes */
import React from 'react';
import PropTypes from 'prop-types';
import FormattedMessage from 'react-intl';

import { Field, FieldArray } from 'redux-form';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Datepicker from '@folio/stripes-components/lib/Datepicker';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import Button from '@folio/stripes-components/lib/Button';

const OpeningHourComponent = ({ fields, intl }) =>
  (<div>
    {(fields || []).map((openingHour, index) => (
      <div key={index}>
        <Row>
          <Col xs={12} sm={2}>          
            <Field
              label=""
              name={`${openingHour}.startHour`}
              component={TextField}
              disabled={openingHour.open === false}
            />
          </Col>
          <Col xs={12} sm={2}>
            <Field
              label=""
              name={`${openingHour}.startMinute`}
              component={TextField}
            />
          </Col>
          <Col xs={12} sm={2}>
            <Field
              label=""
              name={`${openingHour}.endHour`}
              component={TextField}
            />
          </Col>
          <Col xs={12} sm={2}>
            <Field
              label=""
              name={`${openingHour}.endMinute`}
              component={TextField}
            />
          </Col>
          <Col xs={12} sm={2}>
            <Button fullWidth name="add" onClick={() => fields.push({ startHour: '0', startMinute: '0', endHour: '0', endMinute: '0' })}>
              {intl.formatMessage({id: "ui-calendar.settings.add"})}
            </Button>
          </Col>
          <Col xs={12} sm={2}>
            <Button fullWidth name="remove" buttonStyle="danger" onClick={() => fields.remove(index)}>
              {intl.formatMessage({id: "ui-calendar.settings.remove"})}
            </Button>
          </Col>
        </Row>
      </div>
    ))}
  </div>
  );


export default OpeningHourComponent;
