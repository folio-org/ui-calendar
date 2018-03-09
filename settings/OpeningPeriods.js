import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import EntryManager from '@folio/stripes-smart-components/lib/EntryManager';
import { stripesShape } from '@folio/stripes-core/src/Stripes';

import AddOpeningDayForm from './AddOpeningDayForm';
import ViewOpeningDay from './ViewOpeningDay';
import ErrorBoundary from '../ErrorBoundary';

function invalidHour(hour, minute) {
  const currentDate = new Date();
  const currentTime = moment([currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay(), hour, minute]);
  return currentTime.invalidAt() === 3;
}

function invalidMinute(hour, minute) {
  const currentDate = new Date();
  const currentTime = moment([currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay(), hour, minute]);
  const checkTime = moment([currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay(), 0, minute]);
  return checkTime.invalidAt() === 4 && (currentTime.invalidAt() === 3 || currentTime.invalidAt() === 4);
}

function invalidInterval(startHour, startMinute, endHour, endMinute) {
  const currentDate = new Date();
  const startTime = moment([currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay(), startHour, startMinute]);
  const endTime = moment([currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay(), endHour, endMinute]);
  return startTime.isSameOrAfter(endTime);
}

const defaultOpeningHour = { startHour: 0, startMinute: 0, endHour: 0, endMinute: 0 };
function getOpeningDay(currentDay) {
  return { day: currentDay, openingHour: [defaultOpeningHour], allDay: false, open: false };
}

class OpeningPeriods extends React.Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
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
      errors.startDate = intl.formatMessage({ id: 'ui-calendar.settings.error.startDateRequired' });
    }

    if (!values.endDate) {
      errors.endDate = intl.formatMessage({ id: 'ui-calendar.settings.error.endDateRequired' });
    }

    if (moment(values.startDate).isSameOrAfter(moment(values.endDate))) {
      errors.endDate = intl.formatMessage({ id: 'ui-calendar.settings.error.invalidDateRange' });
    }

    if (!values.description) {
      errors.description = intl.formatMessage({ id: 'ui-calendar.settings.error.descriptionRequired' });
    }

    if (values.openingDays && values.openingDays.length) {
      const openingDayArrayErrors = [];
      values.openingDays.forEach((openingDay, index) => {
        const openingDayErrors = {};
        if (openingDay && openingDay.open && !openingDay.allDay) {
          const openingHourArrayErrors = [];
          for (let hourIndex = 0; hourIndex < openingDay.openingHour.length; hourIndex++) {
            const openingHour = openingDay.openingHour[hourIndex];
            const openingHourErrors = {};
            if (invalidHour(openingHour.startHour, openingHour.startMinute)) {
              openingHourErrors.startHour = intl.formatMessage({ id: 'ui-calendar.settings.error.invalidHour' });
              openingHourArrayErrors[hourIndex] = openingHourErrors;
            }
            if (invalidMinute(openingHour.startHour, openingHour.startMinute)) {
              openingHourErrors.startMinute = intl.formatMessage({ id: 'ui-calendar.settings.error.invalidMinute' });
              openingHourArrayErrors[hourIndex] = openingHourErrors;
            }
            if (invalidHour(openingHour.endHour, openingHour.endMinute)) {
              openingHourErrors.endHour = intl.formatMessage({ id: 'ui-calendar.settings.error.invalidHour' });
              openingHourArrayErrors[hourIndex] = openingHourErrors;
            }
            if (invalidMinute(openingHour.endHour, openingHour.endMinute)) {
              openingHourErrors.endMinute = intl.formatMessage({ id: 'ui-calendar.settings.error.invalidMinute' });
              openingHourArrayErrors[hourIndex] = openingHourErrors;
            }
            if (invalidInterval(openingHour.startHour, openingHour.endHour, openingHour.endHour, openingHour.endMinute)) {
              openingHourErrors.endHour = intl.formatMessage({ id: 'ui-calendar.settings.error.invalidTimeRange' });
              openingHourArrayErrors[hourIndex] = openingHourErrors;
            }
            const currentDate = new Date();
            const currStartTime = moment([currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay(), openingHour.startHour, openingHour.startMinute]);
            const currEndTime = moment([currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay(), openingHour.endHour, openingHour.endMinute]);
            for (let previousIndex = 0; previousIndex < hourIndex; previousIndex++) {
              const prevOpeningHour = openingDay.openingHour[previousIndex];
              const prevStartTime = moment([currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay(), prevOpeningHour.startHour, prevOpeningHour.startMinute]);
              const prevEndTime = moment([currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay(), prevOpeningHour.endHour, prevOpeningHour.endMinute]);
              if ((currStartTime.isSameOrAfter(prevStartTime) && currStartTime.isBefore(prevEndTime))
                || (currStartTime.isSameOrBefore(prevStartTime) && currEndTime.isAfter(prevStartTime))
              ) {
                openingHourErrors.startHour = intl.formatMessage({ id: 'ui-calendar.settings.error.overlappingInterval' });
                openingHourArrayErrors[hourIndex] = openingHourErrors;
              }
            }
            if (openingHourArrayErrors.length) {
              openingDayErrors.openingHour = openingHourArrayErrors;
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

  render() {
    const dayList = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

    const openingDayList = [];
    dayList.forEach((day) => {
      openingDayList.push(getOpeningDay(day));
    });

    return (
      <ErrorBoundary>
        <EntryManager
          {...this.props}
          parentMutator={this.props.mutator}
          entryList={_.sortBy((this.props.resources.entries || {}).records || [], ['startDate'])}
          detailComponent={ViewOpeningDay}
          formComponent={AddOpeningDayForm}
          paneTitle={this.props.stripes.intl.formatMessage({ id: 'ui-calendar.settings.openingPeriods' })}
          entryLabel={this.props.stripes.intl.formatMessage({ id: 'ui-calendar.settings.openingPeriod' })}
          nameKey="description"
          permissions={{
            post: 'calendar.collection.add',
            put: 'calendar.collection.update',
            delete: 'calendar.collection.remove',
          }}
          validate={this.validate}
          defaultEntry={{ description: '',
            openingDays: openingDayList,
          }}
          days={dayList}
        />
      </ErrorBoundary>
    );
  }
}

export default OpeningPeriods;
