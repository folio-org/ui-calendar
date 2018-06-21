import React from 'react';
import Datepicker from '@folio/stripes-components/lib/Datepicker';
import Select from '@folio/stripes-components/lib/Select';
import TextField from '@folio/stripes-components/lib/TextField';
import stripesForm from '@folio/stripes-form';
import {stripesShape} from '@folio/stripes-core/src/Stripes';
import OpeningDayComponent from './OpeningDayComponent';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import PropTypes from "prop-types";
import FieldArray from "redux-form/es/FieldArray";
import Field from "redux-form/es/Field";
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Pane from "@folio/stripes-components/lib/Pane/Pane";
import Paneset from "../../stripes-components/lib/Paneset/Paneset";

class OpeningPeriodForm extends React.Component {

    static propTypes = {
        stripes: stripesShape.isRequired,
        onCancel: PropTypes.func,
    };

    constructor() {
        super();
        this.state = {
            start_date: '',
            end_date: '',
            name: '',
            openingDays: [
                {
                    day: "MONDAY",
                    open: '',
                    allDay: '',
                    openingHour: [{
                        endTime: '',
                        startTime: ''
                    }]
                },
                {
                    day: "TUESDAY",
                    open: '',
                    allDay: '',
                    openingHour: [{
                        endTime: '',
                        startTime: ''
                    }]
                },
                {
                    day: "WEDNESDAY",
                    open: '',
                    allDay: '',
                    openingHour: [{
                        endTime: '',
                        startTime: ''
                    }]
                },
                {
                    day: "THURSDAY",
                    open: '',
                    allDay: '',
                    openingHour: [{
                        endTime: '',
                        startTime: ''
                    }]
                },
                {
                    day: "FRIDAY",
                    open: '',
                    allDay: '',
                    openingHour: [{
                        endTime: '',
                        startTime: ''
                    }]
                },
                {
                    day: "SATURDAY",
                    open: '',
                    allDay: '',
                    openingHour: [{
                        endTime: '',
                        startTime: ''
                    }]
                },
                {
                    day: "SUNDAY",
                    open: '',
                    allDay: '',
                    openingHour: [{
                        endTime: '',
                        startTime: ''
                    }]
                },
            ],
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        alert(JSON.stringify(this.state));
        event.preventDefault();
    }

    handleChange(event) {
        this.setState({name: event.target.value});
    }

    handleChangeEndDate(event) {
        this.setState({end_date: event.target.value});
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <Pane id="new-period" defaultWidth={"fill"} paneTitle={"New opening period"}
                      dismissible
                      onClose={this.props.onCancel}
                >

                    <Row>
                        <Col xs={6}>
                            <Field
                                component={Datepicker}
                                value={this.state.end_date}
                                label={this.props.stripes.intl.formatMessage({id: 'ui-calendar.settings.openingPeriodEnd'})}
                                dateFormat="YYYY-MM-DD"
                                name="startDate"
                                id="addevent_startDate"
                                backendDateStandard="YYYY-MM-DD"
                                required
                                onChange={this.handleChangeEndDate}
                            />
                        </Col>
                        <Col xs={6}>
                            <Field
                                value={this.state.start_date}
                                component={Datepicker}
                                label={this.props.stripes.intl.formatMessage({id: 'ui-calendar.settings.openingPeriodEnd'})}
                                dateFormat="YYYY-MM-DD"
                                name="endDate"
                                backendDateStandard="YYYY-MM-DD"
                                onChange={this.handleChangeEndDate}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Field
                                component={TextField}
                                value={this.state.name}
                                onChange={this.handleChange}
                                label={this.props.stripes.intl.formatMessage({id: 'ui-calendar.settings.description'})}
                                name="description"
                                required
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={1} sm={1}>
                            <SafeHTMLMessage
                                id='ui-calendar.settings.day'
                            />
                        </Col>
                        <Col xs={2} sm={2}>
                            &nbsp;
                        </Col>
                        <Col xs={3} sm={3}>
                            <SafeHTMLMessage
                                id='ui-calendar.settings.open'
                            />
                        </Col>
                        <Col xs={3} sm={3}>
                            <SafeHTMLMessage
                                id='ui-calendar.settings.close'
                            />
                        </Col>
                        <Col xs={3} sm={3}>
                            &nbsp;
                        </Col>
                    </Row>
                    <FieldArray name={this.state.openingDays} component={OpeningDayComponent}/>
                    <input type="submit" value="Submit"/>
                </Pane>
            </form>
        );
    }
}

export default stripesForm({
    form: 'OpeningPeriodForm',
    navigationCheck: true,
    enableReinitialize: false,
    asyncBlurFields: [],
})(OpeningPeriodForm);
