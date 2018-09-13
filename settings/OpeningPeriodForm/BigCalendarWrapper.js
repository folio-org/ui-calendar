import React from 'react';
import BigCalendar from '@folio/react-big-calendar';
import moment from "moment";
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend'
import {DragDropContext} from 'react-dnd'
import withDragAndDrop from '@folio/react-big-calendar/src/addons/dragAndDrop'
import CalendarUtils from "../../CalendarUtils";


BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
const DragAndDropCalendar = withDragAndDrop(BigCalendar);


class BigCalendarWrapper extends React.Component {

    static propTypes = {
        onCalendarChange: PropTypes.func.isRequired,
        periodEvents: PropTypes.arrayOf(PropTypes.object),
        eventsChange: PropTypes.func
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


    componentDidMount() {
        if (this.props.periodEvents) {

            let weekdays = new Array(7);
            weekdays[0] = "SUNDAY";
            weekdays[1] = "MONDAY";
            weekdays[2] = "TUESDAY";
            weekdays[3] = "WEDNESDAY";
            weekdays[4] = "THURSDAY";
            weekdays[5] = "FRIDAY";
            weekdays[6] = "SATURDAY";

            let events = [];
            let eventId = 0;
            for (let i = 0; i < this.props.periodEvents.length; i++) {
                let openingDay = this.props.periodEvents[i].openingDay;
                let event = {};
                let eventDay = moment().startOf('week').toDate();
                let weekday = this.props.periodEvents[i].weekdays.day;
                eventDay = moment(eventDay).add(weekdays.indexOf(weekday), 'day');
                event.start = moment(eventDay);
                event.end = moment(eventDay);
                event.allDay = openingDay.allDay;
                if (!event.allDay) {
                    for (let j = 0; j < openingDay.openingHour.length; j++) {
                        event.id = eventId;
                        let start = openingDay.openingHour[j].startTime;
                        let end = openingDay.openingHour[j].endTime;
                        let minutes = start.split(':')[1];
                        let hours = start.split(':')[0];
                        event.start = moment(event.start).add(hours, 'hours');
                        event.start = moment(event.start).add(minutes, 'minutes');
                        minutes = end.split(':')[1];
                        hours = end.split(':')[0];
                        event.end = moment(event.end).add(hours, 'hours');
                        event.end = moment(event.end).add(minutes, 'minutes');
                        event.start = moment(event.start).toDate();
                        event.end = moment(event.end).toDate();
                        events.push({...event});
                        eventId++;
                        event.start = moment(eventDay);
                        event.end = moment(eventDay);
                    }
                } else {
                    event.id = eventId;
                    events.push({...event});
                    eventId++;
                }
            }
            this.props.eventsChange(events);
            this.setState({
                events: events,
                eventIdCounter: eventId
            });
        }
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
        console.log(this.state);

        // this.props.eventsChange? this.props.eventsChange(this.state.events): "";

        let formats = {
            dayFormat: (date, culture, localizer) =>
                localizer.format(date, 'dddd', culture),
        };

        return (
            <div className="period-big-calendar" style={{height: "100%", marginBottom: "1rem"}}>
                <DragAndDropCalendar
                    events={this.state.events}
                    defaultView={BigCalendar.Views.WEEK}
                    defaultDate={new Date()}
                    toolbar={false}
                    formats={formats}
                    selectable={true}
                    resizable={true}
                    onEventDrop={this.onEventDnD}
                    onEventResize={this.onEventResize}
                    onSelectSlot={this.onSlotSelect}
                    views={['week']}
                    // onDeleteEvent={this.onDeleteEvent}
                    labelTranslate = {CalendarUtils.translate}
                    />
            </div>);
    }

}

export default DragDropContext(HTML5Backend)(BigCalendarWrapper)