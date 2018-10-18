import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import Button from '@folio/stripes-components/lib/Button';
import { Col, Row } from '../../../stripes-components/lib/LayoutGrid';
import Checkbox from '../../../stripes-components/lib/Checkbox';
import Datepicker from '../../../stripes-components/lib/Datepicker/Datepicker';
import CalendarUtils from '../../CalendarUtils';
import Textfield from '../../../stripes-components/lib/TextField';
import List from '../../../stripes-components/lib/List';
import Timepicker from '../../../stripes-components/lib/Timepicker';
import Label from '../../../ui-users/src/components/Label/Label';


class ExceptionalPeriodEditor extends React.Component {
    static propTypes = {
      servicePoints: PropTypes.object.isRequired,
      stripes: PropTypes.object,
      intl: PropTypes.object,
      allDay: PropTypes.bool.isRequired,
      allSelector: PropTypes.object.isRequired,
      setStartDate: PropTypes.func.isRequired,
      setEndDate: PropTypes.func.isRequired,
      allSelectorHandle: PropTypes.func.isRequired,
      setClosed: PropTypes.func.isRequired,
      setAllDay: PropTypes.func.isRequired,
      setName: PropTypes.func.isRequired,
      setStartTime: PropTypes.func.isRequired,
      setEndTime: PropTypes.func.isRequired,
      setEditorServicePoints: PropTypes.func.isRequired,
      editor: PropTypes.object,
      isModify: PropTypes.bool,
      editorServicePoints: PropTypes.object
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
      this.setStartTime = this.setStartTime.bind(this);
      this.setEndTime = this.setEndTime.bind(this);
      this.setModifyed = this.setModifyed.bind(this);
      this.getAllday = this.getAllday.bind(this);
    }

    componentWillMount() {
      if (this.props.isModify) {
        this.setState({
          servicePoints: this.props.editorServicePoints,
        });
      } else {
        this.setState({
          servicePoints: this.props.servicePoints,
        });
      }
    }

    componentDidMount() {
      if (this.props.isModify) {
        console.log(this.props.editor);
        this.props.setName(this.props.editor.name);
        this.props.setStartDate(this.props.editor.startDate);
        this.props.setEndDate(this.props.editor.endDate);
        this.props.setStartTime(this.props.editor.startTime);
        this.props.setEndTime(this.props.editor.endTime);
      }
    }

    setModifyed() {
      this.setState({
        modifyed: true,
      });
    }

    setStartDate(e) {
      this.props.setStartDate(e);
      this.setModifyed;
    }

    setEndDate(e) {
      this.props.setEndDate(e);
      this.setModifyed;
    }

    allSelectorHandle(select) {
      this.props.allSelectorHandle(select, this.state.servicePoints);
      this.setModifyed;
    }

    setClosed() {
      this.props.setClosed(this.state.closed);
      this.setModifyed;
    }

    setAllDay() {
      this.props.setAllDay(this.props.allDay);
      this.setModifyed;
    }

    setName(e) {
      this.props.setName(e.target.value);
    }

    setStartTime(e, value) {
      // const string = value;
      // const result = string.split(':');
      // const final = `${result[0]}:${result[1]}`;
      this.props.setStartTime(value);
      this.setModifyed;
    }

    setEndTime(e, value) {
      // const string = value;
      // const result = string.split(':');
      // const final = `${result[0]}:${result[1]}`;
      this.props.setEndTime(value);
      this.setModifyed;
    }

    onToggleSelect(event) {
      event.selected = !event.selected;

      let tempServicePoints;

      if (this.props.isModify) {
        tempServicePoints = this.props.editorServicePoints;
      } else {
        tempServicePoints = this.state.servicePoints;
      }


      for (let i = 0; i < tempServicePoints.length; i++) {
        if (tempServicePoints[i].id === event.id) {
          tempServicePoints[i].selected = event.selected;
        }
      }
      this.props.setEditorServicePoints(tempServicePoints);
      this.setState({
        servicePoints: tempServicePoints,
      });
    }

    getAllday() {
      let allday = false;
      if (this.props.isModify) {
        allday = this.props.editor.allDay;
      }
      return allday;
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
        label={CalendarUtils.translateToString('ui-calendar.validFrom', this.props.stripes.intl)}
        dateFormat={CalendarUtils.translateToString('ui-calendar.dateFormat', this.props.stripes.intl)}
        onChange={this.setStartDate}
        required
      />;

      const endDate = <Field
        name="item.endDate"
        component={Datepicker}
        label={CalendarUtils.translateToString('ui-calendar.validTo', this.props.stripes.intl)}
        dateFormat={CalendarUtils.translateToString('ui-calendar.dateFormat', this.props.stripes.intl)}
        onChange={this.setEndDate}
        required
      />;

      const nameField = <Field
        name="item.periodName"
        component={Textfield}
        label={CalendarUtils.translateToString('ui-calendar.name', this.props.stripes.intl)}
        onChange={this.setName}
        required
      />;

      let allSelector;
      if (this.props.allSelector === false) {
        allSelector =
          <Button
            onClick={() => { this.allSelectorHandle(false); }}
          >
            {CalendarUtils.translateToString('ui-calendar.deselectAll', this.props.stripes.intl)}
          </Button>;
      } else {
        allSelector =
          <Button
            onClick={() => { this.allSelectorHandle(true); }}
          >
            {CalendarUtils.translateToString('ui-calendar.selectAll', this.props.stripes.intl)}
          </Button>;
      }

      let timeSetter = null;
      if (this.props.allDay !== true || this.props.allDay === null) {
        timeSetter =
          <div>
            <Row>
              <Col>
                <div>
                  <Field
                    name="item.openingTime"
                    component={Timepicker}
                    label={CalendarUtils.translateToString('ui-calendar.openingTime', this.props.stripes.intl)}
                    onChange={this.setStartTime}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div>
                  <Field
                    name="item.closingTime"
                    component={Timepicker}
                    label={CalendarUtils.translateToString('ui-calendar.closingTime', this.props.stripes.intl)}
                    onChange={this.setEndTime}
                  />
                </div>
              </Col>
            </Row>
          </div>;
      }

      let checkbox = null;
      if (this.props.isModify) {
        checkbox = <Checkbox
          label={CalendarUtils.translateToString('ui-calendar.settings.allDay', this.props.stripes.intl)}
          onChange={() => this.setAllDay()}
          checked={this.getAllday()}
        />;
      } else {
        checkbox = <Checkbox
          label={CalendarUtils.translateToString('ui-calendar.settings.allDay', this.props.stripes.intl)}
          onChange={() => this.setAllDay()}
        />;
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
          <div style={{ height: '20px' }} />
          <Row>
            <Col>
              <div>
                {CalendarUtils.translateToString('ui-calendar.settings.openingPeriodEnd', this.props.stripes.intl)}
              </div>
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
                <Checkbox
                  label={CalendarUtils.translateToString('ui-calendar.settings.closed', this.props.stripes.intl)}
                  onChange={() => this.setClosed()}
                />
              </Row>
            </Col>
          </Row>
          <div style={{ height: '20px' }} />
          <Row>
            <Col>
              <Row>
                {checkbox}
              </Row>
            </Col>
          </Row>
          <div style={{ height: '20px' }} />
          {timeSetter}
        </div>
      );
    }
}

export default reduxForm({
  form: 'ExceptionalPeriodEditor',
})(ExceptionalPeriodEditor);
