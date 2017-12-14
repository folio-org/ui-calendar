import React, { PropTypes } from 'react';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import { Field } from 'redux-form';
import Button from '@folio/stripes-components/lib/Button';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Datepicker from '@folio/stripes-components/lib/Datepicker';
import TextField from '@folio/stripes-components/lib/TextField';
import stripesForm from '@folio/stripes-form';


function validate(values) {
  const errors = {};

  if (!values.startDate) {
    errors.startDate = 'Please select start date for opening!';
  }

  if (!values.endDate) {
    errors.endDate = 'Please select end date for opening!';
  }

  // TODO: check included days

  if (!values.startHour) {
    errors.startHour = 'Please select start hour for opening!';
  }

  if (!values.startMinute) {
    errors.startMinute = 'Please select start minute for opening!';
  }

  if (!values.endHour) {
    errors.endHour = 'Please select end hour for opening!';
  }

  if (!values.endMinute) {
    errors.endMinute = 'Please select end minute for opening!';
  }

  return errors;
}


class AddOpeningDayForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    initialValues: PropTypes.object.isRequired, // eslint-disable-line react/no-unused-prop-types  
  };

  render() {
    const {
      handleSubmit,
      reset,  // eslint-disable-line no-unused-vars
      pristine,
      submitting,
    } = this.props;

    return (
      <form id="form-add-event">
        <Row>
          <Col xs={6}>
            <Field
              component={Datepicker}
              label="Opening start date *"
              dateFormat="YYYY-MM-DD"
              name="startDate"
              id="addevent_startDate"
              backendDateStandard="YYYY-MM-DD"
              required
            />
          </Col>
          <Col xs={6}>
            <Field
              component={Datepicker}
              label="Opening end date"
              dateFormat="YYYY-MM-DD"
              name="endDate"
              id="addevent_endDate"
              backendDateStandard="YYYY-MM-DD"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Field
              component={Checkbox}
              label="Monday"
              name="daysIncluded.monday"
              id="addevent_monday"
            />
          </Col>
          <Col>
            <Field
              component={Checkbox}
              label="Tuesday"
              name="daysIncluded.tuesday"
              id="addevent_tuesday"
            />
          </Col>
          <Col>
            <Field
              component={Checkbox}
              label="Wednesday"
              name="daysIncluded.wednesday"
              id="addevent_wednesday"
            />
          </Col>
          <Col>
            <Field
              component={Checkbox}
              label="Thursday"
              name="daysIncluded.thursday"
              id="addevent_thursday"
            />
          </Col>
          <Col>
            <Field
              component={Checkbox}
              label="Friday"
              name="daysIncluded.friday"
              id="addevent_friday"
            />
          </Col>
          <Col>
            <Field
              component={Checkbox}
              label="Saturday"
              name="daysIncluded.saturday"
              id="addevent_saturday"
            />
          </Col>
          <Col>
            <Field
              component={Checkbox}
              label="Sunday"
              name="daysIncluded.sunday"
              id="addevent_sunday"
            />
          </Col>
          <Col>
            <Field
              component={Checkbox}
              label="All days"
              name="daysIncluded.allDays"
              id="addevent_alldays"
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
            <Button id="save_opening_day" title="Save" type="submit" disabled={pristine || submitting} onClick={handleSubmit}> Save </Button>
          </Col>
        </Row>
      </form>
    );
  }
}

export default stripesForm({
  form: 'addOpeningDayForm',
  validate,
  navigationCheck: true,
  enableReinitialize: true,
})(AddOpeningDayForm);
