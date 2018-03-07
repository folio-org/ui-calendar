import React from 'react';
import { Field, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Datepicker from '@folio/stripes-components/lib/Datepicker';
import TextField from '@folio/stripes-components/lib/TextField';
import stripesForm from '@folio/stripes-form';
import { stripesShape } from '@folio/stripes-core/src/Stripes';
import OpeningDayComponent from './OpeningDayComponent';

/**
 * This component will be rendered inside a form in a component
 * that has passed through reduxForm(). As such, values for each field's
 * "name" key correspond to the properties of the object being rendered.
 */
class AddOpeningDayForm extends React.Component {

  static propTypes = {
    stripes: stripesShape.isRequired,
    days: PropTypes.arrayOf(PropTypes.string),
  }

  render() {
    return (
      <section>
        <Row>
          <Col xs={6}>
            <Field
              component={Datepicker}
              label={`${this.props.stripes.intl.formatMessage({ id: 'ui-calendar.settings.openingPeriodStart' })} *`}
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
              label={`${this.props.stripes.intl.formatMessage({ id: 'ui-calendar.settings.openingPeriodEnd' })} *`}
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
              label={`${this.props.stripes.intl.formatMessage({ id: 'ui-calendar.settings.description' })} *`}
              name="description"
              id="addevent_description"
              required
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={1}>
            {this.props.stripes.intl.formatMessage({ id: 'ui-calendar.settings.day' })}
          </Col>
          <Col xs={12} sm={2} />
          <Col xs={12} sm={3}>
            {this.props.stripes.intl.formatMessage({ id: 'ui-calendar.settings.open' })}
          </Col>
          <Col xs={12} sm={3}>
            {this.props.stripes.intl.formatMessage({ id: 'ui-calendar.settings.close' })}
          </Col>
          <Col xs={12} sm={3} />
        </Row>
        <FieldArray name="openingDays" component={OpeningDayComponent} intl={this.props.stripes.intl} days={this.props.days} />
      </section>
    );
  }
}

export default stripesForm({
  form: 'addOpeningDayForm',
  navigationCheck: true,
  enableReinitialize: false,
  asyncBlurFields: [],
})(AddOpeningDayForm);
