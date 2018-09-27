import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import Button from '@folio/stripes-components/lib/Button';
import { Col, Row } from '../../../stripes-components/lib/LayoutGrid';
import Checkbox from '../../../stripes-components/lib/Checkbox';
import Datepicker from '../../../stripes-components/lib/Datepicker/Datepicker';
import CalendarUtils from '../../CalendarUtils';
import TextField from '../../../stripes-components/lib/TextField/TextField';
import Textfield from '../../../stripes-components/lib/TextField';
import List from '../../../stripes-components/lib/List';
import PaneMenu from '../../../stripes-components/lib/PaneMenu';


class ExceptionalPeriodEditor extends React.Component {
    static propTypes = {
      servicePoints: PropTypes.object.isRequired,
      stripes: PropTypes.object,
      intl: PropTypes.object
    };

    render() {
      const items = this.props.servicePoints;
      const itemFormatter = (item) => (
        <li>
          <Checkbox
            id={item.id}
            label={item.name}
          />
        </li>
      );
      const isEmptyMessage = 'No items to show';
      const modifyStart = <Field
        name="item.startDate"
        component={Datepicker}
        label="TODO Valid From*"
        dateFormat={CalendarUtils.translateToString('ui-calendar.dateFormat', this.props.stripes.intl)}
        required
      />;

      const modifyEnd = <Field
        name="item.endDate"
        component={Datepicker}
        label="TODO Valid to"
        dateFormat={CalendarUtils.translateToString('ui-calendar.dateFormat', this.props.stripes.intl)}
        required
      />;

      const modifyName = <TextField
        name="periodName"
        component={Textfield}
        label="TODO Name"
        required
      />;

      return (
        <div>
          <Row>
            <Col>
              {modifyStart}
            </Col>
          </Row>
          <Row>
            <Col>
              {modifyEnd}
            </Col>
          </Row>
          <Row>
            <Col>
              {modifyName}
            </Col>
          </Row>
          <Row>
            <Col>
              <List
                items={items}
                itemFormatter={itemFormatter}
                isEmptyMessage={isEmptyMessage}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Checkbox id="allSelector" label="ALLSELECTOR" />
            </Col>
            <Col>
              <Checkbox id="allDeselector" label="ALLDESELECTOR" />
            </Col>
          </Row>
          <div style={{ height: '20px' }} />
          <Row>
            <Col>
              <Row>
                <div>TODODODO Open/Close</div>
              </Row>
              <Row>
                <Checkbox
                  label="Closed"
                />
              </Row>
            </Col>
          </Row>
          <div style={{ height: '20px' }} />
          <Row>
            <Col>
              <TextField
                name="openintTime"
                component={Textfield}
                label="TODO Opening Time"
                required
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <TextField
                name="closingTime"
                component={Textfield}
                label="TODO Closing Time"
                required
              />
            </Col>
          </Row>
        </div>
      );
    }
}

export default reduxForm({
  form: 'ExceptionalPeriodEditor',
})(ExceptionalPeriodEditor);
