import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import {
  reduce,
  cloneDeep,
} from 'lodash';

import {
  Calendar,
  momentLocalizer,
} from 'react-big-calendar';

const localizer = momentLocalizer(moment);

class ExceptionalBigCalendar extends React.Component {
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
        toolbar={false}
        showMultiDayTimes
        events={this.getEvents()}
        views={['month']}
        getEvent={getEvent}
      />
    );
  }
}
export default ExceptionalBigCalendar;
