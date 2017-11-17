import React, { PropTypes } from 'react';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import { Field } from 'redux-form';
import Button from '@folio/stripes-components/lib/Button';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Datepicker from '@folio/stripes-components/lib/Datepicker';
import TextField from '@folio/stripes-components/lib/TextField';
import stripesForm from '@folio/stripes-form';

class AddOpeningDayForm extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    mutator: PropTypes.shape({
      calendarEventId: PropTypes.shape({
        replace: PropTypes.func,
      }),
      calendarEvent: PropTypes.shape({
        POST: PropTypes.func,
        PUT: PropTypes.func,
      }),
    }).isRequired,
  };

  render() {
    return (
      <form id="form-add-event">
        <Row>
          <Col xs={6}>
            <Field
              component={Datepicker}
              label="Opening start date"
              dateFormat="YYYY-MM-DD"
              name="openingStart"
              id="addevent_openingStart"
              backendDateStandard="YYYY-MM-DD"
            />
          </Col>
          <Col xs={6}>
            <Field
              component={Datepicker}
              label="Opening end date"
              dateFormat="YYYY-MM-DD"
              name="openingEnd"
              id="addevent_openingEnd"
              backendDateStandard="YYYY-MM-DD"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Field
              component={Checkbox}
              label="Monday"
              name="monday"
              id="addevent_monday"
            />
          </Col>
          <Col>
            <Field
              component={Checkbox}
              label="Tuesday"
              name="tuesday"
              id="addevent_tuesday"
            />
          </Col>
          <Col>
            <Field
              component={Checkbox}
              label="Wednesday"
              name="wednesday"
              id="addevent_wednesday"
            />
          </Col>
          <Col>
            <Field
              component={Checkbox}
              label="Thursday"
              name="thursday"
              id="addevent_thursday"
            />
          </Col>
          <Col>
            <Field
              component={Checkbox}
              label="Friday"
              name="friday"
              id="addevent_friday"
            />
          </Col>
          <Col>
            <Field
              component={Checkbox}
              label="Saturday"
              name="saturday"
              id="addevent_saturday"
            />
          </Col>
          <Col>
            <Field
              component={Checkbox}
              label="Sunday"
              name="sunday"
              id="addevent_sunday"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <Field
              component={TextField}
              label="Start hour"
              name="startHour"
              id="addevent_starthour"
            />
          </Col>
          <Col xs={6}>
            <Field
              component={TextField}
              label="Start minute"
              name="startMinute"
              id="addevent_startminute"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <Field
              component={TextField}
              label="End hour"
              name="endHour"
              id="addevent_endhour"
            />
          </Col>
          <Col xs={6}>
            <Field
              component={TextField}
              label="End minute"
              name="endMinute"
              id="addevent_endminute"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button id="save_opening_day" title="Save" type="submit"> Save </Button>
          </Col>
        </Row>
      </form>
    );
  }
}

export default stripesForm({
  form: 'addOpeningDayForm',
  navigationCheck: true,
  enableReinitialize: true,
})(AddOpeningDayForm);
