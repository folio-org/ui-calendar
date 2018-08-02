import React from 'react';
import BigCalendar from '@folio/react-big-calendar';
import moment from "moment";
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend'
import {DragDropContext} from 'react-dnd'
import withDragAndDrop from '@folio/react-big-calendar/src/addons/dragAndDrop'


const DragAndDropCalendar = withDragAndDrop(BigCalendar);

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

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

        const updatedEvent = {
            allDay: event.allDay,
            start: event.start,
            end: event.end,
            id: event.event.id
        };
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
        let id = this.state.eventIdCounter;
        id++;
        if (event.start instanceof Date && !isNaN(event.start)) {
            this.setState(state => {
                state.events.push({start: event.start, end: event.end, id: id, allDay: event.slots.length === 1});
                return {events: state.events, eventIdCounter: id};
            });
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
        return (
            <div style={{height: "100%", width: "90%", margin: "auto"}}>
                <DragAndDropCalendar
                    events={this.state.events}
                    defaultView={BigCalendar.Views.WEEK}
                    defaultDate={new Date(2015, 3, 12)}
                    toolbar={false}
                    selectable={true}
                    resizable={true}
                    onEventDrop={this.onEventDnD}
                    onEventResize={this.onEventResize}
                    onSelectSlot={this.onSlotSelect}
                    // onDeleteEvent={this.onDeleteEvent}
                />
            </div>);
    }

}

export default DragDropContext(HTML5Backend)(BigCalendarWrapper)