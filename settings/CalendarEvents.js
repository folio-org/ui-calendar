import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import EntryManager from '@folio/stripes-smart-components/lib/EntryManager';

import AddOpeningDayForm from './AddOpeningDayForm';
import ViewOpeningDay from './ViewOpeningDay';

function validate(values) {
  const errors = {};

  // console.log('values to validate: ', values);

  if (!values.startDate) {
    errors.startDate = 'Please select start date for opening!';
  }

  if (!values.endDate) {
    errors.endDate = 'Please select end date for opening!';
  }

  if (values.startDate && values.endDate && new Date(values.startDate).getTime() > (new Date(values.endDate)).getTime()) {
    errors.endDate = 'The end date can not be before the start date!';
  }

  // TODO: check included days

  /*if (!values.startHour) {
    errors.startHour = 'Please select start hour for opening!';
  }

  if (!values.startMinute) {
    errors.startMinute = 'Please select start minute for opening!';
  }

  if (!values.endHour) {
    errors.endHour = 'Please select end hour for opening!';
  }

  if (!values.endMinute) {
    errors.endMinute = 'Please select end minute for opening!';
  }*/

  return errors;
}

class CalendarEvents extends React.Component {
  static propTypes = {
    dateFormat: PropTypes.string,
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.shape({
      entries: PropTypes.shape({
        POST: PropTypes.func,
        GET: PropTypes.func,
      }),
    }).isRequired,
  };

  static manifest = Object.freeze({
    entries: {
      type: 'okapi',
      records: 'descriptions',
      path: 'calendar/eventdescriptions',
      POST: {
        path: 'calendar/eventdescriptions',
      },
    },
  });

  constructor(props) {
    super(props);
    this.dateFormat = props.dateFormat || 'YYYY-MM-DD';
  }

  render() {
    return (
      <EntryManager
        {...this.props}
        parentMutator={this.props.mutator}
        entryList={_.sortBy((this.props.resources.entries || {}).records || [], ['startDate'])}
        detailComponent={ViewOpeningDay}
        formComponent={AddOpeningDayForm}
        paneTitle="Opening days"
        entryLabel="Opening day"
        nameKey="startDate"
        permissions={{
          post: '',
          put: '',
          delete: '',
        }}
        validate={validate}
        defaultEntry={{ description: '',
          openingDays: [
            { day: 'MONDAY', startHour: '0', startMinute: '0', endHour: '0', endMinute: '0', allDay: false, open: false, twelveHour: false },
            { day: 'TUESDAY', startHour: '0', startMinute: '0', endHour: '0', endMinute: '0', allDay: false, open: false, twelveHour: false },
            { day: 'WEDNESDAY', startHour: '0', startMinute: '0', endHour: '0', endMinute: '0', allDay: false, open: false, twelveHour: false },
            { day: 'THURSDAY', startHour: '0', startMinute: '0', endHour: '0', endMinute: '0', allDay: false, open: false, twelveHour: false },
            { day: 'FRIDAY', startHour: '0', startMinute: '0', endHour: '0', endMinute: '0', allDay: false, open: false, twelveHour: false },
            { day: 'SATURDAY', startHour: '0', startMinute: '0', endHour: '0', endMinute: '0', allDay: false, open: false, twelveHour: false },
            { day: 'SUNDAY', startHour: '0', startMinute: '0', endHour: '0', endMinute: '0', allDay: false, open: false, twelveHour: false }] }}
      />
    );
  }
}

export default CalendarEvents;
