import React from 'react';
import stripesForm from "@folio/stripes-form/index";
import FromHeader from "./FromHeader";
import InputFields from "./InputFields";
import {Button} from "../../../stripes-components";
import BigCalendarWrapper from "./BigCalendarWrapper";
import BigCalendarHeader from "./BigCalendarHeader";
import PropTypes from 'prop-types';

class OpeningPeriodFormWrapper extends React.Component {

    static propTypes = {
        onSuccessfulCreatePeriod: PropTypes.func.isRequired,
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
        this.state = {};
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

    onFormSubmit(event) {
        event.preventDefault();

        const {parentMutator, servicePointId} = this.props;
        console.log(this.state);
        let period = {
            name: this.state.name,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            openingDays: [],
            servicePointId: servicePointId
        };
        let weekDays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        let sortedEvents = this.state.event.sort(function (a, b) {
            return (a.start > b.start) ? 1 : ((b.start > a.start) ? -1 : 0);
        });

        let weekDay = 8;
        let openingHour = [];

        for (let i = 0; i < sortedEvents.length; i++) {
            let dayOpening = sortedEvents[i];
            if (weekDay !== dayOpening.start.getDay()) {
                weekDay = dayOpening.start.getDay();
                openingHour = [];
                if(dayOpening.allDay){
                period.openingDays.push({
                    weekdays: {
                        day: weekDays[weekDay],
                    },
                    openingDay: {
                        allDay: dayOpening.allDay,
                        open: true
                    }
                });
                }else {
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

        return (
            <div id="newPeriodForm">
                <form onSubmit={this.onFormSubmit}>
                    <FromHeader onClose={this.props.onClose}/>
                    <InputFields onNameChange={this.handleNameChange} onDateChange={this.handleDateChange}/>

                    <BigCalendarHeader/>

                    <BigCalendarWrapper onCalendarChange={this.onCalendarChange}/>
                    {/*<Button type="submit" buttonStyle="primary">Submit</Button>*/}
                </form>
            </div>
        );

    }
}

export default stripesForm({
    form: 'OpeningPeriodFormWrapper',
})(OpeningPeriodFormWrapper);

