import React from 'react';
import {Row, Col} from '@folio/stripes-components/lib/LayoutGrid';
import Datepicker from "../../../stripes-components/lib/Datepicker/Datepicker";
import {Field} from 'redux-form';
import PropTypes from 'prop-types';
import Textfield from "../../../stripes-components/lib/TextField";
import TextField from "@folio/stripes-components/lib/TextField/TextField";
import moment from "moment";
import CalendarUtils from "../../CalendarUtils";

class InputFields extends React.Component {

    static propTypes = {
        onDateChange: PropTypes.func.isRequired,
        onNameChange: PropTypes.func.isRequired,
    };


    constructor() {
        super();
        this.parseDate = this.parseDate.bind(this);
        // this.parseDates = this.parseDates.bind(this);
        this.setName = this.setName.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
        this.setStartDate = this.setStartDate.bind(this);
    }

    parseDateToString(e) {
        let str = '';
        for (let p in e) {
            if (e.hasOwnProperty(p) && p != "preventDefault") {
                str += e[p];
            }
        }
        return str;
    }

    componentDidMount() {
        console.log(this.props);
    }

    parseDate(date) {
        // console.log(date);
        // console.log(new Date(date));
        return new Date(date);
    }

    setStartDate(e) {
        this.props.onDateChange(true, this.parseDateToString(e));
    }

    setEndDate(e) {
        this.props.onDateChange(false, this.parseDateToString(e));
    }

    setName(e) {
        this.props.onNameChange(e.target.value);
    }

    render() {

        let modifyStart;
        let modifyEnd;
        let modifyName;
        if (this.props.modifyPeriod) {

            modifyStart = <Field value={this.parseDate(this.props.modifyPeriod.endDate) || ''}
                                 name="endDate"
                                 component={Datepicker}
                                 label={CalendarUtils.translateToString('ui-calendar.validFrom',this.props.stripes.intl)}
                                 dateFormat={CalendarUtils.translateToString('ui-calendar.dateFormat',this.props.stripes.intl)}
                                 onChange={this.setStartDate}
            />;

            modifyEnd = <Field value={this.parseDate(this.props.modifyPeriod.endDate) || ''}
                               name="endDate"
                               component={Datepicker}
                               label={CalendarUtils.translateToString('ui-calendar.validTo',this.props.stripes.intl)}
                               dateFormat={CalendarUtils.translateToString('ui-calendar.dateFormat', this.props.stripes.intl)}
                               onChange={this.setEndDate}/>;

            modifyName = <TextField label={CalendarUtils.translateToString('ui-calendar.name',this.props.stripes.intl)}
                                    value={this.props.modifyPeriod.name || ''} ref="periodName" name="periodName"
                                    id="input-period-name" component={Textfield} onChange={this.setName}/>;


        } else {

            modifyStart = <Field name="startDate"
                                 component={Datepicker}
                                 label={CalendarUtils.translateToString('ui-calendar.validFrom',this.props.stripes.intl)}
                                 dateFormat={CalendarUtils.translateToString('ui-calendar.dateFormat',this.props.stripes.intl)}
                                 onChange={this.setStartDate}/>;

            modifyEnd = <Field name="endDate"
                               component={Datepicker}
                               label={CalendarUtils.translateToString('ui-calendar.validTo',this.props.stripes.intl)}
                               dateFormat={CalendarUtils.translateToString('ui-calendar.dateFormat',this.props.stripes.intl)}
                               onChange={this.setEndDate}/>;

            modifyName =
                <TextField label={CalendarUtils.translateToString('ui-calendar.name',this.props.stripes.intl)} ref="periodName"
                           name="periodName" id="input-period-name" component={Textfield} onChange={this.setName}/>

        }

        return (
            <div>
                <Row>
                    <Col sm={4}>
                        {modifyStart}
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        {modifyEnd}
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        {modifyName}
                    </Col>
                </Row>
            </div>
        );

    }
}

export default InputFields;
