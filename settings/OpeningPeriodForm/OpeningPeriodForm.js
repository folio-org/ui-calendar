import React from 'react';
import Datepicker from 'stripes-components/lib/Datepicker/index';
import stripesForm from '@folio/stripes-form';
import {stripesShape} from 'stripes-core/src/Stripes';
import PropTypes from "prop-types";
import {Row, Col} from 'stripes-components/lib/LayoutGrid/index';
import Pane from "stripes-components/lib/Pane/Pane";
import moment from "moment";
import Label from "@folio/ui-users/lib/Label/Label";

class OpeningPeriodForm extends React.Component {

    static propTypes = {
        stripes: stripesShape.isRequired,
        onCancel: PropTypes.func,
    };

    constructor()       {
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
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
    }

    handleCancel() {
        // console.log("Cancel");
    }

    handleSubmit(event) {
        alert(JSON.stringify(this.state));
        event.preventDefault();

    }

    handleChange(event) {
        console.log(event);
    }
    handleChangeStartDate(fasz){
        this.setState({start_date: fasz});
    }

    render() {
        let input = {
            onChange: function () {
                
            },
            value: "",
        };

        return (
            <form onSubmit={this.handleSubmit}>
                <Pane id="new-period" defaultWidth={"fill"} paneTitle={"New opening period"}
                      dismissible
                      onClose={this.handleCancel()}
                >
                    <Row>
                        <Col xs={6}>
                            <Label>
                                {this.props.stripes.intl.formatMessage({id: 'ui-calendar.settings.openingPeriodStart'})}
                            </Label>
                            <Datepicker
                                {...input}
                                placeholder="YYYY-MM-DD"
                                dateFormat="YYYY-MM-DD"
                                selected={input.value ? moment(input.value, 'YYYY-MM-DD') : null}
                                onChange={this.handleChangeStartDate}
                            />
                        </Col>
                    </Row>
                    {/*<Col xs={6}>*/}
                    {/*<Field*/}
                    {/*value={this.state.start_date}*/}
                    {/*component={Datepicker}*/}
                    {/*label={this.props.stripes.intl.formatMessage({id: 'ui-calendar.settings.openingPeriodEnd'})}*/}
                    {/*dateFormat="YYYY-MM-DD"*/}
                    {/*name="endDate"*/}
                    {/*backendDateStandard="YYYY-MM-DD"*/}
                    {/*onChange={handleChangeStartDate}*/}
                    {/*/>*/}
                    {/*</Col>*/}
                    {/*</Row>*/}
                    {/*<Row>*/}
                    {/*<Col xs={12}>*/}
                    {/*<Field*/}
                    {/*component={TextField}*/}
                    {/*value={this.state.name}*/}
                    {/*onChange={this.handleChange}*/}
                    {/*label={this.props.stripes.intl.formatMessage({id: 'ui-calendar.settings.description'})}*/}
                    {/*name="description"*/}
                    {/*required*/}
                    {/*/>*/}
                    {/*</Col>*/}
                    {/*</Row>*/}
                    {/*<Row>*/}
                    {/*<Col xs={1} sm={1}>*/}
                    {/*<SafeHTMLMessage*/}
                    {/*id='ui-calendar.settings.day'*/}
                    {/*/>*/}
                    {/*</Col>*/}
                    {/*<Col xs={2} sm={2}>*/}
                    {/*</Col>*/}
                    {/*<Col xs={3} sm={3}>*/}
                    {/*<SafeHTMLMessage*/}
                    {/*id='ui-calendar.settings.open'*/}
                    {/*/>*/}
                    {/*</Col>*/}
                    {/*<Col xs={3} sm={3}>*/}
                    {/*<SafeHTMLMessage*/}
                    {/*id='ui-calendar.settings.close'*/}
                    {/*/>*/}
                    {/*</Col>*/}
                    {/*<Col xs={3} sm={3}>*/}
                    {/*</Col>*/}
                    {/*</Row>*/}
                    {/*<FieldArray name={this.state.openingDays} component={OpeningDayComponent}/>*/}
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
