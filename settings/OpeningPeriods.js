import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import dateFormat from 'dateformat';
import EntryManager from '@folio/stripes-smart-components/lib/EntryManager';
import { stripesShape } from '@folio/stripes-core/src/Stripes';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import AddOpeningDayForm from './AddOpeningDayForm';
import ViewOpeningDay from './ViewOpeningDay';
import ErrorBoundary from '../ErrorBoundary';

function invalidInterval(startTime, endTime) {
  if (startTime === undefined || endTime === undefined) {
    return true;
  }
  const currentDate = new Date();
  const startDate = moment(`${dateFormat(currentDate, 'yyyy-mm-dd')}T${startTime}`);
  const endDate = moment(`${dateFormat(currentDate, 'yyyy-mm-dd')}T${endTime}`);
  return startDate.isSameOrAfter(endDate);
}

const defaultOpeningHour = { startTime: undefined, endTime: undefined };
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
    
    if (!values.startDate) {
      errors.startDate = (<SafeHTMLMessage id="ui-calendar.settings.error.startDateRequired" />);
    }

    if (!values.endDate) {
      errors.endDate = (<SafeHTMLMessage id="ui-calendar.settings.error.endDateRequired" />);
    }

    if (moment(values.startDate).isAfter(moment(values.endDate))) {
      errors.endDate = (<SafeHTMLMessage id="ui-calendar.settings.error.invalidDateRange" />);
    }

    if (!values.description) {
      errors.description = (<SafeHTMLMessage id="ui-calendar.settings.error.descriptionRequired" />);
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
            if (openingHour.startTime === undefined) {
              openingHourErrors.startTime = (<SafeHTMLMessage id="ui-calendar.settings.error.startTimeRequired" />);
              openingHourArrayErrors[hourIndex] = openingHourErrors;
            }
            if (openingHour.endTime === undefined) {
              openingHourErrors.endTime = (<SafeHTMLMessage id="ui-calendar.settings.error.endTimeRequired" />);
              openingHourArrayErrors[hourIndex] = openingHourErrors;
            } else if (invalidInterval(openingHour.startTime, openingHour.endTime)) {
              openingHourErrors.endTime = (<SafeHTMLMessage id="ui-calendar.settings.error.invalidTimeRange" />);
              openingHourArrayErrors[hourIndex] = openingHourErrors;
            }
            const currentDate = new Date();
            const currStartTime = moment(`${dateFormat(currentDate, 'yyyy-mm-dd')}T${openingHour.startTime}`);
            const currEndTime = moment(`${dateFormat(currentDate, 'yyyy-mm-dd')}T${openingHour.endTime}`);
            for (let previousIndex = 0; previousIndex < hourIndex; previousIndex++) {
              const prevOpeningHour = openingDay.openingHour[previousIndex];
              const prevStartTime = moment(`${dateFormat(currentDate, 'yyyy-mm-dd')}T${prevOpeningHour.startTime}`);
              const prevEndTime = moment(`${dateFormat(currentDate, 'yyyy-mm-dd')}T${prevOpeningHour.endTime}`);
              if ((currStartTime.isSameOrAfter(prevStartTime) && currStartTime.isBefore(prevEndTime))
                || (currStartTime.isSameOrBefore(prevStartTime) && currEndTime.isAfter(prevStartTime))
              ) {
                openingHourErrors.startTime = (<SafeHTMLMessage id="ui-calendar.settings.error.overlappingInterval" />);
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
          defaultEntry={{
            descriptionType: 'OPENING_DAY',
            openingDays: openingDayList,
          }}
        />
      </ErrorBoundary>
    );
  }
}

export default OpeningPeriods;
