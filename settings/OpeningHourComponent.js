import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import TextField from '@folio/stripes-components/lib/TextField';
import Button from '@folio/stripes-components/lib/Button';

class OpeningHourComponent extends React.Component {
  static propTypes = {
    fields: PropTypes.object,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func,
    }),
    dayField: PropTypes.shape({
      open: PropTypes.bool,
      allDay: PropTypes.bool,
    }),
  }

  render() {
    const newOpeningHour = { startHour: 0, startMinute: 0, endHour: 0, endMinute: 0 };
    const { fields, intl, dayField } = this.props;
    const disableFields = !dayField.open || dayField.allDay;

    return (
      <div>
        {(fields || []).map((openingHour, index) => (
          <div key={index}>
            <Row>
              <Col xs={12} sm={2}>
                <Field
                  label=""
                  name={`${openingHour}.startHour`}
                  component={TextField}
                  disabled={disableFields}
                />
              </Col>
              <Col xs={12} sm={2}>
                <Field
                  label=""
                  name={`${openingHour}.startMinute`}
                  component={TextField}
                  disabled={disableFields}
                />
              </Col>
              <Col xs={12} sm={2}>
                <Field
                  label=""
                  name={`${openingHour}.endHour`}
                  component={TextField}
                  disabled={disableFields}
                />
              </Col>
              <Col xs={12} sm={2}>
                <Field
                  label=""
                  name={`${openingHour}.endMinute`}
                  component={TextField}
                  disabled={disableFields}
                />
              </Col>
              <Col xs={12} sm={2}>
                <Button fullWidth name="add" onClick={() => fields.insert(index + 1, newOpeningHour)} disabled={disableFields}>
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
  }
}

export default OpeningHourComponent;
