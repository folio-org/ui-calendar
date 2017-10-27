/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import BigCalendar from '@folio/react-big-calendar';
import moment from 'moment';
import '!style-loader!css-loader!./css/react-big-calendar.css';
import '!style-loader!css-loader!./css/folio-calendar.css';
import events from './events';

class Calendar extends React.Component {

  static contextTypes = {
    stripes: PropTypes.object,
  }

  constructor(props, context) {
    super(props);
      this.connectedApp = props.stripes.connect(Calendar);
    this.okapiUrl = context.stripes.okapi.url;
    this.httpHeaders = Object.assign({}, {
      'X-Okapi-Tenant': context.stripes.okapi.tenant,
      'X-Okapi-Token': context.stripes.store.getState().okapi.token,
      'Content-Type': 'application/json',
    });
  }

  render() {
     let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])
     BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
     BigCalendar.momentLocalizer(moment);

     return (
      <div>
        <br/>
        <BigCalendar
          {...this.props.stripes}
          events={events}
          startAccessor="startDate"
          endAccessor="endDate"
          defaultDate={new Date(2015, 3, 1)}
          views={allViews}
        />
      </div>
    );
  }
}

export default Calendar;
