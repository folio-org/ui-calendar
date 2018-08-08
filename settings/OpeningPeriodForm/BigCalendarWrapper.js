import React from 'react';
import BigCalendar from '@folio/react-big-calendar';
import moment from "moment";
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend'
import {DragDropContext} from 'react-dnd'
import withDragAndDrop from '@folio/react-big-calendar/src/addons/dragAndDrop'


BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
const DragAndDropCalendar = withDragAndDrop(BigCalendar);


class BigCalendarWrapper extends React.Component {

    static propTypes = {
        onCalendarChange: PropTypes.func.isRequired
    };

    constructor() {
        super();
        this.onSlotSelect = this.onSlotSelect.bind(this);
        this.onEventDnD = this.onEventDnD.bind(this);
        this.onEventResize = this.onEventResize.bind(this);
        this.onCalendarChange = this.onCalendarChange.bind(this);
        // this.onDeleteEvent = this.onDeleteEvent.bind(this);
        this.state = {
            eventIdCounter: 0,
            events: []
        };
    }

    onEventDnD = (event) => {
        const {events} = this.state;
        let updatedEvent = {};
        if (event.allDay) {
            event.start.setHours(0, 0, 0, 0);
            event.end.setHours(0, 0, 0, 0);
            updatedEvent = {
                title: "All day",
                allDay: event.allDay,
                start: event.start,
                end: event.end,
                id: event.event.id
            };
        } else {
            updatedEvent = {
                allDay: event.allDay,
                start: event.start,
                end: event.end,
                id: event.event.id
            };
        }
        const nextEvents = [...events];
        for (let i = 0; i < nextEvents.length; i++) {
            if (nextEvents[i].id === event.event.id) {
                nextEvents.splice(i, 1, updatedEvent)
            }
        }
        this.onCalendarChange(nextEvents);
    };

    onEventResize = (type, {event, start, end, allDay}) => {
        const {events} = this.state;
        const nextEvents = events.map(existingEvent => {
            return existingEvent.id === event.id
                ? {...existingEvent, start, end}
                : existingEvent
        });
        this.onCalendarChange(nextEvents)
    };

    onSlotSelect(event) {
        console.log(event);
        console.log(this.state.events);
        let id = this.state.eventIdCounter;
        id++;
        if (event.start instanceof Date && !isNaN(event.start)) {
            if (event.slots.length === 1) {
                this.setState(state => {
                    state.events.push({start: event.start, end: event.end, id: id, allDay: true, title: "All day"});
                    return {events: state.events, eventIdCounter: id};
                });
            } else {
                this.setState(state => {
                    state.events.push({start: event.start, end: event.end, id: id, allDay: false});
                    return {events: state.events, eventIdCounter: id};
                });
            }
        }
        this.onCalendarChange(this.state.events);
    }

    onCalendarChange(events) {
        this.setState({events: events});
        this.props.onCalendarChange(events);
    }

    // onDeleteEvent(event){
    //     console.log("deleteEvent Baszki");
    //     console.log(event);
    // }

    render() {
        let formats = {
            dayFormat: (date, culture, localizer) =>
                localizer.format(date, 'dddd', culture),
        };

        return (
            <div className="period-big-calendar" style={{height: "100%", marginBottom: "1rem"}}>
                <DragAndDropCalendar
                    events={this.state.events}
                    defaultView={BigCalendar.Views.WEEK}
                    defaultDate={new Date(1995, 11, 10)}
                    toolbar={false}
                    formats={formats}
                    selectable={true}
                    resizable={true}
                    onEventDrop={this.onEventDnD}
                    onEventResize={this.onEventResize}
                    onSelectSlot={this.onSlotSelect}
                    views={['week']}
                    // onDeleteEvent={this.onDeleteEvent}
                />
            </div>);
    }

}

export default DragDropContext(HTML5Backend)(BigCalendarWrapper)