import React from 'react';
import Calendar from '@folio/react-big-calendar';
import moment from "moment";
import PropTypes from 'prop-types';

Calendar.setLocalizer(Calendar.momentLocalizer(moment));

class BigCalendarWrapper extends React.Component {

    static propTypes = {
        onCalendarChange: PropTypes.func.isRequired
    };

    constructor() {
        super();
        this.onSlotSelect = this.onSlotSelect.bind(this);
        this.state = {
            events: []
        };
    }

    onEventResize = (type, {event, start, end, allDay}) => {
        this.setState(state => {
            state.events[0].start = start;
            state.events[0].end = end;
            return {events: state.events};
        });
    };
    onEventDrop = ({event, start, end, allDay}) => {
    };

    onSlotSelect(lofasz) {

        if (lofasz.start instanceof Date && !isNaN(lofasz.start)) {
            this.setState(state => {
                state.events.push({start: lofasz.start, end: lofasz.end});
                return {events: state.events};
            });
        }
        this.props.onCalendarChange(this.state.events);
    }

    render() {
        const formats = {
            dayHeaderFormat: (date, culture, localizer) =>
                localizer.format(date, 'ddd dddd', culture)
        };
        return (
            <div style={{height: "600px"}}>
                <Calendar
                    fromats={formats}
                    events={this.state.events}
                    defaultView="week"
                    selectable={true}
                    toolbar={false}
                    onSelectSlot={this.onSlotSelect}
                    onCalendarChange={event => alert(event)}
                    onEventDrop={this.onEventDrop}
                    onEventResize={this.onEventResize}
                    resizable
                    style={{height: "100vh"}}
                />
            </div>);
    }

}

export default BigCalendarWrapper;