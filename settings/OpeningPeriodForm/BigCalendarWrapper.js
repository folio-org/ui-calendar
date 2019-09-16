import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import HTML5Backend from 'react-dnd-html5-backend';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import { DragDropContext } from 'react-dnd';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import CalendarUtils from '../../CalendarUtils';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

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
      this.onDeleteEvent = this.onDeleteEvent.bind(this);
      this.onDeleteAlldayEvent = this.onDeleteAlldayEvent.bind(this);
      this.filterEvent = this.filterEvent.bind(this);
      this.state = {
        eventIdCounter: 0,
        events: []
      };
    }


    componentDidMount() {
      if (this.props.periodEvents) {
        const weekdays = new Array(7);
        weekdays[0] = 'SUNDAY';
        weekdays[1] = 'MONDAY';
        weekdays[2] = 'TUESDAY';
        weekdays[3] = 'WEDNESDAY';
        weekdays[4] = 'THURSDAY';
        weekdays[5] = 'FRIDAY';
        weekdays[6] = 'SATURDAY';

        const events = [];
        let eventId = 0;
        for (let i = 0; i < this.props.periodEvents.length; i++) {
          const openingDay = this.props.periodEvents[i].openingDay;
          const event = {};
          let eventDay = moment().startOf('week').toDate();
          const weekday = this.props.periodEvents[i].weekdays.day;
          eventDay = moment(eventDay).add(weekdays.indexOf(weekday), 'day');
          event.start = moment(eventDay);
          event.end = moment(eventDay);
          event.allDay = openingDay.allDay;
          if (!event.allDay) {
            for (let j = 0; j < openingDay.openingHour.length; j++) {
              event.id = eventId;
              const start = openingDay.openingHour[j].startTime;
              const end = openingDay.openingHour[j].endTime;
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
              events.push({ ...event });
              eventId++;
              event.start = moment(eventDay);
              event.end = moment(eventDay);
            }
          } else {
            event.id = eventId;
            events.push({ ...event });
            eventId++;
          }
        }
        this.props.eventsChange(events);
        this.setState({
          events,
          eventIdCounter: eventId
        });
      }
    }

    onEventDnD = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
      const { events } = this.state;
      const isSameDay = start.getDay() === end.getDay();
      const idx = events.indexOf(event);
      let allDay = event.allDay;

      if (!event.allDay && droppedOnAllDaySlot) {
        allDay = true;
      } else if (event.allDay && !droppedOnAllDaySlot) {
        allDay = false;
      }

      const updatedEvent = {
        ...event,
        start,
        end: isSameDay ? end : moment(start).endOf('day').toDate(),
        allDay,
        title: allDay ? 'All day' : '',
      };

      const nextEvents = [...events];
      nextEvents.splice(idx, 1, updatedEvent);

      this.onCalendarChange(nextEvents);
    };

    onEventResize = ({ event, start, end }) => {
      const { events } = this.state;

      const nextEvents = events.map(existingEvent => {
        return existingEvent.id === event.id
          ? { ...existingEvent, start, end }
          : existingEvent;
      });

      this.onCalendarChange(nextEvents);
    };

    onSlotSelect({ start, end }) {
      const { eventIdCounter } = this.state;
      const isAllDay = start === end;
      const id = eventIdCounter + 1;

      this.setState(state => {
        state.events.push({
          id,
          end,
          start,
          allDay: isAllDay,
          ...(isAllDay && { title: 'All day' }),
        });

        return { events: state.events, eventIdCounter: id };
      });

      this.onCalendarChange(this.state.events);
    }

    onCalendarChange(events) {
      this.setState({ events });
      this.props.onCalendarChange(events);
    }

    onDeleteEvent(events, eventTodelete) {
      const filteredEvent = this.state.events.filter((event) => event.id !== eventTodelete.id);

      this.setState({
        events: this.filterEvent(eventTodelete),
      });

      this.state.eventIdCounter--;
      this.onCalendarChange(filteredEvent);
    }

    onDeleteAlldayEvent(eventToDelete) {
      const filteredEvent = this.state.events.filter((event) => event.id !== eventToDelete.id);

      this.setState({
        events: this.filterEvent(eventToDelete),
      });
      this.state.eventIdCounter--;
      this.onCalendarChange(filteredEvent);
    }

    filterEvent(eventToDelete) {
      return this.state.events.filter((event) => event.id !== eventToDelete.id);
    }

    render() {
      const formats = {
        dayFormat: (date, culture, localizer) => localizer.format(date, 'dddd', culture),
      };

      return (
        <div
          className="period-big-calendar"
          style={{
            height: '100%',
            marginBottom: '1rem',
          }}
          data-test-big-calendar-wrapper
        >
          <DnDCalendar
            events={this.state.events}
            defaultView="week"
            localizer={localizer}
            defaultDate={new Date()}
            toolbar={false}
            formats={formats}
            selectable
            resizable
            onEventDrop={this.onEventDnD}
            onEventResize={this.onEventResize}
            onSelectSlot={this.onSlotSelect}
            views={['week']}
            onDeleteEvent={this.onDeleteEvent}
            onDeleteAlldayEvent={this.onDeleteAlldayEvent}
            labelTranslate={CalendarUtils.translate}
          />
        </div>
      );
    }
}

export default DragDropContext(HTML5Backend)(BigCalendarWrapper);
