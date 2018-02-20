/* eslint-disable linebreak-style */
import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Datepicker from '@folio/stripes-components/lib/Datepicker';
import TextField from '@folio/stripes-components/lib/TextField';
import stripesForm from '@folio/stripes-form';
import OpeningDayComponent from './OpeningDayComponent';
import PropTypes from 'prop-types';

const openingDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

/**
 * This component will be rendered inside a form in a component
 * that has passed through reduxForm(). As such, values for each field's
 * "name" key correspond to the properties of the object being rendered.
 */
class AddOpeningDayForm extends React.Component {
  static propTypes = {
    modifiedProps: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.modifiedProps = this.modifiedProps.bind(this);
  }

  modifiedProps() {
    console.log('this: ', this);
  }

  render() {
    return (
      <section>
        <Row>
          <Col xs={6}>
            <Field
              component={Datepicker}
              label="Opening period start date *"
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
              label="Opening period end date *"
              dateFormat="YYYY-MM-DD"
              name="endDate"
              id="addevent_endDate"
              backendDateStandard="YYYY-MM-DD"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Field
              component={TextField}
              label="Description *"
              name="description"
              id="addevent_description"
              required
            />
          </Col>
        </Row>

        <FieldArray name="openingDays" component={OpeningDayComponent} />

      </section>
    );
  }
}

// TODO: async validate for interval of opening!!!!

/*

          <Col xs={2}>
            <Field
              label="12 hour clock"
              name="twelveHour"
              type="checkbox"
              id="twelveHour"
              component={Checkbox}
            />
          </Col>
*/

export default stripesForm({
  form: 'addOpeningDayForm',
  navigationCheck: true,
  enableReinitialize: false,
})(AddOpeningDayForm);
