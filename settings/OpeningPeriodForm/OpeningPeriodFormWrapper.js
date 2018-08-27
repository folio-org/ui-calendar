import React from 'react';
import stripesForm from "@folio/stripes-form/index";
import FromHeader from "./FromHeader";
import InputFields from "./InputFields";
import BigCalendarWrapper from "./BigCalendarWrapper";
import BigCalendarHeader from "./BigCalendarHeader";
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import moment from "moment";
import CalendarUtils from '../../CalendarUtils'

class OpeningPeriodFormWrapper extends React.Component {

    static propTypes = {
        modifyPeriod: PropTypes.object,
        onSuccessfulCreatePeriod: PropTypes.func,
        onSuccessfulModifyPeriod: PropTypes.func,
        onClose: PropTypes.func.isRequired,
        servicePointId: PropTypes.string.isRequired,
        resources: PropTypes.shape({
            period: PropTypes.shape({
                records: PropTypes.object
            }),
        }),
        mutator: PropTypes.shape({
            servicePointId: PropTypes.shape({
                replace: PropTypes.func,
            }),
            period: PropTypes.shape({
                POST: PropTypes.func.isRequired,
            }),
        }),
        stripes: PropTypes.shape({
            intl: PropTypes.object.isRequired,
        }),
    };

    constructor() {
        super();
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onCalendarChange = this.onCalendarChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.onEventChange = this.onEventChange.bind(this);
        this.state = {};
    }


    componentDidMount() {
        this.setState({...this.props.modifyPeriod});
    }

    handleDateChange(isStart, date) {
        if (isStart) {
            this.setState({startDate: date})
        } else {
            this.setState({endDate: date})
        }
    }

    handleNameChange(name) {
        this.setState({name: name})
    }

    onCalendarChange(event) {
        this.setState({event: event})
    }

    handleDelete() {
        let that = this;
        let parentMutator = this.props.parentMutator;
        let periodId = this.props.modifyPeriod.id;
        let servicePointId = this.props.modifyPeriod.servicePointId;
        if (servicePointId) parentMutator.query.replace(servicePointId);
        if (periodId) parentMutator.periodId.replace(periodId);
        return this.props.parentMutator.periods['DELETE'](periodId).then((e) => {
            that.props.onSuccessfulModifyPeriod(e);
        }, (error) => {
            console.log(error);
        });
    }

    onFormSubmit(event) {
        event.preventDefault();
        const {parentMutator, servicePointId} = this.props;
        let period = {
            name: this.state.name,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            openingDays: [],
            servicePointId: servicePointId
        };
        period = CalendarUtils.convertNewPeriodToValidBackendPeriod(period, this.state.event);
        let that = this;
        if(this.props.modifyPeriod){
            if (servicePointId) parentMutator.query.replace(servicePointId);
            if (servicePointId) parentMutator.periodId.replace(this.props.modifyPeriod.id);
            period.id=this.props.modifyPeriod.id;
            delete period.events;
            return parentMutator.periods.PUT(period).then((e) => {
                that.props.onSuccessfulModifyPeriod(e);
            }, (error) => {
                console.log(error);
            });
        }
        if (servicePointId) parentMutator.query.replace(servicePointId);
        return parentMutator.periods['POST'](period).then((e) => {
            that.props.onSuccessfulCreatePeriod(e);
        }, (error) => {
            console.log(error);
        });
    }

    onEventChange(e){
        this.setState({event:e});
    }

    render() {
        console.log(this.state);
        let modifyPeriod;
        if(this.props.modifyPeriod){
                   modifyPeriod= <BigCalendarWrapper eventsChange={this.onEventChange} periodEvents={this.props.modifyPeriod.openingDays} onCalendarChange={this.onCalendarChange}/>
        }else {
                   modifyPeriod= <BigCalendarWrapper onCalendarChange={this.onCalendarChange}/>
        }
        return (
            <div id="newPeriodForm">
                <form onSubmit={this.onFormSubmit}>
                    <FromHeader  {...this.props} handleDelete={this.handleDelete} onClose={this.props.onClose}/>
                    <InputFields  {...this.props} onNameChange={this.handleNameChange}
                                  onDateChange={this.handleDateChange}/>

                    <BigCalendarHeader {...this.props} />
                    {modifyPeriod}
                </form>
            </div>
        );

    }
}

export default stripesForm({
    form: 'OpeningPeriodFormWrapper',
})(OpeningPeriodFormWrapper);

