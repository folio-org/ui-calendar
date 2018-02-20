/* eslint-disable linebreak-style,no-undef */
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
        
        const openingHourArrayErrors = [];
        openingDay.openingHour.forEach((openingHour, hourIndex) => {
          const openingHourErrors = {};
          if (invalidHour(openingHour.startHour, values.twelveHour)) {
            openingHourErrors.startHour = 'Must be a valid hour!';
            openingHourArrayErrors[hourIndex] = openingHourErrors;
          }
          if (invalidMinute(openingHour.startMinute)) {
            openingHourErrors.startMinute = 'Must be a valid minute!';
            openingHourArrayErrors[hourIndex] = openingHourErrors;
          }
          if (invalidHour(openingHour.endHour, values.twelveHour)) {
            openingHourErrors.endHour = 'Must be a valid hour!';
            openingHourArrayErrors[hourIndex] = openingHourErrors;
          }
          if (invalidMinute(openingHour.endMinute)) {
            openingHourErrors.endMinute = 'Must be a valid minute!';
            openingHourArrayErrors[hourIndex] = openingHourErrors;
          }
          if (!invalidHour(openingHour.startHour /* , values.twelveHour*/) && !invalidHour(openingHour.endHour /* , values.twelveHour*/)) {
            if (parseInt(openingHour.startHour, 10) > parseInt(openingHour.endHour, 10)) {
              openingHourErrors.endHour = 'Closing hour must be after opening hour!';
              openingHourArrayErrors[hourIndex] = openingHourErrors;
            } else if (parseInt(openingHour.startHour, 10) === parseInt(openingHour.endHour, 10)
              && !invalidMinute(openingHour.startMinute)
              && !invalidMinute(openingHour.endMinute)
              && parseInt(openingHour.startMinute, 10) >= parseInt(openingHour.endMinute, 10)) {
              openingHourErrors.endMinute = 'Closing minute must be after opening minute!';
              openingHourArrayErrors[hourIndex] = openingHourErrors;
            }
          }
          if (openingHourArrayErrors.length) {
            openingDayErrors.openingHour = openingHourArrayErrors;
            openingDayArrayErrors[index] = openingDayErrors;
          }
        });
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
            { day: 'MONDAY', openingHour: [{ startHour: '0', startMinute: '0', endHour: '0', endMinute: '0' }], allDay: false, open: false },
            { day: 'TUESDAY', openingHour: [{ startHour: '0', startMinute: '0', endHour: '0', endMinute: '0' }], allDay: false, open: false },
            { day: 'WEDNESDAY', openingHour: [{ startHour: '0', startMinute: '0', endHour: '0', endMinute: '0' }], allDay: false, open: false },
            { day: 'THURSDAY', openingHour: [{ startHour: '0', startMinute: '0', endHour: '0', endMinute: '0' }], allDay: false, open: false },
            { day: 'FRIDAY', openingHour: [{ startHour: '0', startMinute: '0', endHour: '0', endMinute: '0' }], allDay: false, open: false },
            { day: 'SATURDAY', openingHour: [{ startHour: '0', startMinute: '0', endHour: '0', endMinute: '0' }], allDay: false, open: false },
            { day: 'SUNDAY', openingHour: [{ startHour: '0', startMinute: '0', endHour: '0', endMinute: '0' }], allDay: false, open: false }] }}
      />
    );
  }
}

export default OpeningPeriods;
