import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import EntryManager from '@folio/stripes-smart-components/lib/EntryManager';

import AddOpeningDayForm from './AddOpeningDayForm';
import ViewOpeningDay from './ViewOpeningDay';

function invalidHour(hour /* , twelveHour*/) {
  return isNaN(hour) || parseInt(hour, 10) < 0 || parseInt(hour, 10) > 23;
}

function invalidMinute(minute) {
  return isNaN(minute) || parseInt(minute, 10) < 0 || parseInt(minute, 10) > 59;
}

function validate(values) {
  const errors = { openingDays: {} };

  if (!values.startDate) {
    errors.startDate = 'Please select start date for opening!';
  }

  if (!values.endDate) {
    errors.endDate = 'Please select end date for opening!';
  }

  if (values.startDate && values.endDate && new Date(values.startDate).getTime() > (new Date(values.endDate)).getTime()) {
    errors.endDate = 'The end date can not be before the start date!';
  }

  if (!values.description) {
    errors.description = 'Please add a description for the opening period!';
  }

  if (values.openingDays && values.openingDays.length) {
    const openingDayArrayErrors = [];
    values.openingDays.forEach((openingDay, index) => {
      const openingDayErrors = {};
      if (openingDay && openingDay.open && !openingDay.allDay) {
        if (invalidHour(openingDay.startHour, values.twelveHour)) {
          openingDayErrors.startHour = 'Must be a valid hour!';
          openingDayArrayErrors[index] = openingDayErrors;
        }
        if (invalidMinute(openingDay.startMinute)) {
          openingDayErrors.startMinute = 'Must be a valid minute!';
          openingDayArrayErrors[index] = openingDayErrors;
        }
        if (invalidHour(openingDay.endHour, values.twelveHour)) {
          openingDayErrors.endHour = 'Must be a valid hour!';
          openingDayArrayErrors[index] = openingDayErrors;
        }
        if (invalidMinute(openingDay.endMinute)) {
          openingDayErrors.endMinute = 'Must be a valid minute!';
          openingDayArrayErrors[index] = openingDayErrors;
        }
        if (!invalidHour(openingDay.startHour /* , values.twelveHour*/) && !invalidHour(openingDay.endHour /* , values.twelveHour*/)) {
          if (parseInt(openingDay.startHour, 10) > parseInt(openingDay.endHour, 10)) {
            openingDayErrors.endHour = 'Closing hour must be after opening hour!';
            openingDayArrayErrors[index] = openingDayErrors;
          } else if (parseInt(openingDay.startHour, 10) === parseInt(openingDay.endHour, 10)
            && !invalidMinute(openingDay.startMinute)
            && !invalidMinute(openingDay.endMinute)
            && parseInt(openingDay.startMinute, 10) >= parseInt(openingDay.endMinute, 10)) {
            openingDayErrors.endMinute = 'Closing minute must be after opening minute!';
            openingDayArrayErrors[index] = openingDayErrors;
          }
        }
      }
    });
    if (openingDayArrayErrors.length) {
      errors.openingDays = openingDayArrayErrors;
    }
  }
  return errors;
}

class OpeningPeriods extends React.Component {
  static propTypes = {
    dateFormat: PropTypes.string,
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.shape({
      entries: PropTypes.shape({
        POST: PropTypes.func,
        GET: PropTypes.func,
        PUT: PropTypes.func,
        DELETE: PropTypes.func,
      }),
    }).isRequired,
  };

  static manifest = Object.freeze({
    entries: {
      type: 'okapi',
      records: 'descriptions',
      path: 'calendar/eventdescriptions',
      GET: {
        path: 'calendar/eventdescriptions',
      },
      POST: {
        path: 'calendar/eventdescriptions',
      },
      PUT: {
        path: 'calendar/eventdescriptions',
      },
      DELETE: {
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
        paneTitle="Opening periods"
        entryLabel="Opening period"
        nameKey="description"
        permissions={{
          post: 'calendar.collection.add',
          put: 'calendar.collection.update',
          delete: 'calendar.collection.remove',
        }}
        validate={validate}
        defaultEntry={{ description: '',
          twelveHour: false,
          openingDays: [
            { day: 'MONDAY', startHour: '0', startMinute: '0', endHour: '0', endMinute: '0', allDay: false, open: false },
            { day: 'TUESDAY', startHour: '0', startMinute: '0', endHour: '0', endMinute: '0', allDay: false, open: false },
            { day: 'WEDNESDAY', startHour: '0', startMinute: '0', endHour: '0', endMinute: '0', allDay: false, open: false },
            { day: 'THURSDAY', startHour: '0', startMinute: '0', endHour: '0', endMinute: '0', allDay: false, open: false },
            { day: 'FRIDAY', startHour: '0', startMinute: '0', endHour: '0', endMinute: '0', allDay: false, open: false },
            { day: 'SATURDAY', startHour: '0', startMinute: '0', endHour: '0', endMinute: '0', allDay: false, open: false },
            { day: 'SUNDAY', startHour: '0', startMinute: '0', endHour: '0', endMinute: '0', allDay: false, open: false }] }}
      />
    );
  }
}

export default OpeningPeriods;
