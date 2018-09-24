import React from 'react';
import BigCalendar from '@folio/react-big-calendar';
import moment from 'moment';
import CalendarUtils from '../../CalendarUtils';

BigCalendar.momentLocalizer(moment)

class ExceptionalBigCalendar extends React.Component {
  constructor() {
    super();
    // this.state = {
    //   events: [ {
    //       id: 0,
    //       start: moment('2018/09/12')._d,
    //       end: moment('2018/09/14').add(1,'day')._d,
    //   }]
    // };
  }

  render() {
      {console.log(new Date(2018, 8, 10))}
      {console.log(moment('2018/08/12')._d)}

    return (
    <BigCalendar
        popup
        events={this.props.myEvents}
        // view={month:true}
        showMultiDayTimes
    />
    );
  }
}

export default ExceptionalBigCalendar;
