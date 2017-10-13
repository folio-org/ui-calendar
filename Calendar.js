import React, { PropTypes } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import '!style-loader!css-loader!./css/react-big-calendar.css';

class Calendar extends React.Component {
  static contextTypes = {
    stripes: PropTypes.object,
  }

  constructor(props, context) {
    super(props);
    this.okapiUrl = context.stripes.okapi.url;
    this.httpHeaders = Object.assign({}, {
      'X-Okapi-Tenant': context.stripes.okapi.tenant,
      'X-Okapi-Token': context.stripes.store.getState().okapi.token,
      'Content-Type': 'application/json',
    });
  }

  render() {
    const events = [
      {
        title: 'All Day Event',
        allDay: true,
        start: new Date(2018, 3, 0),
        end: new Date(2018, 3, 1),
      },
      {
        title: 'Long Event',
        start: new Date(2018, 3, 7),
        end: new Date(2018, 3, 10),
      },
      {
        title: 'DTS STARTS',
        start: new Date(2016, 2, 13, 0, 0, 0),
        end: new Date(2016, 2, 20, 0, 0, 0),
      },
      {
        title: 'DTS ENDS',
        start: new Date(2016, 10, 6, 0, 0, 0),
        end: new Date(2016, 10, 13, 0, 0, 0),
      },
      {
        title: 'Some Event',
        start: new Date(2018, 3, 9, 0, 0, 0),
        end: new Date(2018, 3, 9, 0, 0, 0),
      },
      {
        title: 'Conference',
        start: new Date(2018, 3, 11),
        end: new Date(2018, 3, 13),
        desc: 'Big conference for important people',
      },
      {
        title: 'Meeting',
        start: new Date(2018, 3, 12, 10, 30, 0, 0),
        end: new Date(2018, 3, 12, 12, 30, 0, 0),
        desc: 'Pre-meeting meeting, to prepare for the meeting',
      },
      {
        title: 'Lunch',
        start: new Date(2018, 3, 12, 12, 0, 0, 0),
        end: new Date(2018, 3, 12, 13, 0, 0, 0),
        desc: 'Power lunch',
      },
      {
        title: 'Meeting',
        start: new Date(2018, 3, 12, 14, 0, 0, 0),
        end: new Date(2018, 3, 12, 15, 0, 0, 0),
      },
      {
        title: 'Happy Hour',
        start: new Date(2018, 3, 12, 17, 0, 0, 0),
        end: new Date(2018, 3, 12, 17, 30, 0, 0),
        desc: 'Most important meal of the day',
      },
      {
        title: 'Dinner',
        start: new Date(2018, 3, 12, 20, 0, 0, 0),
        end: new Date(2018, 3, 12, 21, 0, 0, 0),
      },
      {
        title: 'Birthday Party',
        start: new Date(2018, 3, 13, 7, 0, 0),
        end: new Date(2018, 3, 13, 10, 30, 0),
      },
      {
        title: 'Late Night Event',
        start: new Date(2018, 3, 17, 19, 30, 0),
        end: new Date(2018, 3, 18, 2, 0, 0),
      },
      {
        title: 'Multi-day Event',
        start: new Date(2018, 3, 20, 19, 30, 0),
        end: new Date(2018, 3, 22, 2, 0, 0),
      }];

    BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

    return (
      <div>
        <BigCalendar
          events={events}
          startAccessor="startDate"
          endAccessor="endDate"
        />
      </div>
    );
  }
}

export default Calendar;
