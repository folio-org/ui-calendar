import React from 'react';
import BigCalendar from '@folio/react-big-calendar';
import moment from 'moment';
import PropTypes from 'prop-types';

BigCalendar.momentLocalizer(moment);

class ExceptionalBigCalendar extends React.Component {
  render() {
    const myEvents = [
      {
        id: 0,
        start: new Date(2018, 10, 15),
        end: new Date(2018, 10, 16),
      },
      {
        id: 1,
        start: new Date(2018, 10, 18),
        end: new Date(2018, 10, 19),
      },
    ];
    { console.log('bigcalendar props'); }
    { console.log(this.props); }
    return (
      <BigCalendar
        popup
        events={this.props.myEvents}
        showMultiDayTimes
      />
    );
  }
}
export default ExceptionalBigCalendar;
