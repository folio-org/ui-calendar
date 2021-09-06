import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Calendar,
  momentLocalizer,
} from 'react-big-calendar';

import {
  OFFSET_HOURS,
} from '../utils/time';

const localizer = momentLocalizer(moment);

class ExceptionalBigCalendar extends Component {
  static propTypes = {
    myEvents: PropTypes.arrayOf(PropTypes.object).isRequired,
    getEvent: PropTypes.func.isRequired,
  };

  accessor = (date) => {
    return moment(date).clone().add(OFFSET_HOURS, 'hours').toDate();
  }

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
        startAccessor={(event) => this.accessor(event.start)}
        endAccessor={(event) => this.accessor(event.end)}
      />
    );
  }
}
export default ExceptionalBigCalendar;
