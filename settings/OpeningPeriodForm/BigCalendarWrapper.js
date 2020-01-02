import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import HTML5Backend from 'react-dnd-html5-backend';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { DragDropContext } from 'react-dnd';
import {
  Calendar,
  momentLocalizer,
} from 'react-big-calendar';

import CalendarUtils from '../../CalendarUtils';
import EventComponent from '../../components/EventComponent';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

class BigCalendarWrapper extends PureComponent {
  static propTypes = {
    onCalendarChange: PropTypes.func.isRequired,
    periodEvents: PropTypes.arrayOf(PropTypes.object),
    eventsChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      eventIdCounter: 0,
      events: [],
    };
  }

  componentDidMount() {
    const {
      periodEvents,
      eventsChange,
    } = this.props;

    if (periodEvents) {
      const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
      const events = [];
      let eventId = 0;

      periodEvents.forEach(({
        openingDay: {
          allDay,
          openingHour,
        },
        weekdays: {
          day: weekday
        }
      }) => {
        const event = {};
        let eventDay = moment().startOf('week').toDate();

        eventDay = moment(eventDay).add(weekdays.indexOf(weekday), 'day');
        event.start = moment(eventDay);
        event.end = moment(eventDay);
        event.allDay = allDay;

        if (!event.allDay) {
          openingHour.forEach(({
            startTime: start,
            endTime: end,
          }) => {
            let minutes = start.split(':')[1];
            let hours = start.split(':')[0];

            event.id = eventId;
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
          });
        } else {
          event.id = eventId;
          events.push({ ...event });
          eventId++;
        }
      });
      eventsChange(events);
      this.setState({
        events,
        eventIdCounter: eventId
      });
    }
  }

  onEventDnD = ({
    event,
    start,
    end,
    isAllDay: droppedOnAllDaySlot,
  }) => {
    if (!this.checkEventExistOrOverlap(start, end)) {
      return;
    }

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

  checkEventExistOrOverlap = (startTime, endTime) => {
    const { events } = this.state;
    return events.every(event => {
      const { start, end } = event;
      const startOfExistedEvent = moment(start);
      const endOfExistedEvent = moment(end);
      const startTimeMoment = moment(startTime);
      const endTimeMoment = moment(endTime);
      const duplicateEvent = startTimeMoment.isSame(startOfExistedEvent) && endTimeMoment.isSame(endOfExistedEvent);
      const startBeforeEvent = startTimeMoment.isBefore(startOfExistedEvent)
        && endTimeMoment.isSameOrBefore(endOfExistedEvent)
        && endTimeMoment.isAfter(startOfExistedEvent);
      const startAfterEvent = startTimeMoment.isSameOrAfter(startOfExistedEvent)
        && startTimeMoment.isBefore(endOfExistedEvent)
        && (endTimeMoment.isSameOrAfter(endOfExistedEvent) || endTimeMoment.isSameOrBefore(endOfExistedEvent));
      const fullOverlap = (startTimeMoment.isAfter(startOfExistedEvent) && endTimeMoment.isBefore(endOfExistedEvent))
        || (startTimeMoment.isBefore(startOfExistedEvent) && endTimeMoment.isAfter(endOfExistedEvent));

      return !(duplicateEvent || startBeforeEvent || startAfterEvent || fullOverlap);
    });
  };

    onSlotSelect = ({ start, end }) => {
      if (!this.checkEventExistOrOverlap(start, end)) {
        return;
      }
      const { eventIdCounter } = this.state;
      const isAllDay = start === end;
      const id = eventIdCounter + 1;
      const events = [...this.state.events];

      events.push({
        id,
        end,
        start,
        allDay: isAllDay,
        ...(isAllDay && { title: 'All day' }),
      });

      this.onCalendarChange(events);
    };

    onCalendarChange = (events) => {
      this.setState({
        events,
        eventIdCounter: events.length
      });

      this.props.onCalendarChange(events);
    };

    onDeleteEvent = ({ id: eventToDeleteId }) => {
      const filteredEvent = this.state.events.filter(({ id }) => id !== eventToDeleteId);

      this.onCalendarChange(filteredEvent);
    };

    renderEventComponent = ({ event, title }) => <EventComponent
      event={event}
      title={title}
      onDeleteEvent={this.onDeleteEvent}
    />;

    render() {
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
            selectable
            resizable
            onEventDrop={this.onEventDnD}
            onEventResize={this.onEventResize}
            onSelectSlot={this.onSlotSelect}
            views={['week']}
            components={{
              event: this.renderEventComponent
            }}
            labelTranslate={CalendarUtils.translate}
          />
        </div>
      );
    }
}

export default DragDropContext(HTML5Backend)(BigCalendarWrapper);
