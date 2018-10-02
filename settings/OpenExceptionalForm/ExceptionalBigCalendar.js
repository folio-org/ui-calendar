import React from 'react';
import BigCalendar from '@folio/react-big-calendar';
import moment from 'moment';
import PropTypes from 'prop-types';

BigCalendar.momentLocalizer(moment);

class ExceptionalBigCalendar extends React.Component {
    static propTypes = {
      myEvents: PropTypes.object,
    };

    render() {
      return (

        <BigCalendar
          popup
          events={this.props.myEvents}
          showMultiDayTimes
          label
          views={['month']}
        />


      );
    }
}
export default ExceptionalBigCalendar;
