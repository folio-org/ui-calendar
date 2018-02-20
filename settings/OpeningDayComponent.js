/* eslint-disable linebreak-style,react/jsx-no-comment-textnodes */
import React from 'react';
import PropTypes from 'prop-types';
import {Field, FieldArray} from 'redux-form';
import {Row, Col} from '@folio/stripes-components/lib/LayoutGrid';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Datepicker from '@folio/stripes-components/lib/Datepicker';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import Button from '@folio/stripes-components/lib/Button';
import AddOpeningDayForm from './AddOpeningDayForm';


class OpeningDayComponent extends React.Component {

  static propTypes = {
    fields: PropTypes.object,
    modifiedProps: PropTypes.func,
  };
  constructor(props) {
    super(props);
    console.log('props: ', props);
    console.log('props.fields: ', props.fields);
  }
  modifiedProps(modifiedFields, index) {
    modifiedFields.push();
    this.render();
  }

  render() {
    // this.getDefaultPeriods(values);
    const modifiedFields = this.props.fields;
    return (<div>
        {(modifiedFields || []).map((openingDay, index) => (
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
              <Col xs={12} sm={2}>
                <Field
                  label="Open"
                  name={`${openingDay}.open`}
                  type="checkbox"
                  id={`open-${index}`}
                  component={Checkbox}
                />
              </Col>
              <Col xs={12} sm={2}>
                <Field
                  label="All day"
                  name={`${openingDay}.allDay`}
                  type="checkbox"
                  id={`allDay-${index}`}
                  component={Checkbox}
                />
              </Col>
              <Col xs={12} sm={1}>
                <Field
                  label="Opening hour"
                  name={`${openingDay}.startHour`}
                  component={TextField}
                  disabled={openingDay.open === false}
                />
              </Col>
              <Col xs={12} sm={1}>
                <Field
                  label="Opening minute"
                  name={`${openingDay}.startMinute`}
                  component={TextField}
                />
              </Col>
              <Col xs={12} sm={1}>
                <Field
                  label="Closing hour"
                  name={`${openingDay}.endHour`}
                  component={TextField}
                />
              </Col>
              <Col xs={12} sm={1}>
                <Field
                  label="Closing minute"
                  name={`${openingDay}.endMinute`}
                  component={TextField}
                />
              </Col>
              <Col xs={12} sm={1}>
                <Button fullWidth name="add"
                        onClick={() => this.modifiedProps(modifiedFields)}>Add</Button>
              </Col>
            </Row>
            <hr/>
          </div>
        ))}
      </div>
    );
  };
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
