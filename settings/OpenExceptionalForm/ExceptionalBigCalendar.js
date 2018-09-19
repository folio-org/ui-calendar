import React from 'react';
import BigCalendar from '@folio/react-big-calendar';
import moment from 'moment';
import CalendarUtils from '../../CalendarUtils';


class ExceptionalBigCalendar extends React.Component {
  constructor() {
    super();
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

  render() {
    const myEventsList = [
      {
        id: 0,
        title: 'All Day Event very long title',
        allDay: true,
        start: new Date(2018, 8, 19),
        end: new Date(2018, 8, 20),
      },
      {
        id: 1,
        title: 'Long Event',
        start: new Date(2018, 8, 22),
        end: new Date(2018, 8, 23),
      }
    ];


    return (
      <div>
        {console.log(this.state.events)}
        {console.log(this.props.modifyPeriod)}
        <BigCalendar
          events={myEventsList}
          labelTranslate={CalendarUtils.translate}
        />
      </div>

    );
  }
}

export default ExceptionalBigCalendar;
