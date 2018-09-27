import React from 'react';
import BigCalendar from '@folio/react-big-calendar';
import moment from 'moment';
import PropTypes from 'prop-types';

BigCalendar.momentLocalizer(moment);

class ExceptionalBigCalendar extends React.Component {
    static propTypes = {
      myEvents: PropTypes.object,
    };

    constructor() {
      super();
      this.separateEvents = this.separateEvents.bind(this);
      this.state = {
        events: [],
      };
    }

    componentWillMount() {
      this.separateEvents();
    }

    separateEvents() {
      const temp = [];
      let k = 0;

      for (let j = 0; j < this.props.myEvents.length; j++) {
        for (let i = 0; i < moment(this.props.myEvents[j].end).diff(moment(this.props.myEvents[j].start), 'days') + 1; i++) {
          const tempObj = {
            id: this.props.myEvents[j].id,
            end: moment(this.props.myEvents[j].start).add(i, 'days'),
            start: moment(this.props.myEvents[j].start).add(i, 'days'),
          };
          temp[k] = tempObj;
          k++;
        }
      }

      this.setState({
        events: temp
      });
    }


    render() {
      return (

        <BigCalendar
          popup
          events={this.state.events}
          showMultiDayTimes
          label="das"
        />


      );
    }
}
export default ExceptionalBigCalendar;
