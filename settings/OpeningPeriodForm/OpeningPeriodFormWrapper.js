import React from 'react';
import stripesForm from "@folio/stripes-form/index";
import FromHeader from "./FromHeader";
import InputFields from "./InputFields";
import {Button} from "../../../stripes-components";
import BigCalendarWrapper from "./BigCalendarWrapper";
import BigCalendarHeader from "./BigCalendarHeader";
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

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
        this.state = {};
    }

    componentDidMount() {
        console.log(this.props);
        this.setState({...this.props.modifyPeriod});
        console.log("OpeningPeriod");
        console.log(this.state);
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
            console.log("after delete");
            console.log(e);

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
        let weekDays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        let sortedEvents = [];
        if (this.state.event) {
            sortedEvents = this.state.event.sort(function (a, b) {
                return (a.start > b.start) ? 1 : ((b.start > a.start) ? -1 : 0);
            });
        }
        let weekDay = 8;
        let openingHour = [];

        for (let i = 0; i < sortedEvents.length; i++) {
            let dayOpening = sortedEvents[i];
            if (weekDay !== dayOpening.start.getDay()) {
                weekDay = dayOpening.start.getDay();
                openingHour = [];
                if (dayOpening.allDay) {
                    period.openingDays.push({
                        weekdays: {
                            day: weekDays[weekDay],
                        },
                        openingDay: {
                            allDay: dayOpening.allDay,
                            open: true
                        }
                    });
                } else {
                    period.openingDays.push({
                        weekdays: {
                            day: weekDays[weekDay],
                        },
                        openingDay: {
                            openingHour: openingHour,
                            allDay: dayOpening.allDay,
                            open: true
                        }
                    });
                }
            }
            openingHour.push({
                startTime: dayOpening.start.getHours() + ":" + dayOpening.start.getMinutes(),
                endTime: dayOpening.end.getHours() + ":" + dayOpening.end.getMinutes()
            });
        }

        if (servicePointId) parentMutator.query.replace(servicePointId);
        let that = this;
        return parentMutator.periods['POST'](period).then((e) => {
            console.log("after post");
            console.log(period);
            console.log(e);

            that.props.onSuccessfulCreatePeriod(e);
        }, (error) => {
            console.log(error);
        });
    }

    render() {
        console.log(this.state)
        return (
            <div id="newPeriodForm">
                <form onSubmit={this.onFormSubmit}>
                    <FromHeader  {...this.props} handleDelete={this.handleDelete} onClose={this.props.onClose}/>
                    <InputFields  {...this.props} onNameChange={this.handleNameChange}
                                  onDateChange={this.handleDateChange}/>

                    <BigCalendarHeader {...this.props} />

                    <BigCalendarWrapper onCalendarChange={this.onCalendarChange}/>
                </form>
            </div>
        );

    }
}

export default stripesForm({
    form: 'OpeningPeriodFormWrapper',
})(OpeningPeriodFormWrapper);

