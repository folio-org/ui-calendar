import React from 'react';
import BigCalendar from '@folio/react-big-calendar';
import moment from 'moment';
import PropTypes from 'prop-types';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

class ExceptionalBigCalendar extends React.Component {
    static propTypes = {
      myEvents: PropTypes.object,
      getEvent: PropTypes.func,
    };

    render() {
      const {
        myEvents,
        getEvent,
      } = this.props;

      return (
        <BigCalendar
          label
          popup
          showMultiDayTimes
          events={myEvents}
          views={['month']}
          getEvent={getEvent}
        />
      );
    }
}
export default ExceptionalBigCalendar;
