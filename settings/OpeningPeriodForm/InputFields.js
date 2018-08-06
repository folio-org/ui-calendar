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
                        <Field name="startDate" type="text" ref="startdate" component={Datepicker} label="Valid From:" onChange={this.setStartDate} />
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <Field name="endDate" type="text" ref="enddate" component={Datepicker} label="Valid To:" onChange={this.setEndDate} />
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <Field  label="Name:"  ref="periodName" name="periodName" id="input-period-name" component={Textfield} onChange={this.setName}/>
                    </Col>
                </Row>
            </div>
        );

    }
}

export default InputFields;
