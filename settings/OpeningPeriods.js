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
    this.validate = this.validate.bind(this);
  }  
  
  validate(values) {
    const errors = { openingDays: {} };
    const intl = this.props.stripes.intl;

    if (!values.startDate) {
      errors.startDate = intl.formatMessage({id: "ui-calendar.settings.error.startDateRequired"});
    }
  
    if (!values.endDate) {
      errors.endDate = intl.formatMessage({id: "ui-calendar.settings.error.endDateRequired"});
    }
  
    if (values.startDate && values.endDate && new Date(values.startDate).getTime() > (new Date(values.endDate)).getTime()) {
      errors.endDate = intl.formatMessage({id: "ui-calendar.settings.error.invalidDateRange"});
    }
  
    if (!values.description) {
      errors.description = intl.formatMessage({id: "ui-calendar.settings.error.descriptionRequired"});
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
              openingHourErrors.startHour = intl.formatMessage({id: "ui-calendar.settings.error.invalidHour"});
              openingHourArrayErrors[hourIndex] = openingHourErrors;
            }
            if (invalidMinute(openingHour.startMinute)) {
              openingHourErrors.startMinute = intl.formatMessage({id: "ui-calendar.settings.error.invalidMinute"});
              openingHourArrayErrors[hourIndex] = openingHourErrors;
            }
            if (invalidHour(openingHour.endHour, values.twelveHour)) {
              openingHourErrors.endHour = intl.formatMessage({id: "ui-calendar.settings.error.invalidHour"});
              openingHourArrayErrors[hourIndex] = openingHourErrors;
            }
            if (invalidMinute(openingHour.endMinute)) {
              openingHourErrors.endMinute = intl.formatMessage({id: "ui-calendar.settings.error.invalidMinute"});
              openingHourArrayErrors[hourIndex] = openingHourErrors;
            }
            if (!invalidHour(openingHour.startHour /* , values.twelveHour*/) && !invalidHour(openingHour.endHour /* , values.twelveHour*/)) {
              if (parseInt(openingHour.startHour, 10) > parseInt(openingHour.endHour, 10)) {
                openingHourErrors.endHour = intl.formatMessage({id: "ui-calendar.settings.error.invalidHourRange"});
                openingHourArrayErrors[hourIndex] = openingHourErrors;
              } else if (parseInt(openingHour.startHour, 10) === parseInt(openingHour.endHour, 10)
                && !invalidMinute(openingHour.startMinute)
                && !invalidMinute(openingHour.endMinute)
                && parseInt(openingHour.startMinute, 10) >= parseInt(openingHour.endMinute, 10)) {
                openingHourErrors.endMinute = intl.formatMessage({id: "ui-calendar.settings.error.invalidMinuteRange"});
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
  
  render() {
    return (
      <EntryManager
        {...this.props}
        parentMutator={this.props.mutator}
        entryList={_.sortBy((this.props.resources.entries || {}).records || [], ['startDate'])}
        detailComponent={ViewOpeningDay}
        formComponent={AddOpeningDayForm}
        paneTitle={this.props.stripes.intl.formatMessage({id: "ui-calendar.settings.openingPeriods"})}
        entryLabel={this.props.stripes.intl.formatMessage({id: "ui-calendar.settings.openingPeriod"})}
        nameKey="description"
        permissions={{
          post: 'calendar.collection.add',
          put: 'calendar.collection.update',
          delete: 'calendar.collection.remove',
        }}
        validate={this.validate}
        defaultEntry={{ description: '',
          twelveHour: false,
          openingDays: [
            { day: 'MONDAY', openingHour: [{ startHour: '0', startMinute: '0', endHour: '0', endMinute: '0' }], allDay: false, open: false},
            { day: 'TUESDAY', openingHour: [{ startHour: '0', startMinute: '0', endHour: '0', endMinute: '0' }], allDay: false, open: false},
            { day: 'THURSDAY', openingHour: [{ startHour: '0', startMinute: '0', endHour: '0', endMinute: '0' }], allDay: false, open: false},
            { day: 'WEDNESDAY', openingHour: [{ startHour: '0', startMinute: '0', endHour: '0', endMinute: '0' }], allDay: false, open: false},
            { day: 'FRIDAY', openingHour: [{ startHour: '0', startMinute: '0', endHour: '0', endMinute: '0' }], allDay: false, open: false},
            { day: 'SATURDAY', openingHour: [{ startHour: '0', startMinute: '0', endHour: '0', endMinute: '0' }], allDay: false, open: false},
            { day: 'SUNDAY', openingHour: [{ startHour: '0', startMinute: '0', endHour: '0', endMinute: '0' }], allDay: false, open: false}] }}
      />
    );
  }
}

export default OpeningPeriods;
