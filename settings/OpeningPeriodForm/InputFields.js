import React from 'react';
import {Row, Col} from '@folio/stripes-components/lib/LayoutGrid';
import Datepicker from "../../../stripes-components/lib/Datepicker/Datepicker";
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Textfield from "../../../stripes-components/lib/TextField";

class InputFields extends React.Component {

    static propTypes = {
        onDateChange: PropTypes.func.isRequired,
        onNameChange: PropTypes.func.isRequired,
    };


    constructor() {
        super();
        this.parseDate=this.parseDate.bind(this);
        this.setName=this.setName.bind(this);
        this.setEndDate=this.setEndDate.bind(this);
        this.setStartDate=this.setStartDate.bind(this);
    }

    parseDate(e){
        let str = '';
        for (let p in e) {
            if (e.hasOwnProperty(p) && p!="preventDefault") {
                str += e[p];
            }
        }
        return str;
    }

    setStartDate(e){
       this.props.onDateChange(true , this.parseDate(e));
    }
    setEndDate(e){
        this.props.onDateChange(false , this.parseDate(e));
    }
    setName(e){
        this.props.onNameChange(e.target.value);
    }
    render() {
        return (
            <div>
                <Row>
                    <Col sm={4}>
                        <Field name="startDate" type="text" ref="startdate" component={Datepicker} label={this.props.stripes.intl.formatMessage({id: 'ui-calendar.validFrom'})} dateFormat={this.props.stripes.intl.formatMessage({id: 'ui-calendar.dateFormat'})} onChange={this.setStartDate} />
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <Field name="endDate" type="text" ref="enddate" component={Datepicker} label={this.props.stripes.intl.formatMessage({id: 'ui-calendar.validTo'})} dateFormat={this.props.stripes.intl.formatMessage({id: 'ui-calendar.dateFormat'})} onChange={this.setEndDate} />
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <Field label={this.props.stripes.intl.formatMessage({id: 'ui-calendar.name'})}  ref="name" name="name" id="input-period-name" component={Textfield} onChange={this.setName}/>
                    </Col>
                </Row>
            </div>
        );

    }
}

export default InputFields;
