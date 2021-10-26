import React from 'react';
import PropTypes from 'prop-types';
import {
  Field,
  reduxForm
} from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Checkbox,
  Col,
  Datepicker,
  Label,
  List,
  Row,
  TextField,
  Timepicker
} from '@folio/stripes/components';

import { ALL_DAY } from '../constants';

class ExceptionalPeriodEditor extends React.Component {
  static propTypes = {
    allSelector: PropTypes.bool,
    editor: PropTypes.object.isRequired,
    servicePoints: PropTypes.arrayOf(PropTypes.object).isRequired,
    editorServicePoints: PropTypes.arrayOf(PropTypes.object).isRequired,
    allDay: PropTypes.bool,
    closed: PropTypes.bool,
    isModify: PropTypes.bool,
    setName: PropTypes.func.isRequired,
    setClosed: PropTypes.func.isRequired,
    setAllDay: PropTypes.func.isRequired,
    setEndDate: PropTypes.func.isRequired,
    setEndTime: PropTypes.func.isRequired,
    setStartTime: PropTypes.func.isRequired,
    setStartDate: PropTypes.func.isRequired,
    allSelectorHandle: PropTypes.func.isRequired,
    setEditorServicePoints: PropTypes.func.isRequired,
  };

  static defaultProps = {
    allSelector: true,
    allDay: false,
    closed: false,
    isModify: false,
  };

  UNSAFE_componentWillMount() { // eslint-disable-line
    const {
      isModify,
      servicePoints: unmodifiedServicePoints,
      editorServicePoints,
    } = this.props;

    const servicePoints = isModify
      ? editorServicePoints
      : unmodifiedServicePoints;

    this.setState({
      servicePoints,
    });
  }

  componentDidMount() {
    if (this.props.isModify) {
      this.props.setName(this.props.editor.name);
      this.props.setStartDate(this.props.editor.startDate);
      this.props.setEndDate(this.props.editor.endDate);
      this.props.setStartTime(this.props.editor.startTime);
      this.props.setEndTime(this.props.editor.endTime);
    }
  }

  setStartDate = (e) => {
    this.props.setStartDate(e.target.value);
  };

  setEndDate = (e) => {
    this.props.setEndDate(e.target.value);
  };

  allSelectorHandle = (select) => {
    this.props.allSelectorHandle(select, this.state.servicePoints);
  };

  setClosed = () => {
    this.props.setClosed(this.props.editor.closed);
  };

  setAllDay = () => {
    this.props.setAllDay(this.props.allDay);
  };

  setName = (e) => {
    this.props.setName(e.target.value);
  };

  setStartTime = (e, value) => {
    this.props.setStartTime(value);
  };

  setEndTime = (e, value) => {
    this.props.setEndTime(value);
  };

  onToggleSelect = (event) => {
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
  };

  trimTimezone = value => value.slice(0, value.lastIndexOf(':'));

  render() {
    const {
      allSelector,
      allDay,
      editor,
      closed,
    } = this.props;

    const items = this.state.servicePoints;
    const itemFormatter = (item) => (
      <li data-test-service-point key={item.id} style={{ justifyContent: "flex-start" }}>
        <div className="CircleDiv" style={{ background: item.color, marginRight: ".5rem" }} />
        <Checkbox
          id={item.id}
          label={item.name}
          checked={item.selected}
          onChange={() => this.onToggleSelect(item)}
        />
      </li>
    );
    const allSelectorText = `ui-calendar.${allSelector ? 'selectAll' : 'deselectAll'}`;

    return (
      <div data-test-exceptional-period-editor>
        <Row>
          <Col>
            <div data-test-start-date>
              <Field
                name="item.startDate"
                component={Datepicker}
                label={<FormattedMessage id="ui-calendar.validFrom" />}
                onChange={this.setStartDate}
                required
                timeZone="UTC"
                backendDateStandard="YYYY-MM-DD"
                usePortal
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div data-test-end-date>
              <Field
                name="item.endDate"
                component={Datepicker}
                label={<FormattedMessage id="ui-calendar.validTo" />}
                onChange={this.setEndDate}
                required
                timeZone="UTC"
                backendDateStandard="YYYY-MM-DD"
                usePortal
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div data-test-period-name>
              <Field
                id="item-period-name"
                name="item.periodName"
                component={TextField}
                label={<FormattedMessage id="ui-calendar.name" />}
                onChange={this.setName}
                required
              />
            </div>
          </Col>
        </Row>
        <div style={{ height: '20px' }} />
        <Row>
          <Col>
            <div data-test-service-points>
              <Label required data-test-service-points-label>
                <FormattedMessage id="ui-calendar.affectedServicePoints" />
              </Label>
              <List
                items={items}
                itemFormatter={itemFormatter}
                isEmptyMessage={<FormattedMessage id="ui-calendar.noServicePoints" />}
                marginBottom0
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              data-test-select-all
              onClick={() => {
                this.allSelectorHandle(allSelector);
              }}
            >
              <FormattedMessage id={allSelectorText} />
            </Button>
          </Col>
        </Row>
        <div style={{ height: '20px' }} />
        <Row>
          <Col>
            <Row>
              <div data-test-closed>
                <Checkbox
                  label={<FormattedMessage id="ui-calendar.settings.closed" />}
                  onChange={() => this.setClosed()}
                  checked={closed}
                />
              </div>
            </Row>
          </Col>
        </Row>
        <div style={{ height: '20px' }} />
        <Row>
          <Col>
            <Row>
              <div data-test-all-day>
                <Checkbox
                  label={ALL_DAY}
                  onChange={() => this.setAllDay()}
                  checked={allDay}
                  disabled={editor.closed}
                />
              </div>
            </Row>
          </Col>
        </Row>
        <div style={{ height: '20px' }} />
        {
          !allDay &&
          <div>
            <Row>
              <Col>
                <div data-test-opening-time>
                  <Field
                    name="item.openingTime"
                    component={Timepicker}
                    label={<FormattedMessage id="ui-calendar.openingTime" />}
                    onChange={this.setStartTime}
                    timeZone="UTC"
                    parse={this.trimTimezone}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div data-test-closing-time>
                  <Field
                    name="item.closingTime"
                    component={Timepicker}
                    label={<FormattedMessage id="ui-calendar.closingTime" />}
                    onChange={this.setEndTime}
                    timeZone="UTC"
                    parse={this.trimTimezone}
                  />
                </div>
              </Col>
            </Row>
          </div>
        }
      </div>
    );
  }
}

export default reduxForm({
  form: 'ExceptionalPeriodEditor',
})(ExceptionalPeriodEditor);
