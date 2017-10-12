import React, { PropTypes } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

class Calendar extends React.Component {
  static contextTypes = {
    stripes: PropTypes.object,
  }

  constructor(props, context) {
    super(props);
    this.okapiUrl = context.stripes.okapi.url;
    this.httpHeaders = Object.assign({}, {
      'X-Okapi-Tenant': context.stripes.okapi.tenant,
      'X-Okapi-Token': context.stripes.store.getState().okapi.token,
      'Content-Type': 'application/json',
    });

    this.onClickCheckin = this.onClickCheckin.bind(this);
  }

  render() {

    BigCalendar.setLocalizer(
      BigCalendar.momentLocalizer(moment)
    );

    return (
      <BigCalendar></BigCalendar>
    );
  }
}

export default Calendar;
