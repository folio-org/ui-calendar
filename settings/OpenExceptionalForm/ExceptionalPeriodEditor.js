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
      allDay: PropTypes.object,
      allSelector: PropTypes.object,
      setStartDate: PropTypes.func,
      setEndDate: PropTypes.func,
      allSelectorHandle: PropTypes.func,
      setClosed: PropTypes.func,
      setAllDay: PropTypes.func,
      setName: PropTypes.func,
      setOpeningTime: PropTypes.func,
      setClosingTime: PropTypes.func,
      onToggleSelect: PropTypes.func,
    };

    constructor() {
      super();
      this.onToggleSelect = this.onToggleSelect.bind(this);
      this.allSelectorHandle = this.allSelectorHandle.bind(this);
      this.setStartDate = this.setStartDate.bind(this);
      this.setEndDate = this.setEndDate.bind(this);
      this.setClosed = this.setClosed.bind(this);
      this.setAllDay = this.setAllDay.bind(this);
      this.setName = this.setName.bind(this);
      this.setOpeningTime = this.setOpeningTime.bind(this);
      this.setClosingTime = this.setClosingTime.bind(this);
    }

    // componentDidUpdate() {
    //   let period = [{
    //     servicePointId: null,
    //     name: null,
    //     startDate: null,
    //     endDate: null,
    //     openingDays: [{
    //       openingDay: {
    //         openingHour: [{
    //           startTime: null,
    //           endTime: null,
    //         }],
    //         open: null,
    //         allDay: null,
    //       }
    //     }]
    //   }];
    //   const selectedServicePoints = [];
    //   // let k = 0;
    //   // for(let i = 0; i < this.state.servicePoints.length){
    //   //
    //   // }
    //   for (let i = 0; i < selectedServicePoints.length; i++) {
    //     period = {
    //       servicePointId: null,
    //       name: this.state.name,
    //       startDate: this.state.startDate,
    //       endDate: this.state.endDate,
    //       openingDays: [{
    //         openingDay: {
    //           openingHour: [{
    //             startTime: this.state.startTime,
    //             endTime: this.state.endTime,
    //           }],
    //           open: this.state.open,
    //           allDay: this.state.allDay,
    //         }
    //       }]
    //     };
    //   }
    // }

    setStartDate(e) {
      this.props.setStartDate(e);
    }

    setEndDate(e) {
      this.props.setEndDate(e);
    }

    allSelectorHandle(select) {
      this.props.allSelectorHandle(select);
    }

    setClosed() {
      this.props.setClosed();
    }

    setAllDay() {
      this.props.setAllDay();
    }

    setName(e) {
      this.props.setName(e);
    }

    setOpeningTime(e) {
      this.props.setOpeningTime(e);
    }

    setClosingTime(e) {
      this.props.setClosingTime(e);
    }

    onToggleSelect(event) {
      this.props.onToggleSelect(event);
    }

    render() {
      const items = this.props.servicePoints;
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
      if (this.props.allSelector === true) {
        allSelector =
          <Button
            onClick={() => { this.allSelectorHandle(true); }}
          >
              SELECTALL
          </Button>;
      } else {
        allSelector =
          <Button
            onClick={() => { this.allSelectorHandle(false); }}
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
                  label="CLOSED"
                  onChange={() => this.setClosed()}
                />
              </Row>
            </Col>
          </Row>
          <div style={{ height: '20px' }} />
          <Row>
            <Col>
              <Row>
                <div>ALLDAY -ALLNIGHT</div>
              </Row>
              <Row>
                <Checkbox
                  label="ALLDAY"
                  onChange={() => this.setAllDay()}
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
                disabled={this.props.allDay}
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
                disabled={this.props.allDay}
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
