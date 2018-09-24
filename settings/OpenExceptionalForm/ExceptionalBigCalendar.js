import React from 'react';
import BigCalendar from '@folio/react-big-calendar';
import moment from 'moment';
import PropTypes from 'prop-types';

BigCalendar.momentLocalizer(moment);

class ExceptionalBigCalendar extends React.Component {
    static propTypes = {
      myEvents: PropTypes.object.isRequired,
    };


    render() {
      const myEvents = [
        {
          id: 0,
          title: 'All Day Event very long title',
          allDay: true,
          start: new Date(2018, 10, 15),
          end: new Date(2018, 10, 16),
        },
        {
          id: 1,
          title: 'Long Event',
          start: new Date(2018, 10, 18),
          end: new Date(2018, 10, 19),
        },
      ];
      return (
        <BigCalendar
          popup
          events={myEvents}
          showMultiDayTimes
        />
      );
    }
}
export default ExceptionalBigCalendar;
