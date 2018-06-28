import React from 'react';
import stripesForm from "@folio/stripes-form/index";
import FromHeader from "./FromHeader";
import InputFields from "./InputFields";
import {Button} from "../../../stripes-components";
import BigCalendarWrapper from "./BigCalendarWrapper";
import BigCalendarHeader from "./BigCalendarHeader";

class OpeningPeriodFormWrapper extends React.Component {
    constructor() {
        super();
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.onFormSubmit= this.onFormSubmit.bind(this);
        this.state = {
            startDate: "",
            endDate: "",
            name:"",
        };
    }

    handleDateChange(isStart, date) {
        if (isStart) {
            this.setState({startDate: date})
        } else {
            this.setState({endDate: date})
        }
    }
    handleNameChange(name){
            this.setState({name: name})
    }

    onFormSubmit(event) {
        event.preventDefault();
    }
    render() {

        console.log(this.state);
        return (
            <div>
                <form onSubmit={this.onFormSubmit}>
                    <FromHeader/>
                    <InputFields onNameChange={this.handleNameChange} onDateChange={this.handleDateChange}/>

                    <BigCalendarHeader/>

                    <BigCalendarWrapper/>
                    <Button type="submit" buttonStyle="primary">Submit</Button>
                </form>
            </div>
        );

    }
}

export default stripesForm({
    form: 'OpeningPeriodFormWrapper',
})(OpeningPeriodFormWrapper);

