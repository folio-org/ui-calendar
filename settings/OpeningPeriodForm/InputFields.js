import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import {
  Field,
  reduxForm,
} from 'redux-form';

import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import {
  Datepicker,
  TextField,
  Row,
  Col,
} from '@folio/stripes/components';

class InputFields extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    onDateChange: PropTypes.func.isRequired,
    onNameChange: PropTypes.func.isRequired,
    nameValue: PropTypes.string.isRequired,
    modifyPeriod: PropTypes.object,
  };

  static defaultProps = {
    modifyPeriod: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      errorBoolean: false,
    };
  }

  parseDateToString(e) {
    let str = '';
    for (const p in e) {
      if (p !== undefined) {
        if (Object.prototype.hasOwnProperty.call(e, p) && p !== 'preventDefault') {
          str += e[p];
        }
      }
    }
    return str;
  }

  onBlur = () => {
    const { nameValue } = this.props;

    this.setState({
      errorBoolean: !nameValue,
    });
  };

  setStartDate = (e) => {
    this.props.onDateChange(true, this.parseDateToString(e.target.value));
  };

  setEndDate = (e) => {
    this.props.onDateChange(false, this.parseDateToString(e.target.value));
  };

  setName = (e) => {
    this.props.onNameChange(e.target.value);
  };

  render() {
    const {
      intl: {
        formatMessage,
      },
      modifyPeriod: {
        name: modifyPeriodName,
      },
      modifyPeriod,
    } = this.props;
    const { errorBoolean } = this.state;

    return (
      <div data-test-input-fields>
        <Row>
          <Col
            data-test-item-start-date
            sm={4}
          >
            <Field
              required
              timeZone="UTC"
              name="item.startDate"
              backendDateStandard="YYYY-MM-DD"
              component={Datepicker}
              label={<FormattedMessage id="ui-calendar.validFrom" />}
              dateFormat={formatMessage({ id: 'ui-calendar.dateFormat' })}
              onChange={this.setStartDate}
            />
          </Col>
        </Row>
        <Row>
          <Col
            data-test-item-end-date
            sm={4}
          >
            <Field
              required
              timeZone="UTC"
              name="item.endDate"
              backendDateStandard="YYYY-MM-DD"
              component={Datepicker}
              label={<FormattedMessage id="ui-calendar.validTo" />}
              dateFormat={formatMessage({ id: 'ui-calendar.dateFormat' })}
              onChange={this.setEndDate}
            />
          </Col>
        </Row>
        <Row>
          <Col
            data-test-item-period-name
            sm={4}
          >
            <Field
              required
              name="periodName"
              id="input-period-name"
              component={TextField}
              label={<FormattedMessage id="ui-calendar.name" />}
              value={modifyPeriodName || ''}
              {...(isEmpty(modifyPeriod) && { onBlur: this.onBlur })}
              {...(errorBoolean && {
                error: <div data-test-item-period-name-error><FormattedMessage id="ui-calendar.fillIn" /></div>
              })}
              onChange={this.setName}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default reduxForm({
  form: 'InputFields',
})(injectIntl(InputFields));
