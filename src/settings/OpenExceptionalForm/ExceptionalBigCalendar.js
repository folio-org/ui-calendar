import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Calendar,
} from 'react-big-calendar';
import { localizer } from '../constants';

class ExceptionalBigCalendar extends Component {
  static propTypes = {
    myEvents: PropTypes.arrayOf(PropTypes.object).isRequired,
    getEvent: PropTypes.func.isRequired,
  };

  render() {
    const {
      myEvents,
      getEvent,
    } = this.props;

    return (
      <Calendar
        localizer={localizer}
        label
        popup
        toolbar
        showMultiDayTimes
        events={myEvents}
        views={['month']}
        onSelectEvent={getEvent}
        style={{ height: '90vh' }}
      />
    );
  }
}
export default ExceptionalBigCalendar;
