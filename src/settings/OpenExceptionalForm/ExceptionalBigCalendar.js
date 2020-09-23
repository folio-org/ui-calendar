import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  reduce,
  cloneDeep,
} from 'lodash';
import moment from 'moment';
import {
  Calendar,
  momentLocalizer,
} from 'react-big-calendar';

const localizer = momentLocalizer(moment);

class ExceptionalBigCalendar extends Component {
  static propTypes = {
    myEvents: PropTypes.arrayOf(PropTypes.object).isRequired,
    getEvent: PropTypes.func.isRequired,
  };

  /* *
   * Fix for https://github.com/intljusticemission/react-big-calendar/issues/118
   * */
  getEvents = () => {
    const { myEvents } = this.props;

    const localPcTimezoneOffset = (new Date().getTimezoneOffset()) / 60;

    return reduce(myEvents, (events, event) => {
      const transformedEvent = cloneDeep(event);

      if (transformedEvent.end) {
        transformedEvent.end.add(localPcTimezoneOffset, 'h');
      }

      if (transformedEvent.start) {
        transformedEvent.start.add(localPcTimezoneOffset, 'h');
      }

      return [...events, transformedEvent];
    }, []);
  };

  render() {
    const { getEvent } = this.props;

    return (
      <Calendar
        localizer={localizer}
        label
        popup
        toolbar
        showMultiDayTimes
        events={this.getEvents()}
        views={['month']}
        onSelectEvent={getEvent}
        style={{ height: '90vh' }}
      />
    );
  }
}
export default ExceptionalBigCalendar;
