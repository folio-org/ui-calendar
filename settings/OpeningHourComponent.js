import React from 'react';
import { Field } from 'redux-form';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import TextField from '@folio/stripes-components/lib/TextField';
import Button from '@folio/stripes-components/lib/Button';

const newOpeningHour = { startHour: '0', startMinute: '0', endHour: '0', endMinute: '0' };

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
            <Button fullWidth name="add" onClick={() => fields.insert(index + 1, newOpeningHour)}>
              {intl.formatMessage({ id: 'ui-calendar.settings.add' })}
            </Button>
          </Col>
          <Col xs={12} sm={2}>
            <Button fullWidth name="remove" buttonStyle="danger" disabled={fields.length === 1} onClick={() => fields.remove(index)}>
              {intl.formatMessage({ id: 'ui-calendar.settings.remove' })}
            </Button>
          </Col>
        </Row>
      </div>
    ))}
  </div>
  );


export default OpeningHourComponent;
