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


class ExceptionalPeriodEditor extends React.Component {
    static propTypes = {
      servicePoints: PropTypes.object.isRequired,
      stripes: PropTypes.object,
      intl: PropTypes.object,
    };

    constructor() {
      super();
      this.onToggleSelect = this.onToggleSelect.bind(this);
      this.allSelectorHandle = this.allSelectorHandle.bind(this);
      this.setStartDate = this.setStartDate.bind(this);
      this.setEndDate = this.setEndDate.bind(this);
      this.parseDateToString = this.parseDateToString.bind(this);
      this.setClosed = this.setClosed.bind(this);
      this.setName = this.setName.bind(this);
      this.setOpeningTime = this.setOpeningTime.bind(this);
      this.setClosingTime = this.setClosingTime.bind(this);
    }

    componentWillMount() { // eslint-disable-line react/no-deprecated
      this.setState({
        servicePoints: this.props.servicePoints,
        allSelector: true,
        closed: false,
      });
    }

    setStartDate(e) {
      this.setState({
        startDate: this.parseDateToString(e),
      });
    }

    setEndDate(e) {
      this.setState({
        endDate: this.parseDateToString(e),
      });
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

    allSelectorHandle(select) {
      const tempServicePoints = this.state.servicePoints;
      for (let i = 0; i < tempServicePoints.length; i++) {
        tempServicePoints[i].selected = select;
      }
      if (select === true) {
        this.setState({
          servicePoints: tempServicePoints,
          allSelector: false
        });
      } else {
        this.setState({
          servicePoints: tempServicePoints,
          allSelector: true
        });
      }
    }

    setClosed() {
      if (this.state.closed === false) {
        this.setState({
          closed: true
        });
      } else {
        this.setState({
          closed: false
        });
      }
    }

    setName(e) {
      this.setState({
        name: e.target.value,
      });
    }

    setOpeningTime(e) {
      this.setState({
        openingTime: e.target.value,
      });
    }

    setClosingTime(e) {
      this.setState({
        closingTime: e.target.value,
      });
    }

    onToggleSelect(event) {
      event.selected = !event.selected;
      const tempServicePoints = this.state.servicePoints;
      for (let i = 0; i < tempServicePoints.length; i++) {
        if (tempServicePoints[i].id === event.id) {
          tempServicePoints[i].selected = event.selected;
        }
      }
      this.setState({
        servicePoints: tempServicePoints,
      });
    }

    render() {
      const items = this.state.servicePoints;
      const itemFormatter = (item) => (
        <li>
          <div className="CircleDiv" style={{ background: item.color }} />
          <Checkbox
            id={item.id}
            label={item.name}
            checked={item.selected}
            onChange={() => this.onToggleSelect(item)}
          />
        </li>
      );
      const isEmptyMessage = 'No items to show';
      const startDate = <Field
        name="item.startDate"
        component={Datepicker}
        label="TODO Valid From*"
        dateFormat={CalendarUtils.translateToString('ui-calendar.dateFormat', this.props.stripes.intl)}
        onChange={this.setStartDate}
        required
      />;

      const endDate = <Field
        name="item.endDate"
        component={Datepicker}
        label="TODO Valid to"
        dateFormat={CalendarUtils.translateToString('ui-calendar.dateFormat', this.props.stripes.intl)}
        onChange={this.setEndDate}
        required
      />;

      const nameField = <TextField
        name="periodName"
        component={Textfield}
        label="TODO Name"
        onChange={this.setName}
        required
      />;

      let allSelector;
      if (this.state.allSelector === true) {
        allSelector =
          <Button
            onClick={() => {
              this.allSelectorHandle(true);
          }}
          >
        SELECTALL
          </Button>;
      } else {
        allSelector =
          <Button
            onClick={() => {
                  this.allSelectorHandle(false);
              }}
          >
            DESELECTALL
          </Button>;
      }

      return (
        <div>
          <Row>
            <Col>
              {startDate}
            </Col>
          </Row>
          <Row>
            <Col>
              {endDate}
            </Col>
          </Row>
          <Row>
            <Col>
              {nameField}
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
              {allSelector}
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
                  onChange={() => this.setClosed()}
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
                onChange={this.setOpeningTime}
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
                onChange={this.setClosingTime}
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
