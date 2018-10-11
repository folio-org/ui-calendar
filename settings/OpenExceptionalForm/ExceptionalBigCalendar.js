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
      return (

        <BigCalendar
          popup
          events={this.props.myEvents}
          showMultiDayTimes
          label
          views={['month']}
          getEvent={this.props.getEvent}
        />


      );
    }
}
export default ExceptionalBigCalendar;
