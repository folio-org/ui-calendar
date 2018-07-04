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
        spId:{},
        servicePointId: PropTypes.object.isRequired,
        mutator: PropTypes.shape({
            spId: PropTypes.shape({
                replace: PropTypes.func,
            }),
            period: PropTypes.shape({
                POST: PropTypes.func,
            }),
        }).isRequired,
    };

    static manifest = Object.freeze({
        period: {
            type: 'okapi',
            POST: {
                path: 'calendar/periods/%spId/period',
            },
        }
    });

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
        console.log(this.state);
        let period = {
            name: this.state.name,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            openingDays: [],
            servicePointId: this.props.servicePointId
        };
        let weekDays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        let sortedEvents = this.state.event.sort(function (a, b) {
            return (a.start > b.start) ? 1 : ((b.start > a.start) ? -1 : 0);
        });
        let weekDay = 0;
        let openingHour = [];
        for (let i = 0; i < sortedEvents.length; i++) {

            let dayOpening = sortedEvents[i];
            if (weekDay !== dayOpening.start.getDay()) {
                period.openingDays.push({
                    weekDays: {
                        day: weekDays[weekDay],
                    },
                    openingDay: {
                        openingHour: openingHour,
                        allDay: (openingHour.length === 1 && sortedEvents[i - 1].start.getTime() === sortedEvents[i - 1].end.getTime()),
                        open: (openingHour.length !== 0)
                    }
                });
                openingHour = [];
                weekDay = dayOpening.start.getDay();
            }
            openingHour.push({
                start: dayOpening.start.getHours() + ":" + dayOpening.start.getMinutes(),
                end: dayOpening.end.getHours() + ":" + dayOpening.end.getMinutes()
            });

        }
        console.log(period);
        console.log(this.props.mutator);
        return this.props.mutator.period['POST'](period).then((e) => {
            console.log(e);
        });
    }

    render() {

        return (
            <div>
                <form onSubmit={this.onFormSubmit}>
                    <FromHeader/>
                    <InputFields onNameChange={this.handleNameChange} onDateChange={this.handleDateChange}/>

                    <BigCalendarHeader/>

                    <BigCalendarWrapper onCalendarChange={this.onCalendarChange}/>
                    <Button type="submit" buttonStyle="primary">Submit</Button>
                </form>
            </div>
        );

    }
}

export default stripesForm({
    form: 'OpeningPeriodFormWrapper',
})(OpeningPeriodFormWrapper);

